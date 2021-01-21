import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceConfigContentComponent } from './service-config-content/service-config-content.component';

const routs: Routes = [
  { path: '', component: ServiceConfigContentComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class ServiceConfigRoutingModeule { }
