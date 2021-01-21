import { Injectable } from '@angular/core';
import { RestService } from 'src/core/rest.service';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientMatchingService {
  baseUrl = environment.baseURL;
  constructor(public restService: RestService) { }

  getListofconflictsGroupsByPage(currentPage, pageSize) {
    return this.restService.get(this.baseUrl + 'ix-data-matching/groups/conflictsGroupsByPage?currentPage=' + currentPage + '&pageSize=' + pageSize, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  getstats() {
    return this.restService.get(this.baseUrl + 'ix-data-matching/groups/getPmalStats', null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  linkPatients(json) {
    return this.restService.post(this.baseUrl + 'ix-data-matching/groups/resolveConflicts', json, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }

  excludePatients(json) {
    return this.restService.post(this.baseUrl + 'ix-data-matching/groups/excludeConflicts', json, null)
      .map(res => res)
      .catch(error => Observable.throw(error))
  }
}
