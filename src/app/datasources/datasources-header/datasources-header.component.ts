import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DatasourcesService } from '../datasources.service';

@Component({
  selector: 'app-datasources-header',
  templateUrl: './datasources-header.component.html',
  styleUrls: ['./datasources-header.component.scss']
})
export class DatasourcesHeaderComponent implements OnInit {
  @Output() selectPatientTab = new EventEmitter<string>();
  @ViewChild('searchFilterText', { static: true }) searchFilterText: ElementRef;
  isSelectedTab: any = "datasourceview";

  totalRecords: any = 0;
  fromRecords: any = 0;
  toRecords: any = 0;
  totalPages: any;
  pageSizee: any;
  presentPageNo: any;
  groupper: any = [];

  constructor(private dataservice: DatasourcesService) {
    this.dataservice.datasrcCountData.subscribe(auditdata => {
      this.totalPages = auditdata.totalPages;
      this.presentPageNo = auditdata.pageNo;
      this.pageSizee = auditdata.pageSize;
      this.totalRecords = auditdata.totalRecords;
      this.constructPAginationDetails(auditdata);
    });

  }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
        if (this.groupper.includes('View_Agent')) {
          this.isSelectedTab = 'agentview';
          this.selectPatientTab.emit(this.isSelectedTab);
        }
        if ((this.groupper.includes('View_ DataSet'))) {
          this.isSelectedTab = 'datasetview';
          this.selectPatientTab.emit(this.isSelectedTab);
        }
        if ((this.groupper.includes('View_DataSource'))) {
          this.isSelectedTab = 'datasourceview';
          this.selectPatientTab.emit(this.isSelectedTab);
        }
      }
    }
  }

  constructPAginationDetails(resdata) {
    this.fromRecords = ((this.presentPageNo - 1) * this.pageSizee) + 1;
    this.toRecords = (this.fromRecords + resdata.results.length) - 1;
    if (resdata.totalRecords == 0) {
      this.fromRecords = 0;
    }
  }

  onSelectTab(selectedTab) {
    this.totalRecords = 0;
    this.fromRecords = 0;
    this.toRecords = 0;
    this.totalPages;
    this.pageSizee;
    this.presentPageNo = 1;

    this.selectPatientTab.emit(selectedTab);
    this.isSelectedTab = selectedTab;
    this.searchFilterText.nativeElement.value = '';
  }

  createFormFunction() {
    this.dataservice.createFormFunctionCall(this.isSelectedTab);
  }

  onFilterdatasrcText(event) {
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

}
