import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserConfigService } from 'src/services/user-config.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
  userForm: FormGroup;
  configobj: any;
  disable: boolean = false;

  constructor(private fb: FormBuilder, private userconfigservice: UserConfigService, private _location: Location) {

  }

  ngOnInit() {
    this.userForm = this.fb.group({
      unsuccessfullogin: ['', [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]],
      userdeactivation: ['', [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]],
      passwordexpiry: ['', [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]],
      passwordnotice: ['', [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]]
    })
    this.loadconfigs();
  }

  loadconfigs() {
    this.userconfigservice.getconfig().subscribe(data => {
      if (data) {
        this.configobj = data;
        if (this.configobj.noOfDaysPasswordExpiry < this.configobj.emailRemainderExpiry) {
          this.disable = true;
        } else {
          this.disable = false;
        }
        this.userForm.patchValue({
          unsuccessfullogin: this.configobj.noUnsuccessfullLoginAttempts,
          userdeactivation: this.configobj.noOfDaysInactiveDays,
          passwordexpiry: this.configobj.noOfDaysPasswordExpiry,
          passwordnotice: this.configobj.emailRemainderExpiry
        });
      }
    })
  }

  onSubmit() {
    if (this.userForm.valid) {
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
      let uid = userDetails['id']
      let param = {
        noUnsuccessfullLoginAttempts: this.userForm.value.unsuccessfullogin,
        noOfDaysInactiveDays: this.userForm.value.userdeactivation,
        noOfDaysPasswordExpiry: this.userForm.value.passwordexpiry,
        emailRemainderExpiry: this.userForm.value.passwordnotice
      }
      this.userconfigservice.createconfig(param, this.configobj.id, uid).subscribe(data => {
        this.loadconfigs();
      })
    }

  }

  closeform() {
    this._location.back();
  }

}
