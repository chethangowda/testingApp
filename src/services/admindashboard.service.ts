import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class AdminDashboardService {
  baseUrl = environment.baseURL;
  url: any;
  constructor(public restService: RestService) { }

  getAuditLogList(): Observable<any> {
    return this.restService.get(this.baseUrl + "/ix-audit/audit/list", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getExtractionListList(): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-extraction/extraction/extraction-details/list/", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  searchAuditData(param): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-audit/audit/search/dateRange/category", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  paginationauditData(Param) {
    return this.restService.post(this.baseUrl + "ix-audit/audit/search/", Param, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  paginationextractionData(Param, isLoader) {
    return this.restService.post(this.baseUrl + "ix-extraction/extraction/extraction-details/list/", Param, isLoader)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

}
