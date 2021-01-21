import { Component, OnInit, ViewChildren, Input, ViewChild, ɵConsole, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/services/user-management.services';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material';
import * as country from './../shared/entity/countrydata';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  dataSource = new MatTableDataSource;
  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phone', 'lastLoggedIn', 'status', 'action'];

  searchForm: FormGroup;
  @Input() eventArray: any = [];
  eventForm: FormGroup;
  datasetList: any;
  http: any; groupper: any = [];
  closebth: boolean = true;
  isCollapsed: boolean;
  connectorTypes: any;
  connectortype: any;

  isEdit: boolean = false;
  editingData: any;
  countrtList: any = [];

  statusList: any = [
    { name: 'Active', id: 'active' },
    { name: 'InActive', id: 'inactive' },
    { name: 'DeActivated', id: 'deactivated' }
  ]

  userdataToPage: any;
  pageno: any;
  pagesize: any;

  constructor(private userManagementService: UserManagementService,
    private fb: FormBuilder,
    private ngZone: NgZone) {

    this.eventForm = this.fb.group({

      userID: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      group: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      organization: ['', Validators.required],
      Department: [''],
      Address: [''],
      City: [''],
      Country: ['', Validators.required],
      Code: ['', Validators.required],
      Number: ['', [Validators.required, Validators.pattern('^(([0-9]{10}))*$')]],
      Status: [''],

    })

  }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }
    this.getGroupList();
    this.countrtList = country.countrydata;
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.getUserList(param);

    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      gender: [''],
      action: [''],
    });
  }

  onPaginationCall(event) {
    let param = {
      page_no: event,
      page_size: this.pagesize
    }
    this.getUserList(param);
  }

  getUserList(param) {
    this.userManagementService.getUserList(param).subscribe(data => {
      this.userdataToPage = data;
      if (data && 'totalElements' in data && data.totalElements > 0) {
        this.pagesize = 'size' in data ? data.size : undefined;
        this.datasetList = data.content;
        this.dataSource = new MatTableDataSource<any>(this.datasetList);
        this.dataSource.data = this.datasetList;
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

  onCreateBtn(event) {
    this.eventForm.reset();
    this.isEdit = false;
    this.isCollapsed = true;
    this.closebth = true;

    this.ngZone.run(() => {
      this.eventForm.get('Status').setValue('inactive');
      this.eventForm.controls['Status'].disable();
      this.eventForm.controls['Status'].updateValueAndValidity();
    })
  }

  onSearchFilter(event) {
    this.dataSource.filter = event.trim();
  }

  createUser(param) {
    this.userManagementService.CreateUserList(param).subscribe(data => {
      this.eventForm.reset();
      this.isCollapsed = false;
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.getUserList(param);
    })
  }

  updataUSer(param) {
    this.userManagementService.updateUserList(param, this.editingData.id).subscribe(data => {
      this.eventForm.reset();
      this.isCollapsed = false;
      let param = {
        page_no: this.pageno,
        page_size: this.pagesize
      }
      this.getUserList(param);
    })
  }

  getCountryCode(value) {
    for (let item of this.countrtList) {
      if (item.value == value) {
        return item
      }
    }
    return null
  }

  onSubmit(type) {
    if (this.eventForm.valid) {
      let country = this.getCountryCode(this.eventForm.value.Country);
      let mobileNumber = country.dialcode + '-' + this.eventForm.value.Number;

      let param = {
        address: this.eventForm.value.Address,
        city: this.eventForm.value.City,
        country: this.eventForm.value.Country,
        department: this.eventForm.value.Department,
        email: this.eventForm.value.Email,
        firstName: this.eventForm.value.first_name,
        groupIds: this.eventForm.value.group,
        lastName: this.eventForm.value.last_name,
        organization: this.eventForm.value.organization,
        phone: mobileNumber,
        status: this.eventForm.value.Status,
        userId: this.eventForm.value.userID,
      }

      param['status'] = this.eventForm.getRawValue().Status;

      if (type == 'update') {
        param['id'] = this.editingData.id;
        this.updataUSer(param);
      }

      if (type == 'create') {
        this.createUser(param);
      };
    }

  }

  editUser(item) {
    this.editingData = item;
    this.isEdit = true;
    this.isCollapsed = true;
    let groupList = [];
    let phoneNumber;

    this.ngZone.run(() => {
      this.eventForm.controls['Status'].enable();
      this.eventForm.controls['Status'].updateValueAndValidity();
    })

    if ('userGroups' in item && item.userGroups instanceof Array) {
      for (let g_item of item.userGroups) {
        if ('group' in g_item) {
          groupList.push(g_item.group.groupId);
        }
      }
    }

    if (item.phone.includes('-')) {
      phoneNumber = item.phone.split('-')[1];
    }

    this.eventForm.patchValue({
      Address: item.address,
      City: item.city,
      Country: item.country,
      Department: item.department,
      Email: item.email,
      first_name: item.firstName,
      group: groupList.length > 0 ? groupList : null,
      // id: 0,
      last_name: item.lastName,
      organization: item.organization,
      // otp: item,
      // password: item,
      Number: phoneNumber,
      // profilePic: item,
      Status: item.status ? item.status : 'active',
      // userAuthenticated: true,
      userID: item.userId,
    })

    this.onSelectCountryDropdown({ value: item.country });

  }

  getGroupList() {
    this.userManagementService.getDropdownList().subscribe(datasetData => {
      this.connectorTypes = datasetData;
    })
  }

  onSelectDropdown(event) {

  }

  onSelectCountryDropdown(event) {
    let country = this.getCountryCode(event.value);
    this.eventForm.patchValue({
      Code: country ? country.dialcode : ''
    })
    this.eventForm.controls['Code'].disable();
  }

  closeform() {
    this.isCollapsed = false;
    this.isEdit = false;
  }

  configUrl(configUrl: any): void {
    throw new Error("Method not implemented.");
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

