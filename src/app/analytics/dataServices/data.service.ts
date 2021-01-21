import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PatientDataService {

  // Patient List count
  private patientCountSubject = new Subject<any>();
  patientCountData = this.patientCountSubject.asObservable();

  // Patient Search data
  private patientFilterSubject = new Subject<any>();
  patientSearchData = this.patientFilterSubject.asObservable();


  // Patient list pagination call
  private patientPaginationSubject = new Subject<any>();
  patientPAgination = this.patientPaginationSubject.asObservable();

  constructor() { }

  // Patinet List count
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
