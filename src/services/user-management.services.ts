import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { RestService } from 'src/core/rest.service';
import { environment } from '../environments/environment';

@Injectable()

export class UserManagementService {
  baseUrl = environment.baseURL;
  constructor(public userService: RestService) { }

  getUserList(param): Observable<any> {
    return this.userService.post(this.baseUrl + "ix-security-management/admin/api/users/pagination", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getExtractionListList(): Observable<any> {
    return this.userService.get(this.baseUrl + "/ix-security-management/admin/api/users/update/{id}", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  CreateUserList(param) {
    return this.userService.post(this.baseUrl + "ix-security-management/admin/api/users", param, null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateUserList(param, userID) {
    return this.userService.put(this.baseUrl + "ix-security-management/admin/api/users/update/" + userID, param, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getDropdownList(): Observable<any> {
    return this.userService.get(this.baseUrl + "ix-security-management/admin/api/groups", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }


}
