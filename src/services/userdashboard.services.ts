import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class UserDashboardService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService, private _http: HttpClient) { }

  getDataSetList(param): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-datasets/dataset/list", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getExtractionListList(): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-extraction/extraction/extraction-details/list/", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getResourceCount(): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-data-metrics/resource/count", null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getDataourceByResource(recource): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-data-metrics/resource/datasources/count/" + recource, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getExtractionListByDataourceandResource(recource, datasourceID): Observable<any> {
    return this.restService.get(this.baseUrl + "ix-data-metrics/resource/datasources/extraction/count/" + recource + '/' + datasourceID, null, true)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getPMALdata(param): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-data-matching/data-matching/extraction/stats", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }
  priorAuthorizationSupport() {
    return this._http.get('https://demo.interopx.com:8443/orders')
  }

}
