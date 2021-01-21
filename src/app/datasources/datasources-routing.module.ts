import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasourcesComponent } from './datasources.component';

const routs: Routes = [
  { path: '', component: DatasourcesComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class DatasourcesRoutingModeule { }
