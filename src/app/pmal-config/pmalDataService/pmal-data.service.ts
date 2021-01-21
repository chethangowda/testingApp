import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PmalDataService {

  // pagination count in data source module
  private datasrcCountSubject = new Subject<any>();
  datasrcCountData = this.datasrcCountSubject.asObservable();

  // srarch filter in data source module
  private datasrcFilterSubject = new Subject<any>();
  datasrcSearchData = this.datasrcFilterSubject.asObservable();

  // pagination call in data source module
  private datasrcPaginationSubject = new Subject<any>();
  datasrcPAgination = this.datasrcPaginationSubject.asObservable();


  // pagination call in data source module
  private datasrcModuleCreateBtnSubject = new Subject<any>();
  datasourcecModuleCreateBtn = this.datasrcModuleCreateBtnSubject.asObservable();


  constructor(private http: HttpClient) { }


  createFormFunctionCall(message: any) {
    this.datasrcModuleCreateBtnSubject.next(message);
  }

  // datasrc List count
  senddatasrcCountList(message: string) {
    this.datasrcCountSubject.next(message);
  }

  // datasrc Search data
  senddatasrcFilterData(message: string) {
    this.datasrcFilterSubject.next(message);
  }

  // datasrc list pagination call
  datasrcPaginationCall(message: object) {
    this.datasrcPaginationSubject.next(message);
  }

}
