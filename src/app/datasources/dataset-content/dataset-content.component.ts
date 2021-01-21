import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DatasourcesService } from '../datasources.service';
import { MatTableDataSource, MatSort, Sort, MatSelectChange, MatPaginator } from '@angular/material';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { LoaderService } from 'src/core/loader/loader.service';
import { DatasourceService } from 'src/services/datasourcec.service';

@Component({
  selector: 'app-dataset-content',
  templateUrl: './dataset-content.component.html',
  styleUrls: ['./dataset-content.component.scss']
})
export class DatasetContentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'dsetname', 'frequency', 'monthdate', 'weekday', 'scheduletime', 'actions'];
  displayedsrcColumns: string[] = ['select', 'dsid', 'dsname', 'endpoint', 'connector', 'security'];
  dataSet = new MatTableDataSource();
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  dsetArray: any = [];
  dsArray: any[];
  selectedDs: any = [];
  connectorvalue: any;
  renderDS: any;
  dsnames: any;
  testitem: any;
  title: any;
  selectds: boolean;
  createdset: boolean;
  dsetForm: FormGroup;
  enablelinks: any;
  datasetObject: any = {};
  freqoptions = [
    { value: 'Daily', viewValue: 'Daily' },
    { value: 'Weekly', viewValue: 'Weekly' },
    { value: 'Monthly', viewValue: 'Monthly' },
  ];
  rangeEndAt: Date;
  endrangeStartFrom: Date;;
  getdset: any;
  resheaders: Response;
  filterText: any;
  connectorTypes: any;
  paginator: MatPaginator;
  Sort: MatSort;
  dsetsort: MatSort;
  @ViewChild(MatPaginator, { static: false }) set appBacon(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSource.paginator = this.paginator;
  };

  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };

  @ViewChild(MatSort, { static: false }) set setpage(dsetsort: MatSort) {
    this.dsetsort = dsetsort;
    this.dataSource.sort = this.dsetsort;
  };

  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  pageno: number;
  pagesize: any = 10;
  page_no: any;
  groupper: any = [];
  subscriptionPagination: any;
  subscriptionFilter: any;
  subscriptionButton: any;
  fromDateTarget: Date = new Date();

  constructor(private datasrcservice: DatasourcesService,
    private dsservice: DatasourceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: LoaderService,
    private ngZone: NgZone) {
    this.subscriptionFilter = this.datasrcservice.datasrcSearchData.subscribe(data => {
      this.filterText = data;
      this.dataSet.filter = this.filterText.trim();
    })

    this.subscriptionButton = this.datasrcservice.datasourcecModuleCreateBtn.subscribe(data => {
      this.selectedDs = [];
      this.selection = new SelectionModel(true, []);
      this.getAllConnectors();
      this.selectds = true;
      this.createdset = false;
      this.dsetForm.reset();
      this.enablelinks['weekly'] = false;
      this.enablelinks['monthly'] = false;
      this.fromDateTarget = new Date();
      this.endrangeStartFrom = undefined;
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
  }

  ngOnDestroy() {
    this.subscriptionPagination.unsubscribe();
    this.subscriptionFilter.unsubscribe();
    this.subscriptionButton.unsubscribe();
  }

  ngOnInit() {
    let userDetails = {};
    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }

    this.dsetForm = this.fb.group({
      'dsetname': new FormControl('', [Validators.required, Validators.pattern("^[a-z A-Z 0-9]+$")]),
      'frequency': new FormControl('', [Validators.required]),
      'time': new FormControl('', [Validators.required]),
      'weeklyForm': new FormGroup({
        'weekday': new FormControl('')
      }),
      'monthlyForm': new FormGroup({
        'monthdate': new FormControl('')
      }),
      'fromdate': new FormControl(''),
      'todate': new FormControl('')
    });

    this.enablelinks = {
      weekly: false,
      monthly: false
    }
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.paginationAPIcall(param);
    this.rangeEndAt = new Date();
    this.fromDateTarget = new Date();
  }

  closeform() {
    this.fromDateTarget = new Date();
    this.createdset = false;
    this.selectds = false;
    this.selection = new SelectionModel(true, []);
    this.selectedDs = [];
    this.dsetForm.reset();
    this.enablelinks['weekly'] = false;
    this.enablelinks['monthly'] = false;
  }

  setRequireValidator(form: any) {
    for (const field in form.controls) {
      let con = form.get(field);
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

  onTypeSelect() {
    if (this.dsetForm.get('frequency').value === 'Weekly') {
      this.enablelinks['weekly'] = true;
      this.enablelinks['monthly'] = false;
      this.setRequireValidator(this.dsetForm.get('weeklyForm'));
      this.removeValidator(this.dsetForm.get('monthlyForm'));
    } else if (this.dsetForm.get('frequency').value === 'Monthly') {
      this.enablelinks['weekly'] = false;
      this.enablelinks['monthly'] = true;
      this.removeValidator(this.dsetForm.get('weeklyForm'));
      this.setRequireValidator(this.dsetForm.get('monthlyForm'));
    }
    else {
      this.enablelinks['weekly'] = false;
      this.enablelinks['monthly'] = false;
      this.removeValidator(this.dsetForm.get('weeklyForm'));
      this.removeValidator(this.dsetForm.get('monthlyForm'));
    }
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  selectFromDate() {
    if (this.dsetForm.get('fromdate').value != null) {
      this.endrangeStartFrom = new Date(this.dsetForm.get('fromdate').value)
    }
    else {
      this.endrangeStartFrom = undefined;
    }
    this.checkdateRange();
  }

  clearfromDate() {
    this.dsetForm.get('fromdate').setValue(null);
    this.endrangeStartFrom = undefined;
    this.dsetForm.get('fromdate').clearValidators();
    this.dsetForm.get('fromdate').updateValueAndValidity();
  }

  cleartoDate() {
    this.dsetForm.get('todate').setValue(null);
    this.fromDateTarget = new Date();
    this.dsetForm.get('todate').clearValidators();
    this.dsetForm.get('todate').updateValueAndValidity();
  }

  selectToDate() {
    if (this.dsetForm.get('todate').value != null) {
      this.fromDateTarget = new Date(this.dsetForm.get('todate').value);
    }
    else {
      this.fromDateTarget = new Date();
    }
    this.checkdateRange();
  }

  checkdateRange() {
    this.ngZone.run(() => {
      if ((this.dsetForm.value.fromdate && this.dsetForm.value.todate) &&
        (this.dsetForm.value.fromdate !== 'null' && this.dsetForm.value.todate !== 'null')) {
        if (this.dsetForm.value.fromdate > this.dsetForm.value.todate) {
          this.dsetForm.controls['fromdate'].setErrors({ notvalidFromDate: true });
        } else {
          this.dsetForm.controls['fromdate'].setErrors(null);
        }

        if (this.dsetForm.value.todate < this.dsetForm.value.fromdate) {
          this.dsetForm.controls['todate'].setErrors({ notvalidToDate: true });
        } else {
          this.dsetForm.controls['todate'].setErrors(null);
        }
      }
    })
    this.validateAllFields(this.dsetForm);
  }

  savedataset() {

    let datasetObject = {}
    datasetObject['dataSetName'] = this.dsetForm.get('dsetname').value;
    datasetObject['scheduleFrequency'] = this.dsetForm.get('frequency').value;
    datasetObject['scheduleTime'] = this.dsetForm.get('time').value;

    if (this.dsetForm.get('fromdate').value != "null" && this.dsetForm.get('fromdate').value) {
      datasetObject['fromdate'] = this.dsetForm.get('fromdate').value;
    }
    if (this.dsetForm.get('todate').value != "null" && this.dsetForm.get('todate').value) {
      datasetObject['todate'] = this.dsetForm.get('todate').value;
    }

    if (this.dsetForm.get('frequency').value === 'Weekly') {
      datasetObject['weekday'] = this.dsetForm.get('weeklyForm.weekday').value;
      delete datasetObject["monthdate"];
    }
    if (this.dsetForm.get('frequency').value === 'Monthly') {
      datasetObject['monthdate'] = this.datePipe.transform(this.dsetForm.get('monthlyForm.monthdate').value, 'yyyy-MM-dd');
      delete datasetObject["weekday"];
    }
    if (this.dsetForm.get('frequency').value === 'Daily') {
      delete datasetObject["weekday"];
      delete datasetObject["monthdate"];
    }
    if (this.title === 'Create') {
      datasetObject['datasources'] = this.selectedDs;
      this.createds(datasetObject);
    }
    if (this.title === 'Edit') {
      datasetObject['dataSetId'] = this.getdset.id;
      datasetObject['datasources'] = this.getdset.datasources;
      this.editds(datasetObject);
    }

    this.dsetForm.reset();
    this.createdset = false;
  }

  createds(datasetObject) {
    this.dsservice.createDatasets(datasetObject).subscribe((res) => {
      if (res) {
        this.notification.showNotificationMsg('Data Set Created Successfully', 'success', 'Success');
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param);
        this.createdset = false;
      }
    });
  }

  editds(datasetObject) {
    this.dsservice.editDatasetRow(datasetObject).subscribe((res: any) => {
      this.resheaders = res;
      if (this.resheaders) {
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.paginationAPIcall(param);
        this.createdset = false;
        this.notification.showNotificationMsg(
          'Data Set Updated Successfully',
          'success',
          'Success'
        );
      }
    });
  }

  paginationAPIcall(URLparam) {
    this.dsservice.getdatasetlist(URLparam).subscribe((response) => {
      this.datasrcservice.senddatasrcCountList(response);
      this.dsetArray = [];
      this.renderDS = response.results;
      if (this.renderDS.length > 0) {
        for (let i = 0; i < this.renderDS.length; i++) {
          const dsetObject = {
            id: this.renderDS[i].dataSetId,
            datasources: this.renderDS[i].datasources,
            dsetname: this.renderDS[i].dataSetName,
            frequency: this.renderDS[i].scheduleFrequency,
            scheduletime: this.renderDS[i].scheduleTime,
            fromdate: this.renderDS[i].fromdate,
            todate: this.renderDS[i].todate,
            lastUpdated: this.renderDS[i].lastUpdated,
            weekday: this.renderDS[i].weekday,
            monthdate: this.datePipe.transform(this.renderDS[i].monthdate, 'yyyy-MM-dd')
          }
          if (dsetObject.weekday === undefined) {
            dsetObject.weekday = '-';
          } if (dsetObject.monthdate === null) {
            dsetObject.monthdate = '-';
          }
          this.dsetArray.push(dsetObject);
        }
        this.dataSet = new MatTableDataSource(this.dsetArray);
        this.dataSet.sort = this.dsetsort;
        this.dataSet.sortingDataAccessor = (item: any, property: string): string => {
          if (typeof item[property] === 'string') {
            return item[property].toLocaleLowerCase();
          }
          return item[property];
        };
      }
    });
  }

  applydatasourceFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getAllConnectors() {
    this.dsservice.getAllConnectors().subscribe((response: Response) => {
      this.connectorTypes = response;
      this.loaddatasourcelist();
    })
  }

  loaddatasourcelist() {
    this.dsservice.getListofAllDatasources().subscribe((response: Response) => {
      this.dsArray = [];
      this.dsnames = response;
      if (this.dsnames.length > 0) {
        for (let i = 0; i < this.dsnames.length; i++) {
          this.connectorvalue = this.connectorTypes.find(option => option.id == this.dsnames[i].connectorId);
          if ((this.connectorvalue.id === 2) || (this.connectorvalue.id === 3)) {
            if (this.dsnames[i].isSecure === false) {
              var securityMethod = 'Open';
            } else if (this.dsnames[i].isSecure === true) {
              var securityMethod = 'Secure';
            }
          }
          else {
            var securityMethod = '-';
          }
          const dsoptions = {
            dsid: this.dsnames[i].dataSourceId,
            dsname: this.dsnames[i].dataSourceName,
            endpoint: this.dsnames[i].endPointUrl,
            connector: this.connectorvalue.connectorName,
            security: securityMethod
          };
          this.dsArray.push(dsoptions);
        }
        this.dataSource = new MatTableDataSource(this.dsArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.Sort;
        this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
          if (typeof item[property] === 'string') {
            return item[property].toLocaleLowerCase();
          }
          return item[property];
        };
      }
    });
  }

  isAllSelected() {
    this.selectedDs = [];
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    for (let i = 0; i < this.dsnames.length; i++) {
      for (let k = 0; k < numSelected; k++) {
        if (this.dsnames[i].dataSourceId === this.selection.selected[k].dsid) {
          this.testitem = this.dsnames[i];
          this.selectedDs.push(this.testitem);
        }
      }
    }
    return numSelected === numRows;
  }

  masterToggle(ref) {
    if (this.isSomeSelected()) {
      this.selection.clear();
      ref.checked = false;
    }
    else {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  toggle(event, item: any) {
    for (let i = 0; i < this.dsnames.length; i++) {
      if (this.dsnames[i].dataSourceId == item.dsid) {
        this.testitem = this.dsnames[i]
      }
    }
    if (event.checked) {
      this.selectedDs.push(this.testitem)
      this.selection.selected.push(this.testitem)
    }
    else {
      let removeIndex = this.selectedDs.findIndex(itm => itm.dataSourceId === item.dsid);
      if (removeIndex == -1) {
      }
      else {
        this.selectedDs.splice(removeIndex, 1);
      }
      let removeIndex1 = this.selection.selected.findIndex(itm => itm.dataSourceId === item.dsid);
      if (removeIndex1 == -1) {
      } else {
        this.selection.selected.splice(removeIndex, 1);
      }
    }
  }

  next() {
    if (this.selection.selected.length !== 0) {
      this.createdset = true;
      this.selectds = false;
      this.title = 'Create';
      this.dsetForm.reset();
      this.rangeEndAt = new Date();
      this.fromDateTarget = new Date();
      this.endrangeStartFrom = undefined;
      this.dsetForm.get('fromdate').clearValidators();
      this.dsetForm.get('fromdate').updateValueAndValidity();
      this.dsetForm.get('todate').clearValidators();
      this.dsetForm.get('todate').updateValueAndValidity();
      setTimeout(function () {
        const elmnt = document.getElementById('scroll');
        elmnt.scrollIntoView();
      }, 300);
    }
    else {
      this.notification.showNotificationMsg(
        'Please select atleast one datasource',
        'warn',
        'Warning'
      );
    }
  }

  extractdataset(element) {
    this.dsservice.startextraction(element.id).subscribe((res) => {
      this.notification.showNotificationMsg(
        'Extraction Started',
        'success',
        'Success'
      );
    });
  }

  editdataset(element) {
    this.dsetForm.get('fromdate').clearValidators();
    this.dsetForm.get('fromdate').updateValueAndValidity();
    this.dsetForm.get('todate').clearValidators();
    this.dsetForm.get('todate').updateValueAndValidity();
    this.fromDateTarget = new Date();
    this.endrangeStartFrom = undefined;
    this.rangeEndAt = new Date();
    this.selectds = false;
    this.getdset = element;
    setTimeout(function () {
      const elmnt = document.getElementById('scroll');
      elmnt.scrollIntoView();
    }, 300);
    this.title = 'Edit';
    this.createdset = true;
    this.dsetForm.controls['dsetname'].setValue(element.dsetname);
    this.dsetForm.controls['frequency'].setValue(element.frequency);
    this.dsetForm.controls['time'].setValue(element.scheduletime);

    if ('fromdate' in element && element.fromdate) {
      this.dsetForm.controls['fromdate'].setValue(new Date(element.fromdate));
      this.endrangeStartFrom = new Date(element.fromdate);
    } else {
      this.dsetForm.controls['fromdate'].setValue(null);
    }
    if ('todate' in element && element.todate) {
      this.dsetForm.controls['todate'].setValue(new Date(element.todate));
      this.fromDateTarget = new Date(element.todate);
    } else {
      this.dsetForm.controls['todate'].setValue(null);
    }
    // this.selectFromDate();
    // this.selectToDate();
    if (element.frequency === 'Weekly') {
      this.enablelinks['weekly'] = true;
      this.enablelinks['monthly'] = false;
      this.setRequireValidator(this.dsetForm.get('weeklyForm'));
      this.removeValidator(this.dsetForm.get('monthlyForm'));
      this.dsetForm.patchValue({
        weeklyForm:
          { weekday: element.weekday }
      });
    }
    else if (element.frequency === 'Monthly') {
      this.enablelinks['weekly'] = false;
      this.enablelinks['monthly'] = true;
      this.removeValidator(this.dsetForm.get('weeklyForm'));
      this.setRequireValidator(this.dsetForm.get('monthlyForm'));
      this.dsetForm.patchValue({
        monthlyForm:
          { monthdate: element.monthdate }
      });
    }
    else {
      this.enablelinks['weekly'] = false;
      this.enablelinks['monthly'] = false;
      this.removeValidator(this.dsetForm.get('weeklyForm'));
      this.removeValidator(this.dsetForm.get('monthlyForm'));
    }
  }

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }


  setDirection({ value }: MatSelectChange): void {
    this.dsetsort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }
}
