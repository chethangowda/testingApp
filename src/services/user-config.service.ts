import { Injectable } from '@angular/core';
import { RestService } from 'src/core/rest.service';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }

  getconfig() {
    return this.restService.get(this.baseUrl + "ix-security-management/api/config-settings", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  createconfig(param, id, uid) {
    return this.restService.put(this.baseUrl + "ix-security-management/admin/api/config-settings/" + id + "/" + uid, param, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }
}
