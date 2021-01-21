import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CohortDataService {

  // Cohort Execcute service
  private cohortExecuteSubject = new Subject<any>();
  executeQueryData = this.cohortExecuteSubject.asObservable();

  private cohortPaginationSubject = new Subject<any>();
  cohortPaginationData = this.cohortPaginationSubject.asObservable();

  private patientCountSubject = new Subject<any>();
  patientCountData = this.patientCountSubject.asObservable();

  // Patient Search data
  private patientFilterSubject = new Subject<any>();
  patientSearchData = this.patientFilterSubject.asObservable();


  // Patient list pagination call
  private patientPaginationSubject = new Subject<any>();
  patientPAgination = this.patientPaginationSubject.asObservable();

  constructor() { }

  // Cohort Execcute service
  sendCohortExecuteQueryData(message: any) {
    this.cohortExecuteSubject.next(message);
  }

  sendCohortPaginationData(message: any) {
    this.cohortPaginationSubject.next(message);
  }

  sendPatientCountList(message: string) {
    this.patientCountSubject.next(message);
  }

  // Patient Search data
  sendPatinetFilterData(message: string) {
    this.patientFilterSubject.next(message);
  }

  // Patient list pagination call
  patientPaginationCall(message: string) {
    this.patientPaginationSubject.next(message);
  }

}
