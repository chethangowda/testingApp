import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataSetComponent } from './data-set/data-set.component';
import { MetricsComponent } from './metrics/metrics.component';
import { UserDashboardComponent } from './user-dashboard.component';
import { PmalComponent } from './pmal/pmal.component';
import { CoverageRequirementsComponent } from './coverage-requirements/coverage-requirements.component';


const routes: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'dataset', component: DataSetComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'pmal', component: PmalComponent },
  { path: 'coverage-requirements', component: CoverageRequirementsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
