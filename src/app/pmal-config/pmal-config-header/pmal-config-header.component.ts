import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DatasourcesService } from 'src/app/datasources/datasources.service';
import { PmalDataService } from '../pmalDataService/pmal-data.service';

@Component({
  selector: 'app-pmal-config-header',
  templateUrl: './pmal-config-header.component.html',
  styleUrls: ['./pmal-config-header.component.scss']
})
export class PmalConfigHeaderComponent implements OnInit {
  @Output() selectedTab = new EventEmitter<string>();
  @ViewChild('searchFilterText', { static: true }) searchFilterText: ElementRef;
  isSelectedTab: any = 'rulesconfig';

  totalRecords: any = 0;
  fromRecords: any = 0;
  toRecords: any = 0;
  totalPages: any;
  pageSizee: any;
  presentPageNo: any;
  groupper: any = [];

  constructor(private dataservice: PmalDataService) {

    this.dataservice.datasrcCountData.subscribe(auditdata => {
      this.totalPages = auditdata.totalPages;;
      this.presentPageNo = auditdata.number + 1;
      this.pageSizee = auditdata.size;
      this.totalRecords = auditdata.totalElements;
      this.constructPAginationDetails(auditdata);
    });

  }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
    }
  }

  constructPAginationDetails(resdata) {
    this.fromRecords = ((this.presentPageNo - 1) * this.pageSizee) + 1;
    this.toRecords = (this.fromRecords + resdata.content.length) - 1;
    if (resdata.totalRecords == 0) {
      this.fromRecords = 0;
    }
  }

  onFilterText(event) {
    this.dataservice.senddatasrcFilterData(event.target.value);
  }

  gotosrcNextPage() {
    if (this.presentPageNo < this.totalPages) {
      this.presentPageNo = this.presentPageNo + 1;
      this.dataservice.datasrcPaginationCall(this.presentPageNo);
    }
  }

  gotosrcPreviousPage() {
    if (this.presentPageNo > 1) {
      this.presentPageNo = this.presentPageNo - 1;
      this.dataservice.datasrcPaginationCall(this.presentPageNo);
    }
  }

  onSelectTab(selectedTab) {
    this.totalRecords = 0;
    this.fromRecords = 0;
    this.toRecords = 0;
    this.totalPages;
    this.pageSizee;
    this.presentPageNo = 1;

    this.selectedTab.emit(selectedTab);
    this.isSelectedTab = selectedTab;
    this.searchFilterText.nativeElement.value = '';
  }

  createFormFunction() {
    this.dataservice.createFormFunctionCall(this.isSelectedTab);
  }
}
