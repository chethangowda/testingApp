import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementHeaderComponent } from './user-management-header/user-management-header.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserManagementHeaderComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [
  ]
})

export class UserManagementModule { }
