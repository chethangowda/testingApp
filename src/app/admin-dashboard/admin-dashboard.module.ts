import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { ExtractionComponent } from './extraction/extraction.component';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FilterPipe } from './audit-log/RemoveDuplicate.pipe';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHeaderComponent,
    ExtractionComponent,
    AuditLogComponent,
    FilterPipe],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    SharedModule
  ],
  exports: [
    FilterPipe
  ]
})
export class AdminDashboardModule { }
