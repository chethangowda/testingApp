import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/core/auth.gaurd';
import { NoContentComponent } from './no-content/no-content.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MyAccountComponent } from './my-account/my-account.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule),
    canActivate: [AuthGuard], data: { roles: ['Analytics_Patientview', 'Analytics_Cohort', 'ADMIN_PERMISSION'] }
  },
  // {path: 'cohort-query', component: CohortQueryComponent},
  {
    path: "usermanagement",
    loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [AuthGuard], data: { roles: ['View_User', 'ADMIN_PERMISSION'] }
  },
  {
    path: 'userdashBoard',
    loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule), canActivate: [AuthGuard], data: { roles: ['Dashboard_DataSet', 'Dashboard_ResourceMetrics', 'Dashboard_PMAL', 'Dashboard_Coverage', '', 'ADMIN_PERMISSION'] }
  },
  {
    path: "datasources",
    loadChildren: () => import('./datasources/datasources.module').then(m => m.DatasourcesModule),
    canActivate: [AuthGuard], data: { roles: ['View_DataSource', 'View_DataSet', 'View_Agent', 'ADMIN_PERMISSION'] }
  },
  {
    path: "patientMatching",
    loadChildren: () => import('./patient-matching-al/patient-matching-al.module').then(m => m.PatientMatchingALModule),
    canActivate: [AuthGuard], data: { roles: ['View_PMAL', 'ADMIN_PERMISSION'] }
  },
  {
    path: 'adminDashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule), canActivate: [AuthGuard], data: { roles: ['ADMIN_PERMISSION'] }
  },
  {
    path: "groupmanagement",
    loadChildren: () => import('./group-management/group-management.module').then(m => m.GroupManagementModule),
    canActivate: [AuthGuard], data: { roles: ['View_Group', 'ADMIN_PERMISSION'] }
  },
  { path: 'myaccount', component: MyAccountComponent },
  { path: "passwordreset", component: PasswordResetComponent },
  {
    path: "userConfiguration",
    loadChildren: () => import('./user-config/user-config.module').then(m => m.UserConfigModule),
    canActivate: [AuthGuard], data: { roles: ['Config_UserMan', 'ADMIN_PERMISSION'] }
  },
  {
    path: "securityConfiguration",
    loadChildren: () => import('./security-config/security-config.module').then(m => m.SecurityConfigModule),
    canActivate: [AuthGuard], data: { roles: ['ADMIN_PERMISSION'] }
  },
  {
    path: "serviceConfiguration",
    loadChildren: () => import('./service-config/service-config.module').then(m => m.ServiceConfigModule),
    canActivate: [AuthGuard], data: { roles: ['ADMIN_PERMISSION'] }
  },
  {
    path: "pmalConfiguration",
    loadChildren: () => import('./pmal-config/pmal-config.module').then(m => m.PmalConfigModule), canActivate: [AuthGuard], data: { roles: ['Config_PMAL', 'ADMIN_PERMISSION'] }
  },
  { path: '**', component: NoContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
