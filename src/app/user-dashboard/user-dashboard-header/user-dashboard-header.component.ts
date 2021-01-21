import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserDataService } from '../userdataservice/user-data.service';

@Component({
  selector: 'app-user-dashboard-header',
  templateUrl: './user-dashboard-header.component.html',
  styleUrls: ['./user-dashboard-header.component.scss']
})
export class UserDashboardHeaderComponent implements OnInit {
  @Output() selectedTab = new EventEmitter<string>()
  isSelectedTab: any = 'dataset';

  totalRecords: any = 0;
  fromRecords: any = 0;
  toRecords: any = 0;
  totalPages: any;
  pageSizee: any;
  presentPageNo: any;
  groupper: any = [];

  constructor(private userDataService: UserDataService) {

    this.userDataService.userDashboardCountData.subscribe(data => {
      this.totalPages = data.totalPages;
      this.presentPageNo = data.pageNo;
      this.pageSizee = data.pageSize;
      this.totalRecords = data.totalRecords;
      this.constructPAginationDetails(data);

    })

  }

  ngOnInit() {
    let userDetails = {}

    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];


        if (this.groupper.includes('Dashboard_PMAL')) {
          this.isSelectedTab = 'pmal';
          this.selectedTab.emit(this.isSelectedTab);
        }
        if (this.groupper.includes('Dashboard_ResourceMetrics')) {
          this.isSelectedTab = 'metrics';
          this.selectedTab.emit(this.isSelectedTab);
        }
        if (this.groupper.includes('Dashboard_DataSet')) {
          this.isSelectedTab = 'dataset';
          this.selectedTab.emit(this.isSelectedTab);
        }
        if (this.groupper.includes('Dashboard_Coverage')) {
          this.isSelectedTab = 'coverage-requirements';
          this.selectedTab.emit(this.isSelectedTab);
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

  gotosrcNextPage() {
    if (this.presentPageNo < this.totalPages) {
      this.presentPageNo = this.presentPageNo + 1;
      this.userDataService.sendUserDashboardPagination(this.presentPageNo);
    }
  }

  gotosrcPreviousPage() {
    if (this.presentPageNo > 1) {
      this.presentPageNo = this.presentPageNo - 1;
      this.userDataService.sendUserDashboardPagination(this.presentPageNo);
    }
  }

  onSelectLink(event) {
    this.totalRecords = 0;
    this.fromRecords = 0;
    this.toRecords = 0;
    this.totalPages;
    this.pageSizee;
    this.presentPageNo = 1;

    this.isSelectedTab = event;
    this.selectedTab.emit(event);
  }

  onFilterText(event) {
    this.userDataService.sendUSerDashboardFilterData(event.target.value);
  }

}
