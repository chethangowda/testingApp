import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from './loader';
import { NotificationsService } from 'angular2-notifications';

export type NotificationType = 'success' | 'error' | 'alert' | 'warn' | 'info';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  xAuthToken: any;
  username: any;
  uId: any;

  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();

  constructor(private notificationService: NotificationsService) { }

  public showNotificationMsg(
    message: string,
    type: NotificationType = 'info',
    title?: string,
    overrideOptions?: any
  ) {
    this.notificationService[type](
      title,
      message,
      overrideOptions
    );
  }

  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }
}
