import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DataserviceGeneral {

  private dataserviceSubject = new Subject<any>();
  dataservicesubscribe = this.dataserviceSubject.asObservable();

  constructor() { }

  passDataToService(message: string) {
    this.dataserviceSubject.next(message);
  }

}
