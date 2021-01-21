import { Injectable } from '@angular/core';
import { RestService } from 'src/core/rest.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class GroupManagementService {
  baseUrl = environment.baseURL;
  constructor(public userService: RestService) { }

  getPermissionsList(): Observable<any> {
    return this.userService.get(this.baseUrl + "ix-security-management/admin/api/permissions", null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  CreateGroup(param) {
    return this.userService.post(this.baseUrl + "ix-security-management/admin/api/groups", param, null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getGroupsList(param): Observable<any> {
    return this.userService.post(this.baseUrl + "ix-security-management/admin/api/groups/all/", param)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  updateGroup(param, groupID) {
    return this.userService.put(this.baseUrl + "ix-security-management/admin/api/groups/update/" + groupID, param, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  deactivateGroup(groupID, status) {
    return this.userService.put(this.baseUrl + "ix-security-management/admin/api/groups/" + groupID + "/" + status + "/changeGroupStatus", null, null, null, null, 'text')
      .map(res => res)
      .catch(error => Observable.throw(error))
  }
}
