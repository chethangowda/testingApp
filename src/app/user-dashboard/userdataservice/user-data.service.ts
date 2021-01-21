import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  // userdashboard page count
  private userDashboardCountSubject = new Subject<any>();
  userDashboardCountData = this.userDashboardCountSubject.asObservable();

  // userdashboard pagination count
  private userDashboardPaginationSubject = new Subject<any>();
  userDashboardPagination = this.userDashboardPaginationSubject.asObservable();

  // userdashboard filter
  private userDashboardFilterSubject = new Subject<any>();
  userDashboardFilterData = this.userDashboardFilterSubject.asObservable();

  constructor() { }

  // userdashboard page count
  sendUserDashboardCount(message: any) {
    this.userDashboardCountSubject.next(message);
  }

  // userdashboard pagination count
  sendUserDashboardPagination(message: string) {
    this.userDashboardPaginationSubject.next(message);
  }

  // userdashboard filter
  sendUSerDashboardFilterData(message: string) {
    this.userDashboardFilterSubject.next(message);
  }

}
