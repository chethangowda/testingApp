import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MetricsDataService {

  // Patient List count
  private barChartSubject = new Subject<any>();
  barchartData = this.barChartSubject.asObservable();

  // Patient List count
  private pieChartSubject = new Subject<any>();
  piechartData = this.pieChartSubject.asObservable();

  constructor() { }

  // Patinet List count
  sendBarchartData(message: any) {
    this.barChartSubject.next(message);
  }

  // Patinet List count
  sendPiechartData(message: any) {
    this.pieChartSubject.next(message);
  }

}
