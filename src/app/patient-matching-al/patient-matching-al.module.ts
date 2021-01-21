import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
import { MatDialogModule } from '@angular/material';
import { PatientDetailedviewComponent } from './patient-detailedview/patient-detailedview.component';
import { PatientMatchingContentComponent } from './patient-matching-content/patient-matching-content.component';
import { PatientMatchingHeaderComponent } from './patient-matching-header/patient-matching-header.component';
import { PatientMatchingALComponent } from './patient-matching-al.component';
import { PatientMatchingALRoutingModeule } from './patient-matching-al-routing.module';

@NgModule({
  declarations: [
    PatientDetailedviewComponent,
    PatientMatchingContentComponent,
    PatientMatchingHeaderComponent,
    PatientMatchingALComponent
  ],
  imports: [
    CommonModule,
    PatientMatchingALRoutingModeule,
    SharedModule,
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [
  ]
})

export class PatientMatchingALModule { }
