import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmalConfigComponent } from './pmal-config.component';
import { PmalRulesConfigComponent } from './pmal-rules-config/pmal-rules-config.component';

const routs: Routes = [
  { path: '', component: PmalConfigComponent },
  { path: 'rules', component: PmalRulesConfigComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class PmalConfigRoutingModeule { }
