import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupManagementComponent } from './group-management.component';

const routs: Routes = [
  { path: '', component: GroupManagementComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class GroupManagementRoutingModeule { }
