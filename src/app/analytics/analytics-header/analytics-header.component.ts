import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { PatientDataService } from '../dataServices/data.service';

@Component({
  selector: 'app-analytics-header',
  templateUrl: './analytics-header.component.html',
  styleUrls: ['./analytics-header.component.scss']
})
export class AnalyticsHeaderComponent implements OnInit {
  @Output() selectPatientTab = new EventEmitter<string>();
  isSelectedTab: any = "patientview";
  patientData: any = null;
  fromRecordCount: any = 0;
  toRecordCount: any = 0;
  groupper: any = [];
  previous: any;
  next: any
  present: any

  totalRecords: any = 0;

  isWorkinProgress: any;

  constructor(private dataService: DataService,
    private patientDataService: PatientDataService,) {

    this.patientDataService.patientCountData.subscribe(data => {

      if (data) {
        this.patientData = data;

        let paginationdata = this.dataService.paginationDataprepare(data)

        this.next = paginationdata.next;
        this.previous = paginationdata.previous;
        this.present = paginationdata.present;
        this.totalRecords = paginationdata.totalCount;
        this.fromRecordCount = paginationdata.fromCount;
        this.toRecordCount = paginationdata.toCount;
      } else {
        this.previous = null;
        this.next = null;
        this.present = null;
        this.fromRecordCount = 0;
        this.toRecordCount = 0;
        this.totalRecords = 0;
      }
    })
  }

  isObjectPresent(objectdata, key) {
    if (key in objectdata && objectdata[key]) {
      return true;
    } else {
      return false;
    }
  }

  getParamValue(URL, variable) {
    if (URL.indexOf("?") != -1) {
      let splitURL = URL.split("?");
      let splitParams = splitURL[1].split("&");
      for (let i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == variable) {
          return singleURLParam[1];
        }
      }
    } else {
      return null;
    }

  }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
        if (this.groupper.includes('Analytics_Cohort')) {
          this.isSelectedTab = 'cohoryQuery';
          this.selectPatientTab.emit(this.isSelectedTab);
        }
        if ((this.groupper.includes('Analytics_Patientview'))) {
          this.isSelectedTab = 'patientview';
          this.selectPatientTab.emit(this.isSelectedTab);
        }
      }
    }
  }

  gotoPreviousPage() {
    this.patientDataService.patientPaginationCall(this.previous);
  }

  gotoNextPage() {
    this.patientDataService.patientPaginationCall(this.next);
  }

  onFilterText(event) {
    this.patientDataService.sendPatinetFilterData(event.target.value);
  }

  onSelectTab(selectedTab) {
    this.selectPatientTab.emit(selectedTab);
    this.isSelectedTab = selectedTab;
  }

}
