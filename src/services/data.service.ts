import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DataService {

  private userTypeSubject = new Subject<any>();
  userType = this.userTypeSubject.asObservable();

  constructor() { }

  sendUserType(message: any) {
    this.userTypeSubject.next(message);
  }

  paginationDataprepare(data) {
    let next;
    let previous;
    let present;
    let fromCount;
    let toCount;
    let totalCount;

    totalCount = data.total;
    for (let item of data.link) {

      if (item.relation == 'next') {
        next = item.url;
      }

      if (item.relation == 'self') {
        if (totalCount == 0) {
          previous = null;
          next = null;
          present = null;
          fromCount = 0;
          toCount = 0;
          return;
        }
        let searchoffSet: number = this.getParamValue(item.url, 'search-offset');
        fromCount = +searchoffSet + 1;
        toCount = +fromCount + data.entry.length - 1;
        present = item.url;
      }

      if (item.relation == 'previous') {
        previous = item.url;
      }
    }

    let param = {
      next: next,
      previous: previous,
      present: present,
      fromCount: fromCount,
      toCount: toCount,
      totalCount: totalCount
    }

    return param;
  }

  getParamValue(URL, variable) {
    if (URL.indexOf("?") != -1) {
      let splitURL = URL.split("?");
      let splitParams = splitURL[1].split("&");
      for (let i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == variable) {
          return singleURLParam[1];
        }
      }
    } else {
      return null;
    }
  }


}
