import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';
import { MyaccountService } from 'src/services/myaccount.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  chngpassword: boolean;
  password: any;

  pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  matcher = new MyErrorStateMatcher();
  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService,
    private router: Router, private myservice: MyaccountService) {
    this.password = this.myservice.password;
  }

  ngOnInit() {
    this.resetForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
      confirmpassword: ['', Validators.required],
    },
      { validator: this.checkpasswords });

  }

  checkpasswords(group: FormGroup) {
    let pass = group.controls.newpassword.value;
    let confirmPass = group.controls.confirmpassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onsetpassword(form: FormGroup) {
    if (form.valid) {
      let param = {
        userId: localStorage.getItem('user'),
        password: form.value.newpassword
      }
      this.authenticationService.setpassword(param).subscribe(data => {
        if (data.message === 'Success') {
          this.router.navigate(['/login']);
        }
      })
    }
  }

}
