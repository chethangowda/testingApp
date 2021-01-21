import { Component, OnInit, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { AdmindataService } from '../admindataServices/admindata.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  @Output() selectPatientTab = new EventEmitter<string>();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  isSelectedTab: any = "extraction";
  totalPages: any;
  presentPageNo: any;
  pageSizee: any;
  totalRecords: any;
  fromRecords: number;
  toRecords: number;
  textField: any;

  constructor(private auditDataService: AdmindataService,
    private ngZone: NgZone,
    private activeRout: ActivatedRoute) {
    this.auditDataService.auditCountData.subscribe(auditdata => {
      this.totalPages = auditdata.totalPages;
      this.presentPageNo = auditdata.pageNo;
      this.pageSizee = auditdata.pageSize;
      this.totalRecords = auditdata.totalRecords;
      this.constructPAginationDetails(auditdata);
    });
  }

  ngOnInit() {
    let tabName = this.activeRout.snapshot.paramMap.get('tab');
    if (tabName) {
      this.onSelectTab(tabName);
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
    this.ngZone.run(() => {
      this.isSelectedTab = selectedTab;
    })
    this.searchInput.nativeElement.value = '';
  }

  onFilterdatasrcText(event) {
    this.auditDataService.sendauditFilterData(event.target.value);
  }

  gotosrcNextPage() {
    if (this.presentPageNo < this.totalPages) {
      this.presentPageNo = this.presentPageNo + 1;
      this.auditDataService.auditPaginationCall(this.presentPageNo);
    }
  }

  gotosrcPreviousPage() {
    if (this.presentPageNo > 1) {
      this.presentPageNo = this.presentPageNo - 1;
      this.auditDataService.auditPaginationCall(this.presentPageNo);
    }
  }

}
