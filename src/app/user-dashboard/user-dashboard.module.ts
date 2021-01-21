import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardHeaderComponent } from './user-dashboard-header/user-dashboard-header.component';
import { DataSetComponent } from './data-set/data-set.component';
import { MetricsComponent } from './metrics/metrics.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './metrics/bar-chart/bar-chart.component';
import { PieChartComponent } from './metrics/pie-chart/pie-chart.component';
import { GraphComponent } from './metrics/graph/graph.component';
import { UserDashboardComponent } from './user-dashboard.component';
import { PmalComponent } from './pmal/pmal.component';
import { DatasourceByDatasetComponent } from './data-set/datasource-by-dataset/datasource-by-dataset.component';
import { MatSortModule } from '@angular/material';
import { MetricsDashdoardComponent } from './metrics-dashdoard/metrics-dashdoard.component';
import { CoverageRequirementsComponent } from './coverage-requirements/coverage-requirements.component';

@NgModule({
  declarations: [
    UserDashboardHeaderComponent,
    DataSetComponent,
    MetricsComponent,
    BarChartComponent,
    PieChartComponent,
    GraphComponent,
    UserDashboardComponent,
    PmalComponent,
    DatasourceByDatasetComponent,
    MetricsDashdoardComponent,
    CoverageRequirementsComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    SharedModule,
    ChartsModule,
    MatSortModule
  ]
})
export class UserDashboardModule { }
