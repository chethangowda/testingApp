import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/core/rest.service';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class SecurityConfigService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }

  getsecurityconfigList() {
    return this.restService.get(this.baseUrl + "ix-configuration/configurationRules/systemValues/security", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getsystemconfigList(param) {
    return this.restService.get(this.baseUrl + "ix-configuration/configurationRules/systemValues/", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateconfigList(param) {
    return this.restService.put(this.baseUrl + "ix-configuration/configurationRules/systemValues/", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

}
