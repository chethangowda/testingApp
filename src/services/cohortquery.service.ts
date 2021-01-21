import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class CohortqueryService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }


  getConditions(): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-cohort-query/cohort/", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  saveQuery(param, urlParam): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-cohort-query/cohort/patients?" + urlParam, param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  executeQuery(param, urlParam) {
    if (param) {
      return this.restService.post(this.baseUrl + "ix-cohort-query/cohort/patients?" + urlParam, param)
        .map(res => res)
        .catch(error => Observable.throw(error))
    } else {
      return this.restService.get(this.baseUrl + "ix-cohort-query/cohort/execute?" + urlParam, null)
        .map(res => res)
        .catch(error => Observable.throw(error))
    }

  }

  queryExecutePagination(param, URL) {
    if (param) {
      return this.restService.post(URL, param)
        .map(res => res)
        .catch(error => Observable.throw(error))
    } else {
      return this.restService.get(URL, param)
        .map(res => res)
        .catch(error => Observable.throw(error))
    }

  }

  getQueryList() {
    return this.restService.get(this.baseUrl + "ix-cohort-query/cohort/query", null, true, null, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  deleteQuery(urlParam) {
    return this.restService.get(this.baseUrl + "ix-cohort-query/cohort/deleteQuery", urlParam, null, null, null, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

}
