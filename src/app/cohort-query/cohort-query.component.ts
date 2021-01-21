import { Component, OnInit } from '@angular/core';
import { CohortDataService } from './shared/cohortDataservice';
import { PatientDataService } from '../analytics/dataServices/data.service';
import { CohortqueryService } from 'src/services/cohortquery.service';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-cohort-query',
  templateUrl: './cohort-query.component.html',
  styleUrls: ['./cohort-query.component.scss']
})
export class CohortQueryComponent implements OnInit {

  patientData: any = null;
  fromRecordCount: any = 0;
  toRecordCount: any = 0;
  listcountinPage: any;
  totalRecords: any = 0;
  recentSearchText: any;
  present: any;
  next: any;
  previousurl: any;
  resentQuerys: any = [];

  cohortpaginationSubscribe: any;

  constructor(public cohortDataService: CohortDataService,
    public patientDataService: PatientDataService,
    private cohortqueryService: CohortqueryService,
    private dataService: DataService) { }

  ngOnDestroy() {
    this.cohortpaginationSubscribe.unsubscribe();
  }

  ngOnInit() {
    this.getrecentQueryList();
    this.cohortpaginationSubscribe = this.cohortDataService.cohortPaginationData.subscribe(data => {
      this.getrecentQueryList();
      if (data) {

        let paginationdata = this.dataService.paginationDataprepare(data)

        this.next = paginationdata.next;
        this.previousurl = paginationdata.previous;
        this.present = paginationdata.present;
        this.totalRecords = paginationdata.totalCount;
        this.fromRecordCount = paginationdata.fromCount;
        this.toRecordCount = paginationdata.toCount;

      } else {
        this.previousurl = null;
        this.next = null;
        this.present = null;
        this.fromRecordCount = 0;
        this.toRecordCount = 0;
        this.totalRecords = 0;
      }
    })
  }

  isObjectPresent(objectdata, key) {
    if (key in objectdata && objectdata[key]) {
      return true;
    } else {
      return false;
    }
  }

  gotoPreviousPage() {
    this.patientDataService.patientPaginationCall(this.previousurl);
  }

  gotoNextPage() {
    this.patientDataService.patientPaginationCall(this.next);
  }

  onFilterText(event) {
    this.patientDataService.sendPatinetFilterData(event.target.value);
  }

  onSearchRecent(event) {
    this.recentSearchText = event.target.value;
  }

  ongetUpdate(event) {
    this.getrecentQueryList();
  }

  getrecentQueryList() {
    this.cohortqueryService.getQueryList().subscribe(data => {
      if (data) {
        this.resentQuerys = data;
      }
    })
  }

  onExecute(query) {
    let param = {
      'search-offset': 0,
      '_count': 10,
      'queryId': query.cohortQueryId
    }
    this.cohortDataService.sendCohortExecuteQueryData({ param: null, urlParam: this.getQueryParameter(param) });
  }

  onDelete(query) {
    let param = {
      queryId: query.cohortQueryId
    }
    this.cohortqueryService.deleteQuery(param).subscribe(data => {
      this.getrecentQueryList();
    })
  }

  getQueryParameter(param) {
    let queryParams: string = '';
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        queryParams += `${key}=${param[key]}&`;
      }
    }

    queryParams = queryParams.slice(0, -1);
    return queryParams
  }

  getParamValue(URL, variable) {
    if (URL.indexOf("?") != -1) {
      let splitURL = URL.split("?");
      let splitParams = splitURL[1].split("&");
      for (let i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == variable) {
          return singleURLParam[1];
        }
      }
    } else {
      return null;
    }
  }

}
