import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "./../../validators/customovalidator";
import { AuthenticationService } from "src/services/authentication.service";
import { isNgTemplate } from "@angular/compiler";
import { DataService } from "src/services/data.service";
import { BehaviorSubject } from "rxjs";
import * as country from "./../shared/entity/countrydata";
import { LoaderService } from "src/core/loader/loader.service";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  useridForm: FormGroup;
  fgtuseridForm: FormGroup;
  otpform: FormGroup;
  resendotp: boolean = true;
  login: boolean = true;
  fgtpassword: boolean = false
  fgtuserid: boolean = false
  otpscreen: boolean = false
  permissionlist: any = [];
  countryList: any = [];
  isSetPassword: boolean = false;
  baseUrl: any = environment.baseURL;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private loaderService: LoaderService


  ) { }

  ngOnInit() {
    this.fgtpassword = false;
    this.login = true;
    this.fgtuserid = false;
    this.otpscreen = false;
    localStorage.clear();
    this.loginForm = this.fb.group({
      emailID: ["", [Validators.required, CustomValidators.validateEmail]],
      password: ["", Validators.required],
    });

    this.useridForm = this.fb.group({
      emailID: ["", [Validators.required, CustomValidators.validateEmail]],
    });

    this.fgtuseridForm = this.fb.group({
      Country: ["", Validators.required],
      Code: ["", Validators.required],
      Number: [
        "",
        [Validators.required, Validators.pattern("^(([0-9]{10}))*$")],
      ],
    })

    this.otpform = this.fb.group({
      Number: ["", [Validators.required]],
      otp: ["", Validators.required],
    });

    this.activatedRoute.queryParams.subscribe((params) => {

      if (Object.keys(params).length > 0) {
        this.isSetPassword = true;
        var userId = params["userId"];
        var passwd = params["password"];
        this.loginForm.setValue({
          emailID: atob(userId),
          password: atob(passwd),
        });
        localStorage.setItem("user", atob(userId));
        this.onLogin(this.loginForm);
      }
    });
  }

  onSelectCountryDropdown(event) {
    let country = this.getCountryCode(event.value);
    this.fgtuseridForm.patchValue({
      Code: country ? country.dialcode : "",
    });
    this.fgtuseridForm.controls["Code"].disable();
  }

  getCountryCode(value) {
    for (let item of this.countryList) {
      if (item.value == value) {
        return item;
      }
    }
    return null;
  }

  onLogin(form: FormGroup) {
    if (form.valid) {
      let param = {
        userId: form.value.emailID,
        password: form.value.password,
        link: this.isSetPassword,
      };
      this.authenticationService.loginCall(param).subscribe((data) => {
        if (data) {
          const prgam = data.headers.get("pragma");
          const xauth = data.headers.get("X-AUTH-TOKEN");
          localStorage.setItem("X-AUTH-TOKEN", xauth);
          let userParam = {
            userId: form.value.emailID,
          };
          this.userDetails(userParam);
          localStorage.setItem("isLogin", "true");
        }
      });
      localStorage.setItem("user", form.value.emailID);
    }
  }

  submituserid(form: FormGroup) {
    if (form.valid) {
      let param = {
        userId: form.value.emailID,
      };
      this.authenticationService.forgotpassword(param).subscribe((data) => { });
    }
  }

  submitmobile(form: FormGroup) {
    if (form.valid) {
      let country = this.getCountryCode(form.value.Country);
      let mobileNumber = country.dialcode + "-" + form.value.Number;
      let param = {
        phone: mobileNumber,
      };
      this.authenticationService.forgotuserid(param).subscribe((data) => {
        if (data) {
          this.otpscreen = true;
          this.login = false;
          this.fgtpassword = false;
          this.fgtuserid = false;
          this.otpform.patchValue({
            Number: mobileNumber,
          });
        }
      });
    }
  }

  verifyotp(form: FormGroup) {
    if (form.valid) {
      let param = {
        phone: form.value.Number,
        otp: form.value.otp,
      };
      this.authenticationService.getuserid(param).subscribe((data) => {
        this.loaderService.showNotificationMsg(
          data.message,
          "success",
          "success"
        );
        if (data) {
          this.fgtpassword = false;
          this.login = true;
          this.fgtuserid = false;
          this.otpscreen = false;
        }
      });
    }
  }

  resend(form: FormGroup) {
    let param = {
      phone: form.value.Number,
    };
    this.authenticationService.forgotuserid(param).subscribe((data) => { });
  }

  userDetails(param) {
    this.authenticationService.getUserDetails(param).subscribe((data) => {
      let permissions = [];
      let permissionlist = [];
      if (data) {
        localStorage.setItem("userEmail", data.email);
        if ("userGroups" in data && data.userGroups instanceof Array) {
          for (let item of data.userGroups) {
            if ("group" in item && "groupName" in item.group) {
              permissions.push(item.group.groupName);
              for (let gitem of item.group.groupPermissions) {
                this.permissionlist.push(gitem.permission.authority);
              }
            }
          }
        }
      }
      localStorage.setItem("userPermission", permissions.join(","));
      data["userPermissions"] = this.permissionlist;
      this.dataService.sendUserType(data);

      if (this.permissionlist.includes("ADMIN_PERMISSION")) {
        if (this.isSetPassword) {
          this.router.navigate(["/passwordreset"]);
          return;
        }
        this.router.navigate(["/adminDashboard"]);
      } else {
        if (this.isSetPassword) {
          this.router.navigate(["/passwordreset"]);
          return;
        }
        this.router.navigate(["/"]);
      }
    });
  }

  forgotpassword() {
    this.login = false;
    this.fgtpassword = true;
    this.fgtuserid = false;
    this.otpscreen = false;
  }

  forgotuserid() {
    this.countryList = country.countrydata;
    this.login = false;
    this.fgtuserid = true;
    this.fgtpassword = false;
    this.otpscreen = false;
  }

  back() {
    this.fgtpassword = false;
    this.login = true;
    this.fgtuserid = false;
    this.otpscreen = false;
  }

  backtoid() {
    this.login = false;
    this.fgtpassword = true;
    this.fgtuserid = false;
  }
}
