import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatProgressBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PatientViewService } from 'src/services/patientview_sevice';

import { DataService } from 'src/services/data.service';
import { PatientDataService } from '../analytics/dataServices/data.service';
import { SearchFilter } from 'src/pipe/searchfilter.pipe';
import { AdminDashboardService } from 'src/services/admindashboard.service';
import { UserDashboardService } from 'src/services/userdashboard.services';
import { LoaderService } from 'src/core/loader/loader.service';
import { DatasourceService } from 'src/services/datasourcec.service';
import { UserManagementService } from 'src/services/user-management.services';
import { MetricsDataService } from '../user-dashboard/metrics/metricDataServices/data.service';
import { AuthGuard } from 'src/core/auth.gaurd';
import { AuthenticationService } from 'src/services/authentication.service';
import { GroupManagementService } from 'src/services/group-management.service';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { CohortqueryService } from 'src/services/cohortquery.service';
import { LoginComponent } from '../login/login.component';
import { CohortDataService } from '../cohort-query/shared/cohortDataservice';
import { PmalConfigService } from 'src/services/pml-config.service';
import { PmalDataService } from '../pmal-config/pmalDataService/pmal-data.service';
import { AuthInterceptor } from 'src/core/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { DataserviceGeneral } from './dataserviceGeneral/dataservicegeneral';

@NgModule({
  declarations: [SearchFilter],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatGridListModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTreeModule, MatStepperModule,
    CdkTreeModule,
    SearchFilter,
    SatPopoverModule
  ],
  imports: [
  ],
  providers: [
    AuthenticationService,
    PatientViewService,
    DataService,
    PatientDataService,
    AdminDashboardService,
    UserDashboardService,
    LoaderService,
    DatasourceService,
    UserManagementService,
    MetricsDataService,
    AuthGuard,
    GroupManagementService,
    CohortqueryService,
    LoginComponent,
    GroupManagementService,
    CohortDataService,
    PmalConfigService,
    PmalDataService,
    DataserviceGeneral,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
})
export class SharedModule {
}
