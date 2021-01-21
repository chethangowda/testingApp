import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyaccountService {
  baseUrl = environment.baseURL;
  private passwordTypeSubject = new Subject<any>();
  password = this.passwordTypeSubject.asObservable();

  constructor(public restService: RestService) { }

  sendpassword(message: string) {
    this.passwordTypeSubject.next(message);
  }

  getprofile(param): Observable<any> {
    return this.restService.post(this.baseUrl + "ix-security-management/admin/api/users/profile", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateprofile(param, userID) {
    return this.restService.put(this.baseUrl + "ix-security-management/admin/api/users/update/" + userID, param, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }
}
