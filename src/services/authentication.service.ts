import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class AuthenticationService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }


  loginCall(param): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-security-management/api/login", param, null, null, null, null, 'response')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getUserDetails(param) {
    return this.restService.post(this.baseUrl + "ix-security-management/admin/api/users/profile", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  setpassword(param) {
    return this.restService.put(this.baseUrl + "ix-security-management/admin/api/users/update/password", param, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  forgotpassword(param) {

    return this.restService.post(this.baseUrl + "ix-security-management/api/users/forgot/password", param, null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  forgotuserid(param) {
    return this.restService.post(this.baseUrl + "ix-security-management/api/users/send/otp", param, null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getuserid(param) {
    return this.restService.post(this.baseUrl + "ix-security-management/api/users/verify/otp", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }
}
