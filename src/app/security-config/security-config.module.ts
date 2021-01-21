import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SecurityConfigContentComponent } from './security-config-content/security-config-content.component';
import { SecurityHeaderComponent } from './security-header/security-header.component';
import { SecurityConfigRoutingModeule } from './security-config-routing.module';
import { SecurityConfigComponent } from './security-config.component';


@NgModule({
  declarations: [
    SecurityConfigContentComponent,
    SecurityConfigComponent,
    SecurityHeaderComponent,
  ],
  imports: [
    CommonModule,
    SecurityConfigRoutingModeule,
    SharedModule
  ],
  providers: [
  ]
})

export class SecurityConfigModule { }
