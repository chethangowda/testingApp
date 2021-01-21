import { Component, OnInit } from '@angular/core';
import { UserDashboardService } from '../../../services/userdashboard.services';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, } from '@angular/common/http';

@Component({
  selector: 'app-coverage-requirements',
  templateUrl: './coverage-requirements.component.html',
  styleUrls: ['./coverage-requirements.component.scss']
})
export class CoverageRequirementsComponent implements OnInit {
  pasdata: any
  // selectedRow = {};
  selectedRow: any
  timer: any;

  constructor(public apiservice: UserDashboardService, private _http: HttpClient) {
    this.getData();
  }

  ngOnInit() {
    this.timer = this.interval();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  interval() {
    return setInterval(() => {
      this.getData();
    }, 5000)
  }

  getData() {
    this.apiservice.priorAuthorizationSupport().subscribe(data => {
      this.pasdata = data;
    })
  }

  getRandomNumber() {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return random.toString();
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  onSubmit(selectedRow) {
    this.selectedRow = selectedRow;
    this.updateDTRStatus();
    this.generateBundle(JSON.stringify(selectedRow.crdRequest));
  }


  updateDTRStatus() {
    const statusReqBody = {};
    statusReqBody['dtrStatus'] = 'Completed';
    fetch("https://demo.interopx.com:8443/orders/" + this.selectedRow.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusReqBody)
    })
      .then(response => {
        if (response.status != 200) {
          return response;
        } else {
          return response.json();
        }
      })
      .then(result => {
        let orders = this.pasdata;
        for (var i = 0; i < orders.length; i++) {
          if (orders[i].id === result.id) {
            orders[i] = result;
          }
        }
        this.pasdata = orders
      });
  }



  generateBundle(selectedRow) {
    const bundle = JSON.parse(selectedRow).context.draftOrders;
    const pasBundle = {
      resourceType: "Bundle",
      id: this.uuidv4(),
      type: "collection"
    };
    let bundleEntries = bundle.entry;
    const pasClaim = {
      resourceType: "Claim",
      id: this.getRandomNumber().toString(),
      status: "active",
      type: {
        "coding": [
          {
            "system": "http://example.org/UM_REQUEST_CATEGORY_CODE",
            "code": "SC",
            "display": "Specialty Care Review"
          }
        ]
      },
      use: "preauthorization",
      created: moment(new Date()).format('YYYY-MM-DD'),
      priority: {
        coding: [
          {
            system: "http://terminology/hl7.org/CodeSystem/processpriority",
            code: "normal",
            display: "Normal"
          }
        ]
      }
    };
    for (let i = 0; i < bundleEntries.length; i++) {

      const resource = bundleEntries[i].resource;
      bundleEntries[i]['fullUrl'] = "/" + resource.resourceType + "/" + resource.id;
      if (resource.resourceType === 'Patient') {
        pasClaim['patient'] = { reference: resource.resourceType + "/" + resource.id };
      }
      if (resource.resourceType === 'Organization') {
        pasClaim['insurer'] = { reference: resource.resourceType + "/" + resource.id };
      }
      if (resource.resourceType === 'Location') {
        pasClaim['facility'] = { reference: resource.resourceType + "/" + resource.id };
      }

      if (resource.resourceType === 'Condition') {
        pasClaim['diagnosis'] = [
          {
            sequence: 1,
            diagnosisReference: {
              reference: resource.resourceType + "/" + resource.id
            }
          }
        ];
      }

      if (resource.resourceType === 'Coverage') {
        pasClaim['insurance'] = [
          {
            sequence: 1,
            focal: true,
            coverage: {
              reference: resource.resourceType + "/" + resource.id
            }
          }
        ];
      }
    }

    bundleEntries.push({ fullUrl: '/Claim/' + pasClaim.id, resource: pasClaim });
    pasBundle['entry'] = bundleEntries;

    this.submitPAS(pasBundle);
  }



  submitPAS(pasBundle) {
    fetch("https://dev.interopx.com/InteropXFHIR/fhir/Claim/$submit", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json+fhir',
        'Authorization': 'Bearer 290c002337428c4f00b3ec4ddf962a16'
      },
      body: JSON.stringify(pasBundle)
    })
      .then(response => {
        if (response.status != 200) {
          return response.json();
        } else {
          return response.json();
        }

      })
      .then(result => {
        const pasResponse = result;
        const bundleEntries = pasResponse.entry;
        const claimResponseResource = bundleEntries.filter(x => {
          return x.resource.resourceType === 'ClaimResponse';
        });
        const claimResponseStatus = claimResponseResource[0].resource.extension[0].valueCode;
        const claimResponseIdentifier = claimResponseResource[0].resource.identifier[0].value;
        if (claimResponseStatus === 'A4' || claimResponseStatus === 'A6') {
          setTimeout((x) => {
            this.pollClaimResponse(claimResponseIdentifier);
          }, 10000);
        }
        this.updatePASStatus(claimResponseStatus, claimResponseResource[0]);
      });
  }


  pollClaimResponse(identifier) {
    fetch("https://dev.interopx.com/InteropXFHIR/fhir/ClaimResponse?identifier=" + identifier, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json+fhir',
        'Authorization': 'Bearer 290c002337428c4f00b3ec4ddf962a16'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(result => {
        const bundleEntries = result.entry;
        const claimResponseResource = bundleEntries[0].resource;
        const claimResponseStatus = claimResponseResource.extension[0].valueCode;
        const claimResponseIdentifier = claimResponseResource.identifier[0].value;
        if (claimResponseStatus === 'A4' || claimResponseStatus === 'A6') {
          setTimeout((x) => {
            this.pollClaimResponse(claimResponseIdentifier);
          }, 10000);
        }
        this.updatePASStatus(claimResponseStatus, claimResponseResource);
      });
  }

  updatePASStatus(claimResponseStatus, claimResponseResource) {
    const statusReqBody = {};
    if (claimResponseStatus === 'A1' || claimResponseStatus === 'NA') {
      statusReqBody['pasStatus'] = 'Approved';
    } else if (claimResponseStatus === 'A2') {
      statusReqBody['pasStatus'] = 'Partially Approved';
    } else if (claimResponseStatus === 'A3') {
      statusReqBody['pasStatus'] = 'Rejected';
    } else if (claimResponseStatus === 'A4' || claimResponseStatus === 'A6') {
      statusReqBody['pasStatus'] = 'Pended';
    } else if (claimResponseStatus === 'CT' || claimResponseStatus === 'C') {
      statusReqBody['pasStatus'] = 'Contact Payer';
    }
    statusReqBody['pasResponse'] = claimResponseResource;
    fetch("https://demo.interopx.com:8443/orders/" + this.selectedRow.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusReqBody)
    })
      .then(response => {
        if (response.status != 200) {
          return response;
        } else {
          return response.json();
        }
      })
      .then(result => {
        let orders = this.pasdata;
        for (var i = 0; i < orders.length; i++) {
          if (orders[i].id === result.id) {
            orders[i] = result;
          }
        }
        this.pasdata = orders
      });
  }

}
