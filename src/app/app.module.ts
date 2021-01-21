import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LoaderComponent } from 'src/core/loader/loader.component';
import { DatasourcesService } from './datasources/datasources.service';
import { DatePipe } from '@angular/common';


import { ChartsModule } from 'ng2-charts';
import { MatDialogModule, MatSortModule } from '@angular/material';
import { NoContentComponent } from './no-content/no-content.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { CohortModalComponent } from './cohort-query/cohort-modal/cohort-modal.component';
import { FilterPipe } from './security-config/RemoveDuplicate.pipe';
import { StatusDialogComponent } from './security-config/status-dialog/status-dialog.component';
import { UserIdleModule } from 'angular-user-idle';
import { NumberDirective } from './shared/numbersonly.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    NoContentComponent,
    PasswordResetComponent,
    MyAccountComponent,
    CohortModalComponent,
    FilterPipe,
    StatusDialogComponent,
    NumberDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    ChartsModule,
    MatSortModule,
    MatDialogModule,
    SimpleNotificationsModule.forRoot(),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    UserIdleModule.forRoot({})
  ],
  entryComponents: [
    StatusDialogComponent,
    CohortModalComponent
  ],
  exports: [
    FilterPipe
  ],
  providers: [DatasourcesService,
    DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
