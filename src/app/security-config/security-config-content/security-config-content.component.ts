import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource, Sort, MatSort, MatSelectChange, MatDialog } from '@angular/material';
import { SecurityConfigService } from 'src/services/security-config.service';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';

@Component({
  selector: 'app-security-config-content',
  templateUrl: './security-config-content.component.html',
  styleUrls: ['./security-config-content.component.scss']
})
export class SecurityConfigContentComponent implements OnInit {
  displayedColumns: string[] = ['systemValueId', 'category', 'key', 'value', 'active', 'actions'];
  dataSource = new MatTableDataSource();
  eventForm: FormGroup;
  searchForm: FormGroup;
  contactList: FormArray;
  validjson: boolean = false;
  jsonarray: any = [];
  Sort: MatSort;
  isedit: boolean = true;
  editvalue: boolean = false;
  editRowId: number = -1;
  services: any = [];
  configdataToPage: any;
  pageno: any;
  pagesize: any;
  configlist: any;
  event: any;
  serviceTypes: any;
  keyvalueForm: FormGroup;
  notSame: boolean
  @ViewChild(MatSort, { static: false }) set page(Sort: MatSort) {
    this.Sort = Sort;
    this.dataSource.sort = this.Sort;
  };
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };

  constructor(private fb: FormBuilder, private configservice: SecurityConfigService, private dialog: MatDialog) {
    this.searchForm = this.fb.group({
      serviceselect: [''],
    });

    this.eventForm = this.fb.group({
      service: [''],
      key: [''],
      value: [''],
      //newfields: this.fb.array([this.initItemRows()]),
      json: ['']
    })
    this.contactList = this.eventForm.get('newfields') as FormArray;
    this.keyvalueForm = fb.group({
      number: ['', [Validators.required, Validators.pattern('^(([0-9]))*$')]]
    });
  }

  ngOnInit() {
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getsecurityconfigList(param)
  }

  keytab(event, element) {
    for (let item of event) {
      if ((item.key == 'user_password_expiry_days') && (element.key == 'password_expiration_notice_days')) {
        if (item.value > this.keyvalueForm.value.number) {
          this.notSame = false;
        }
        if (item.value < this.keyvalueForm.value.number) {
          this.notSame = true;
        }
      }
      else if ((item.key == 'password_expiration_notice_days') && (element.key == 'user_password_expiry_days')) {
        if (item.value < this.keyvalueForm.value.number) {
          this.notSame = false;
        }
        if (item.value > this.keyvalueForm.value.number) {
          this.notSame = true;
        }
      }

    }
  }

  onSearchFilter(event) {
    this.dataSource.filter = event.trim();
  }

  onPaginationCall(event) {
    let param = {
      page_no: event,
      page_size: this.pagesize
    }
    this.getsecurityconfigList(param);
  }

  getsecurityconfigList(param) {
    this.configservice.getsecurityconfigList().subscribe(data => {
      this.configdataToPage = data;
      if (data) {
        //this.pagesize = 'size' in data ? data.size : undefined;
        this.configlist = data;
        this.dataSource = new MatTableDataSource<any>(this.configlist);
        this.dataSource.data = this.configlist;
        this.dataSource.sort = this.Sort;
        this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
          if (typeof item[property] === 'string') {
            return item[property].toLocaleLowerCase();
          }
          return item[property];
        };
      }
    })
  }

  editconfig(row, element) {
    this.notSame = false;
    this.keyvalueForm.controls['number'].setValue(element.value);
    this.isedit = false;
    this.editvalue = true;
    this.editRowId = row;
  }

  updateconfig(element) {
    if (this.notSame == false) {
      this.event = element
      let param = {
        active: element.active
      }
      this.Saveconfig(param);
    }
  }

  Saveconfig(param) {
    param['systemValueId'] = this.event.systemValueId;
    param['category'] = this.event.category;
    param['key'] = this.event.key;
    param['value'] = this.keyvalueForm.get('number').value;
    param['visible'] = this.event.visible;
    this.configservice.updateconfigList(param).subscribe(data => {
      this.eventForm.reset();
      this.editRowId = -1;
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.getsecurityconfigList(param);
    })
    this.notSame = false;
  }

  search() {
    let param = {}
    param['category'] = this.searchForm.value.serviceselect;
    param['page_no'] = this.pageno;
    param['page_size'] = this.pagesize;
    this.getsecurityconfigList(param);
  }

  reset() {
    this.searchForm.reset();
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getsecurityconfigList(param)
  }

  deactivategroup(ev) {
    const x = ev;
    this.event = ev;
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      data: { x }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result !== undefined) {
        if (result.x.active == false) {
          let param = {
            active: true
          }
          this.Saveconfig(param)
        }
        else if (result.x.active == true) {
          let param = {
            active: false
          }
          this.Saveconfig(param)
        }
      }
    })
  }

  cancelconfig(element) {
    this.notSame = false;
    this.editRowId = -1;
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getsecurityconfigList(param);
  }

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }


  Addkeypairs() {
    this.validjson = true;
  }

  keyup(event) {
    this.isJson(event);
  }

  isJson(event) {
    this.jsonarray = [];
    try {
      JSON.parse(event);
    } catch (e) {
      this.validjson = false;
      return false;
    }
    this.validjson = true;
    let object1 = JSON.parse(event);
    for (let key in object1) {
      var item = {};
      item[key] = object1[key];
      this.jsonarray.push(item);
    }

    return true;
  }


  setDirection({ value }: MatSelectChange): void {
    this.Sort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }
  onSubmit() {

  }


}



export interface PeriodicElement {
  category: string;
  systemValueId: number;
  value: number;
  key: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { systemValueId: 1, category: 'Securty-Service', value: 1.0079, key: 'H', status: 'Active' },
  { systemValueId: 2, category: 'Securty-Service', value: 4.0026, key: 'He', status: 'Inactive' },
  { systemValueId: 3, category: 'Tx-Service', value: 6.941, key: 'Li', status: 'Inactive' },
  { systemValueId: 4, category: 'Tx-Service', value: 9.0122, key: 'Be', status: 'Active' },
  { systemValueId: 5, category: 'Securty-Service', value: 10.811, key: 'B', status: 'Active' },
  { systemValueId: 6, category: 'Tx-Service', value: 12.0107, key: 'C', status: 'Active' },
  { systemValueId: 7, category: 'Tx-Service', value: 14.0067, key: 'N', status: 'Inactive' },
  { systemValueId: 8, category: 'Securty-Service', value: 15.9994, key: 'O', status: 'Active' },
  { systemValueId: 9, category: 'Tx-Service', value: 18.9984, key: 'F', status: 'Active' },
  { systemValueId: 10, category: 'Securty-Service', value: 20.1797, key: 'Ne', status: 'Inactive' },
];

