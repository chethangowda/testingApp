import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DatasourcesRoutingModeule } from './datasources-routing.module';
import { AgentContentComponent } from './agent-content/agent-content.component';
import { DatasetContentComponent } from './dataset-content/dataset-content.component';
import { DatasourceContentComponent } from './datasource-content/datasource-content.component';
import { TransformationMapingComponent } from './transformation-maping/transformation-maping.component';
import { JsonSchemaDialogComponent } from './json-schema-dialog/json-schema-dialog.component';
import { DatasourcesComponent } from './datasources.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
import { MatDialogModule } from '@angular/material';
import { DatasourcesHeaderComponent } from './datasources-header/datasources-header.component';

@NgModule({
  declarations: [
    AgentContentComponent,
    DatasetContentComponent,
    DatasourceContentComponent,
    TransformationMapingComponent,
    JsonSchemaDialogComponent,
    DatasourcesHeaderComponent,
    DatasourcesComponent
  ],
  imports: [
    CommonModule,
    DatasourcesRoutingModeule,
    SharedModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
  ],
  entryComponents: [
    JsonSchemaDialogComponent
  ],
  providers: [
  ],
  exports: [
  ]
})

export class DatasourcesModule { }
