import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityConfigComponent } from './security-config.component';

const routs: Routes = [
  { path: '', component: SecurityConfigComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class SecurityConfigRoutingModeule { }
