import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
import { MatDialogModule } from '@angular/material';
import { GroupManagementRoutingModeule } from './group-management-routing.module';
import { GroupManagementComponent } from './group-management.component';
import { GroupManagementHeaderComponent } from './group-management-header/group-management-header.component';
import { DeactivateDialogComponent } from './deactivate-dialog/deactivate-dialog.component';

@NgModule({
  declarations: [
    GroupManagementComponent,
    GroupManagementHeaderComponent,
    DeactivateDialogComponent
  ],
  imports: [
    CommonModule,
    GroupManagementRoutingModeule,
    SharedModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [
  ]
})

export class GroupManagementModule { }
