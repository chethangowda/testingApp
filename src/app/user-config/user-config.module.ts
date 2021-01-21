import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserConfigRoutingModule } from './user-config-routing.module';
import { UserConfigComponent } from './user-config.component';

@NgModule({
  declarations: [
    UserConfigComponent
  ],
  imports: [
    CommonModule,
    UserConfigRoutingModule,
    SharedModule
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [
  ]
})

export class UserConfigModule { }
