import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-service-header',
  templateUrl: './service-header.component.html',
  styleUrls: ['./service-header.component.scss']
})
export class ServiceHeaderComponent implements OnInit {
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
  constructor() { }

  ngOnInit() {
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

  onSearchText(event) {
    this.searchTextEvent.emit(event.target.value);
  }


}
