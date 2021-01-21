import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserConfigComponent } from './user-config.component';

const routs: Routes = [
  { path: '', component: UserConfigComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})

export class UserConfigRoutingModule { }
