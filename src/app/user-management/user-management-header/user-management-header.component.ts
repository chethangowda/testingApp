import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-management-header',
  templateUrl: './user-management-header.component.html',
  styleUrls: ['./user-management-header.component.scss']
})
export class UserManagementHeaderComponent implements OnInit {
  @Input() pageNumberData: any;
  @Output() createBtnEvent = new EventEmitter<any>();
  @Output() searchTextEvent = new EventEmitter<any>();
  @Output() onPagination = new EventEmitter<any>();

  totalRecords: any = 0;
  fromRecords: any = 0;
  toRecords: any = 0;
  totalPages: any;
  pageSizee: any;
  presentPageNo: any = 1;
  groupper: any = [];
  constructor() { }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }
  }

  ngOnChanges() {
    let pageData = this.pageNumberData;
    if (pageData) {
      this.totalPages = pageData.totalPages;
      this.presentPageNo = pageData.number + 1;
      this.pageSizee = pageData.size;
      this.totalRecords = pageData.totalElements;
      this.constructPAginationDetails(pageData.content);
    }
  }

  constructPAginationDetails(resdata) {
    this.fromRecords = ((this.presentPageNo - 1) * this.pageSizee) + 1;
    this.toRecords = (this.fromRecords + resdata.length) - 1;
  }

  gotosrcPreviousPage() {
    if (this.presentPageNo > 1) {
      this.presentPageNo = this.presentPageNo - 1;
      this.onPagination.emit(this.presentPageNo);
    }
  }

  gotosrcNextPage() {
    if (this.presentPageNo < this.totalPages) {
      this.presentPageNo = this.presentPageNo + 1;
      this.onPagination.emit(this.presentPageNo);
    }
  }

  dialogbox() {
    this.createBtnEvent.emit();
  }

  onSearchText(event) {
    this.searchTextEvent.emit(event.target.value);
  }

}
