import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtractionComponent } from './extraction/extraction.component';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { AdminDashboardComponent } from './admin-dashboard.component';


const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'extraction', component: ExtractionComponent },
  { path: 'auditLog', component: AuditLogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
