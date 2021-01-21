import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmalConfigRoutingModeule } from './pmal-config-routing.module';
import { PmalConfigComponent } from './pmal-config.component';
import { PmalRulesConfigComponent } from './pmal-rules-config/pmal-rules-config.component';
import { PmalDataService } from './pmalDataService/pmal-data.service';
import { PmalConfigHeaderComponent } from './pmal-config-header/pmal-config-header.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PmalConfigComponent,
    PmalRulesConfigComponent,
    PmalConfigHeaderComponent
  ],
  imports: [
    CommonModule,
    PmalConfigRoutingModeule,
    SharedModule
  ],
  providers: [
    PmalDataService
  ]
})

export class PmalConfigModule { }
