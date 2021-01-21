import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class PmalConfigService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }

  getDemographicsList() {
    return this.restService.get(this.baseUrl + "ix-configuration/rules/demographics", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  deleteRules(itemID) {
    return this.restService.get(this.baseUrl + "ix-configuration/rules/delete?ruleId=" + itemID, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  createRules(param) {
    return this.restService.post(this.baseUrl + "ix-configuration/rules/", param, null, null, null, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateRules(param) {
    return this.restService.put(this.baseUrl + "ix-configuration/rules/", param, null, null, null, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getdatasetlist(param) {
    return this.restService.post(this.baseUrl + "ix-configuration/rules/all", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

}
