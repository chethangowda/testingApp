import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ServiceConfigContentComponent } from './service-config-content/service-config-content.component';
import { ServiceConfigComponent } from './service-config.component';
import { ServiceHeaderComponent } from './service-header/service-header.component';
import { ServiceConfigRoutingModeule } from './service-config-routing.module';
import { FilterPipe } from './RemoveDuplicate.pipe';


@NgModule({
  declarations: [
    ServiceConfigContentComponent,
    ServiceConfigComponent,
    ServiceHeaderComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ServiceConfigRoutingModeule,
    SharedModule
  ],
  providers: [
  ],
  exports: [
    FilterPipe
  ]
})

export class ServiceConfigModule { }
