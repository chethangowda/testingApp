import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientMatchingALComponent } from './patient-matching-al.component';

const routs: Routes = [
  { path: '', component: PatientMatchingALComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class PatientMatchingALRoutingModeule { }
