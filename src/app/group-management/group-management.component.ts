import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSort, Sort, MatTableDataSource, MatSelectChange, MatDialog } from '@angular/material';
import { GroupManagementService } from 'src/services/group-management.service';
import { DeactivateDialogComponent } from './deactivate-dialog/deactivate-dialog.component';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'Name', 'Permission', 'Details', 'Createdby', 'Status', 'action'];
  dataSource = new MatTableDataSource;
  searchForm: FormGroup;
  @Input() eventArray: any = [];
  eventForm = this.fb.group({
    GroupName: ['', Validators.required],
    Groupdesc: ['', Validators.required],
    Permission: ['', Validators.required],
    Status: ['', Validators.required],

  })
  title: any;
  createds: boolean = false;
  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  isCollapsed: boolean;
  Permissions: any;
  Statuslist = [
    { value: 'Inactive', viewValue: 'Inactive' },
    { value: 'Active', viewValue: 'Active' }
  ];
  permlist: any[];
  groupList: any[];
  list: any[];
  permname: any;
  checkOptions: any;
  selectOptions: any;
  grpid: any;

  userdataToPage: any;
  pageno: any;
  pagesize: any;
  groupper: any = [];
  constructor(private fb: FormBuilder, private groupservice: GroupManagementService, private dialog: MatDialog) {

  }


  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }
    let param = {
      page_no: this.pageno,
      page_size: this.pagesize
    }
    this.loadgrplist(param);
    this.getpermissions();
  }

  onCreateBtn(event) {
    this.isCollapsed = true;
    this.eventForm.reset();
    this.title = 'Create'
  }

  onSearchFilter(event) {
    this.dataSource.filter = event.trim();
  }

  closeform() {
    this.isCollapsed = false;
  }

  getpermissions() {
    this.groupservice.getPermissionsList().subscribe((data) => {
      this.Permissions = data;
    })
  }

  onPaginationCall(event) {
    let param = {
      page_no: event,
      page_size: this.pagesize
    }
    this.loadgrplist(param);
  }

  loadgrplist(param) {
    this.groupList = [];
    this.permlist = [];
    this.list = [];
    this.groupservice.getGroupsList(param).subscribe(data => {
      if (data) {
        this.userdataToPage = data;
      }
      if (data && 'content' in data) {
        const groupdata = data.content;
        for (let i = 0; i < groupdata.length; i++) {
          this.permlist = [];
          this.list = groupdata[i].groupPermissions;
          for (let k = 0; k < this.list.length; k++) {
            this.permlist.push(this.list[k].permission.authority);
          }
          if (groupdata[i].groupEnabled === true) {
            var status = 'Active';
            var icon = 'Deactivate';
          }
          else if (groupdata[i].groupEnabled === false) {
            var status = 'Inactive';
            var icon = 'Activate';
          }
          const options = {
            id: groupdata[i].groupId,
            Name: groupdata[i].groupName,
            Permission: this.permlist,
            Details: groupdata[i].groupDesc,
            Createdby: groupdata[i].createdUserName,
            Status: status,
            icon: icon
          }
          this.groupList.push(options);
        }
      }

      this.dataSource = new MatTableDataSource(this.groupList);
      this.dataSource.sort = this.Sort;
      this.dataSource.sortingDataAccessor = (item: any, property: string): string => {
        if (typeof item[property] === 'string') {
          return item[property].toLocaleLowerCase();
        }
        return item[property];
      };
    })
  }

  editgrp(element) {
    this.title = 'Edit';
    this.grpid = element.id;
    this.checkOptions = [];
    for (let k = 0; k < element.Permission.length; k++) {
      this.permname = element.Permission[k];
      this.selectOptions = this.Permissions.find(option => option.authority == this.permname);
      this.checkOptions.push(this.selectOptions);
    }
    this.isCollapsed = true;
    this.eventForm.controls['GroupName'].setValue(element.Name);
    this.eventForm.controls['Groupdesc'].setValue(element.Details);
    this.eventForm.controls['Status'].setValue(element.Status);
    this.eventForm.controls['Permission'].setValue(this.checkOptions);

  }

  onSubmit() {
    if (this.eventForm.get('Status').value === 'Active') {
      var grpstatus = true;
    }
    else if (this.eventForm.get('Status').value === 'Inactive') {
      var grpstatus = false;
    }
    const grp = this.eventForm.get('Permission').value;
    this.permlist = [];
    for (let l = 0; l < grp.length; l++) {
      const groupid = {
        permissionId: grp[l].permissionId,
        permissionName: grp[l].authority
      }
      this.permlist.push(groupid);
    }
    const json = {
      createdUserName: localStorage.getItem('user'),
      groupDesc: this.eventForm.get('Groupdesc').value,
      groupEnabled: grpstatus,
      groupName: this.eventForm.get('GroupName').value,
      permissions: this.permlist,
      groupId: 0
    }
    if (this.title === 'Create') {
      this.groupservice.CreateGroup(json).subscribe(data => {
        this.isCollapsed = false;
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.loadgrplist(param);
      })
    }
    else if (this.title === 'Edit') {
      this.groupservice.updateGroup(json, this.grpid).subscribe(data => {
        this.isCollapsed = false;
        let param = {
          page_no: this.pageno,
          page_size: this.pagesize
        }
        this.loadgrplist(param);
      })
    }
  }

  deactivategroup(ev) {
    const x = ev;
    const dialogRef = this.dialog.open(DeactivateDialogComponent, {
      // width: '400px',
      data: { x }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result !== '' && result !== undefined) {
        if (result.x.Status === "Inactive") {
          var status = true;
        }
        else if (result.x.Status === "Active") {
          var status = false;
        }
        this.groupservice.deactivateGroup(result.x.id, status).subscribe((res: any) => {
          let param = {
            page_no: this.pageno,
            page_size: this.pagesize
          }
          this.loadgrplist(param);
        })
      }
    })
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

  search() {
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

}
