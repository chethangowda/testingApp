import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmindataService {
  // List count
  private auditCountSubject = new Subject<any>();
  auditCountData = this.auditCountSubject.asObservable();

  //  Search data
  private auditFilterSubject = new Subject<any>();
  auditSearchData = this.auditFilterSubject.asObservable();

  //  list pagination call
  private auditPaginationSubject = new Subject<any>();
  auditPAgination = this.auditPaginationSubject.asObservable();

  constructor() { }

  //  List count
  sendauditCountList(message: string) {
    this.auditCountSubject.next(message);
  }

  //  Search data
  sendauditFilterData(message: string) {
    this.auditFilterSubject.next(message);
  }

  //  list pagination call
  auditPaginationCall(message: object) {
    this.auditPaginationSubject.next(message);
  }

}
