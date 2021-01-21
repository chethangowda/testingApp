import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, Sort, MatSelectChange, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatasourcesService } from '../datasources.service';
import { LoaderService } from 'src/core/loader/loader.service';
import { DatasourceService } from 'src/services/datasourcec.service';
import { DatePipe } from '@angular/common';
import { SecurityConfigService } from 'src/services/security-config.service';
import { CustomValidators } from './../../../validators/customovalidator';

@Component({
  selector: 'app-datasource-content',
  templateUrl: './datasource-content.component.html',
  styleUrls: ['./datasource-content.component.scss']
})
export class DatasourceContentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'dsourcename', 'endpoint', 'connector', 'security', 'actions'];
  dataSource = new MatTableDataSource();
  filesToUpload: Array<File> = [];
  renderDS: any;
  connectorvalue: any;
  connectorTypes: any;
  FHIRversions: any;
  title: any;
  panel: any;
  connector: any;
  fd: any;
  action: any;
  filenamegrp: any;
  deletefile: boolean = false;
  dsTypeForm: FormGroup;
  enablelinks: any;
  createds: boolean = false;
  dsArray: any = [];
  groupper: any = [];
  hide: boolean = true;
  ccda: boolean = false;
  Sort: MatSort;
  scopes = [
    { value: 'system/*.read', viewValue: 'System/*.read' },
    { value: 'User/*.read', viewValue: 'User/*.read' }
  ];
  // FHIRversions = [
  //   { value: 'DSTU2', viewValue: 'DSTU2' },
  //   { value: 'DSTU3', viewValue: 'DSTU3' },
  //   { value: 'R4', viewValue: 'R4' }
  // ];
  securities = [
    { value: 'Open', viewValue: 'Open' },
    { value: 'BULK-API', viewValue: 'BULK-API' }
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  transformationDatasource: any;
  linkedds: boolean;
  isShowTransformationTable: boolean = false;
  pageno: number;
  pagesize: number = 10;
  json: object
  page_no: any;
  securityMethod: any;
  filterText: any;
  Object: any = [];
  errors: boolean = false;

  subscriptionPagination: any;
  subscriptionFilter: any;
  subscriptionButton: any;

  constructor(private datasrcservice: DatasourcesService, private dsservice: DatasourceService, private systemconfig: SecurityConfigService, private fb: FormBuilder, private notification: LoaderService) {
    this.subscriptionFilter = this.datasrcservice.datasrcSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSource.filter = this.filterText.trim();
    })

    this.subscriptionPagination = this.datasrcservice.datasrcPAgination.subscribe(data => {
      if (data) {
        let param = {
          page_no: data,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param);
      }
    })

    this.subscriptionButton = this.datasrcservice.datasourcecModuleCreateBtn.subscribe(data => {
      this.dsTypeForm.reset();
      this.enablelinks = {
        flatfiletype: false,
        fhirtype: false,
        ccdatype: false,
        bulkfhir: false
      }
      this.createds = true;
      this.title = 'Create';
      this.getconfiglist();
      // this.closebtn = true;
      this.panel = "";
    })

  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
    this.subscriptionButton.unsubscribe();
  }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }
    this.getAllConnectors();
    this.getfhirversion();
    this.dsTypeForm = this.fb.group({
      'dsname': new FormControl('', [Validators.required, Validators.pattern("^[a-z A-Z 0-9]+$")]),
      'connectortype': new FormControl('', [Validators.required]),
      'flatfileForm': new FormGroup({
        'dburl': new FormControl(''),
        'dbname': new FormControl(''),
        'dbpwd': new FormControl(''),
      }),
      'fhirForm': new FormGroup({
        'fhirurl': new FormControl(''),
        'authtype': new FormControl(''),
        'fhirversion': new FormControl(''),
        'scope': new FormControl('')
      }),
      'bulkfhirForm': new FormGroup({
        'clientid': new FormControl(''),
        'issuedurl': new FormControl(''),
      }),
      'ccdaForm': new FormGroup({
        'filelocation': new FormControl('', [CustomValidators.filePath])
        //  'filelocation': new FormControl('', [Validators.pattern("(?:[A-Za-z]:)?[\/\\]{0,2}(?:[-.\/\\ ](?![.\/\\\n])|[^<>:,'|?*.\/\\ \n])+$")])
      }),
      // 'panelForm' : new FormGroup({
      'patientpanel': new FormControl(''),
      'startcmd': new FormControl(''),
      'stopcmd': new FormControl('')
      // })

    });


    this.enablelinks = {
      flatfiletype: false,
      fhirtype: false,
      bulkfhir: false,
      ccdatype: false
    }
  }

  closeform() {
    this.createds = false;
    this.getconfiglist();

  }


  getconfiglist() {
    let param = {};
    this.systemconfig.getsystemconfigList(param).subscribe((response: any) => {
      for (let item of response) {
        if (item.key == 'dataSource_default_values') {
          let dsvalue = item.value;
          dsvalue = dsvalue.replace(/\\"/g, '"');

          const configresponse = JSON.parse(dsvalue);
          const mapped = Object.entries(configresponse).map(([key, value]) => ({ key, value }));
          this.Object = mapped;
        }

      }

    })
  }

  onauthtypeSelect() {
    if (this.dsTypeForm.get('fhirForm.authtype').value === 'BULK-API') {
      this.enablelinks['bulkfhir'] = true;
      this.setRequireValidator(this.dsTypeForm.get('fhirForm'));
      this.setRequireValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.removeValidator(this.dsTypeForm.get('flatfileForm'));
      this.removeValidator(this.dsTypeForm.get('ccdaForm'));
    } else {
      this.enablelinks['bulkfhir'] = false;
      this.setRequireValidator(this.dsTypeForm.get('fhirForm'));
      this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.removeValidator(this.dsTypeForm.get('flatfileForm'));
      this.removeValidator(this.dsTypeForm.get('ccdaForm'));
    }
  }

  onChange(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.panel = this.filesToUpload[0].name;
    this.dsTypeForm.controls['patientpanel'].setValue(this.panel);
    this.deletefile = false;
  }

  ontypeSelect() {
    if (this.dsTypeForm.get('connectortype').value === 1) {
      this.ccda = true;
      this.enablelinks['flatfiletype'] = true;
      this.enablelinks['fhirtype'] = false;
      this.enablelinks['ccdatype'] = false;
      this.enablelinks['bulkfhir'] = false;
      this.removeValidator(this.dsTypeForm.get('fhirForm'));
      this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.removeValidator(this.dsTypeForm.get('ccdaForm'));
      this.setRequireValidator(this.dsTypeForm.get('flatfileForm'));
    }
    else if (this.dsTypeForm.get('connectortype').value === 2) {
      this.ccda = true;
      this.enablelinks['flatfiletype'] = false;
      this.enablelinks['fhirtype'] = true;
      this.enablelinks['ccdatype'] = false;
      this.enablelinks['bulkfhir'] = false;
      this.setRequireValidator(this.dsTypeForm.get('fhirForm'));
      this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.removeValidator(this.dsTypeForm.get('flatfileForm'));
      this.removeValidator(this.dsTypeForm.get('ccdaForm'));
    }
    else if (this.dsTypeForm.get('connectortype').value === 3) {
      this.ccda = false;
      this.enablelinks['flatfiletype'] = false;
      this.enablelinks['fhirtype'] = false;
      this.enablelinks['ccdatype'] = true;
      this.enablelinks['bulkfhir'] = false;
      this.removeValidator(this.dsTypeForm.get('fhirForm'));
      this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.removeValidator(this.dsTypeForm.get('flatfileForm'));
      this.setRequireValidator(this.dsTypeForm.get('ccdaForm'));
    }
    else {
      this.enablelinks['flatfiletype'] = false;
      this.enablelinks['fhirtype'] = false;
      this.enablelinks['ccdatype'] = false;
      this.enablelinks['bulkfhir'] = false;
    }
  }

  setRequireValidator(form: any) {

    for (const field in form.controls) {
      let con = form.get(field);
      con.setValidators([Validators.required]);
      con.updateValueAndValidity();
    }

  }

  removeValidator(form: any) {

    for (const field in form.controls) {
      let con = form.get(field);
      con.clearValidators();
      con.updateValueAndValidity();
    }
  }

  testfn() {
    const testurl = this.dsTypeForm.get('fhirForm.fhirurl').value;
    localStorage.setItem('testurl', testurl)
    this.dsservice.testconnection().subscribe((data) => {
      if (data.status === "active") {
        this.notification.showNotificationMsg(
          'Test Connection is Successfull',
          'success',
          'Success'
        );
        localStorage.removeItem('testurl');
      }
    });
  }

  testdbconfn() {
    const param = {
      databaseUserName: this.dsTypeForm.get('flatfileForm.dbname').value,
      databasePassword: this.dsTypeForm.get('flatfileForm.dbpwd').value,
      databaseUrl: this.dsTypeForm.get('flatfileForm.dburl').value
    }
    this.dsservice.testdbcon(param).subscribe((data) => {
    });
  }

  applydatasourceFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  savedatasource() {
    var configObj = {};
    var arr = this.Object
    for (var i = 0; i < arr.length; i++) {
      configObj[arr[i].key] = arr[i].value;
    }
    let object = {}
    object['connectorId'] = this.dsTypeForm.get('connectortype').value;
    object['dataSourceName'] = this.dsTypeForm.get('dsname').value;
    object['startCommand'] = this.dsTypeForm.get('startcmd').value;
    object['stopCommand'] = this.dsTypeForm.get('stopcmd').value;
    object['datasourceConfigValues'] = JSON.stringify(configObj)
    if (this.dsTypeForm.get('connectortype').value === 1) {
      const flatfile = {
        databaseUrl: this.dsTypeForm.get('flatfileForm.dburl').value,
        databaseUserName: this.dsTypeForm.get('flatfileForm.dbname').value,
        databasePassword: this.dsTypeForm.get('flatfileForm.dbpwd').value
      }
      object['credentials'] = JSON.stringify(flatfile);
    }
    else if (this.dsTypeForm.get('connectortype').value === 3) {
      object['ccdaFilePath'] = this.dsTypeForm.get('ccdaForm.filelocation').value;
    }
    else if (this.dsTypeForm.get('connectortype').value === 2) {
      object['endPointUrl'] = this.dsTypeForm.get('fhirForm.fhirurl').value;
      object['FHIRVersion'] = this.dsTypeForm.get('fhirForm.fhirversion').value;
      if (this.dsTypeForm.get('fhirForm.authtype').value === 'Open') {
        const basicfhir = {
          scopes: this.dsTypeForm.get('fhirForm.scope').value,
        }
        object['credentials'] = JSON.stringify(basicfhir);
        object['isSecure'] = false;
      }

      else if (this.dsTypeForm.get('fhirForm.authtype').value === 'BULK-API') {
        const bulkfhir = {
          scopes: this.dsTypeForm.get('fhirForm.scope').value,
          ClientId: this.dsTypeForm.get('bulkfhirForm.clientid').value,
          issuerUrl: this.dsTypeForm.get('bulkfhirForm.issuedurl').value
        }
        object['isSecure'] = true;
        object['credentials'] = JSON.stringify(bulkfhir);
      }
    }

    if (this.title === 'Create') {
      object['isLinked'] = false;
      object['isRemoved'] = false;
      this.createdatasource(object);
    }
    else if (this.title === 'Edit') {
      object['dataSourceId'] = this.action.id;
      object['isLinked'] = this.linkedds;
      object['isRemoved'] = false;
      this.updatedatasource(object);
    }
    this.dsTypeForm.reset();
    this.createds = false;
    // this.files = [];
    this.panel = ""
    this.enablelinks = {
      flatfiletype: false,
      fhirtype: false,
      ccdatype: false,
      bulkfhir: false
    }
  }

  createdatasource(object) {
    this.fd = new FormData();
    this.fd.append('dataSource', JSON.stringify(object));
    this.fd.append('file', this.filesToUpload[0]);
    this.dsservice.createDataSource(this.fd).subscribe((res: any) => {
      if (res.message) {
        this.createds = false;
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param);
      }
      this.filesToUpload = new Array<File>();
      this.panel = '';

    });
  }

  updatedatasource(object) {
    if (this.deletefile == true && this.action.filePath !== " ") {
      object['isRemoved'] = true;
    } else if (this.deletefile == false && this.action.filePath !== " ") {
      object['isRemoved'] = false;
    }
    this.fd = new FormData();
    this.fd.append('dataSource', JSON.stringify(object));
    this.fd.append('file', this.filesToUpload[0]);
    this.dsservice.updateDataSource(this.fd).subscribe((res: any) => {
      if (res.message) {
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param);
        this.createds = false;
        this.deletefile = false;
      }
      this.filesToUpload = new Array<File>();
      this.panel = "";
    });
  }


  isEdit: boolean = false;
  onTransformationMaping(element) {
    this.isShowTransformationTable = true;
    this.transformationDatasource = element;
    this.isEdit = false;
  }

  onEditTransformationMaping(element) {
    this.isShowTransformationTable = true;
    this.transformationDatasource = element;
    this.isEdit = true;
  }

  onBackFromTransform(event) {
    this.isShowTransformationTable = false;
    if (event == 'save') {
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.paginationAPIcall(param);
    }
  }

  editdatasource(element) {
    // this.closebtn = false;
    this.action = element;
    this.linkedds = element.linked;
    setTimeout(function () {
      const elmnt = document.getElementById('scroll');
      elmnt.scrollIntoView();
    }, 300);
    this.title = 'Edit';
    this.createds = true;
    var config = JSON.parse(element.config);
    const mapped = Object.entries(config).map(([key, value]) => ({ key, value }));
    this.Object = mapped;
    this.connector = this.connectorTypes.find(option => option.connectorName == element.connector);
    const filename = element.filepath;
    if ((filename === undefined) || (filename === "")) {
      this.panel = '';
      this.dsTypeForm.controls['patientpanel'].setValue(null);
    }
    else if ((filename != "") || (filename != undefined)) {
      this.filenamegrp = filename.replace(/^.*[\\\/]/, '');
      this.panel = this.filenamegrp;
      this.dsTypeForm.controls['patientpanel'].setValue(this.panel);
    }
    this.dsTypeForm.controls['dsname'].setValue(element.dsourcename);
    this.dsTypeForm.controls['connectortype'].setValue(this.connector.id);
    this.dsTypeForm.controls['startcmd'].setValue(element.startCommand);
    this.dsTypeForm.controls['stopcmd'].setValue(element.stopCommand);

    if (this.connector.id === 1) {
      this.hide = true;
      this.ccda = true;
      this.enablelinks['flatfiletype'] = true;
      this.enablelinks['fhirtype'] = false;
      this.enablelinks['ccdatype'] = false;
      this.enablelinks['bulkfhir'] = false;
      this.removeValidator(this.dsTypeForm.get('fhirForm'));
      this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.removeValidator(this.dsTypeForm.get('ccdaForm'));
      this.setRequireValidator(this.dsTypeForm.get('flatfileForm'));
      var credentials = JSON.parse(element.credentials);
      this.dsTypeForm.patchValue({
        flatfileForm:
        {
          dburl: credentials.databaseUrl,
          dbname: credentials.databaseUserName,
          dbpwd: credentials.databasePassword
        }
      });
    }
    else if (this.connector.id === 3) {
      this.ccda = false;
      this.hide = true;
      this.enablelinks['flatfiletype'] = false;
      this.enablelinks['fhirtype'] = false;
      this.enablelinks['ccdatype'] = true;
      this.enablelinks['bulkfhir'] = false;
      this.removeValidator(this.dsTypeForm.get('fhirForm'));
      this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      this.setRequireValidator(this.dsTypeForm.get('ccdaForm'));
      this.removeValidator(this.dsTypeForm.get('flatfileForm'));
      this.dsTypeForm.patchValue({
        ccdaForm:
        {
          filelocation: element.ccdaFilePath
        }
      });
    }

    else if (this.connector.id === 2) {
      this.ccda = true;
      this.enablelinks['flatfiletype'] = false;
      this.enablelinks['fhirtype'] = true;
      this.enablelinks['ccdatype'] = false;
      this.enablelinks['bulkfhir'] = false;

      this.removeValidator(this.dsTypeForm.get('flatfileForm'));
      this.removeValidator(this.dsTypeForm.get('ccdaForm'));
      var credentials = JSON.parse(element.credentials);
      this.dsTypeForm.patchValue({
        fhirForm:
        {
          fhirurl: element.endpoint,
          fhirversion: element.fhirversion,
          scope: credentials.scopes,
          authtype: element.security
        }
      });

      if (element.security === 'Open') {
        // this.enablelinks['basicfhir'] = true;
        this.enablelinks['bulkfhir'] = false;
        this.setRequireValidator(this.dsTypeForm.get('fhirForm'));
        this.removeValidator(this.dsTypeForm.get('bulkfhirForm'));
      }

      else if (element.security === 'BULK-API') {
        // this.enablelinks['basicfhir'] = false;
        this.enablelinks['bulkfhir'] = true;

        this.setRequireValidator(this.dsTypeForm.get('fhirForm'));
        this.setRequireValidator(this.dsTypeForm.get('bulkfhirForm'));
        this.dsTypeForm.patchValue({
          bulkfhirForm:
          {
            clientid: credentials.ClientId,
            issuedurl: credentials.issuerUrl
          }
        });
      }
    }
  }

  delete() {
    this.deletefile = true;
    this.dsTypeForm.controls['patientpanel'].setValue(null);
  }

  getAllConnectors() {
    this.dsservice.getAllConnectors().subscribe((response: Response) => {
      this.connectorTypes = response;
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.paginationAPIcall(param);
    })
  }

  getfhirversion() {
    let param = {};
    this.systemconfig.getsystemconfigList(param).subscribe((response: any) => {
      for (let item of response) {
        if (item.key == 'FHIR_Version') {
          let dsvalue = item.value;
          dsvalue = dsvalue.replace(/\\"/g, '"');
          // dsvalue = JSON.stringify(dsvalue);
          var array = dsvalue.split(",");

          // var arr = this.Object
          const mapped = Object.entries(array).map(([value, viewValue]) => ({ value, viewValue }));
          this.FHIRversions = mapped;
        }

      }

    })
  }

  paginationAPIcall(URLparam) {
    this.dsservice.getdatasourcelist(URLparam).subscribe((response) => {
      if (response) {
        this.pagesize = response.pageSize;
        this.datasrcservice.senddatasrcCountList(response);
        this.dsArray = [];
        this.renderDS = response.results;
        this.page_no = response.pageNo;
        if (this.renderDS.length > 0) {
          for (let i = 0; i < this.renderDS.length; i++) {
            this.connectorvalue = this.connectorTypes.find(option => option.id == this.renderDS[i].connectorId);
            if ((this.connectorvalue.id === 2) || (this.connectorvalue.id === 3)) {
              if (this.renderDS[i].isSecure === false) {
                this.securityMethod = 'Open';
              } else if (this.renderDS[i].isSecure === true) {
                this.securityMethod = 'BULK-API';
              }
            }
            else {
              this.securityMethod = '-';
            }
            const dsoptions = {
              id: this.renderDS[i].dataSourceId,
              dsourcename: this.renderDS[i].dataSourceName,
              endpoint: this.renderDS[i].endPointUrl,
              connector: this.connectorvalue.connectorName,
              security: this.securityMethod,
              credentials: this.renderDS[i].credentials,
              databaseServer: this.renderDS[i].databaseServer,
              lastUpdated: this.renderDS[i].lastUpdated,
              filepath: this.renderDS[i].filePath,
              ccdaFilePath: this.renderDS[i].ccdaFilePath,
              linked: this.renderDS[i].isLinked,
              startCommand: this.renderDS[i].startCommand,
              stopCommand: this.renderDS[i].stopCommand,
              fhirversion: this.renderDS[i].fhirversion,
              config: this.renderDS[i].datasourceConfigValues
            };
            if (dsoptions.endpoint === undefined) {
              dsoptions.endpoint = '-';
            }
            this.dsArray.push(dsoptions);
          }
          this.dataSource = new MatTableDataSource(this.dsArray);
          this.dataSource.sort = this.Sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
            if (typeof item[property] === 'string') {
              return item[property].toLocaleLowerCase();
            }
            return item[property];
          };
        }
        else {
        }
      }

    });
  }

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }

  setDirection({ value }: MatSelectChange): void {
    this.Sort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }

}
