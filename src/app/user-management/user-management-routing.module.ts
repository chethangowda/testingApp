import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

const routs: Routes = [
  { path: '', component: UserManagementComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class UserManagementRoutingModule { }
