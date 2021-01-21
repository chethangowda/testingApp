import { Component, OnInit, NgZone } from '@angular/core';
import { MyaccountService } from 'src/services/myaccount.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as country from './../shared/entity/countrydata';
import { UserManagementService } from 'src/services/user-management.services';
import { Router } from '@angular/router';
import { DataService } from 'src/services/data.service';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  profileres: any;
  grpslist: any = [];
  url: any;
  userprofile: boolean = true;
  editprofile: boolean = false;
  eventForm: FormGroup;
  resetForm: FormGroup;
  password: boolean = false;
  countrtList: any = [];
  statusList: any = [
    { name: 'Active', id: 'active' },
    { name: 'InActive', id: 'inactive' },
    { name: 'DeActive', id: 'deactive' }
  ]
  connectorTypes: any;

  constructor(private router: Router, private fb: FormBuilder, private myservice: MyaccountService, private ngZone: NgZone
    , private userManagementService: UserManagementService,
    private dataService: DataService,
    private authenticationService: AuthenticationService) {
    this.eventForm = this.fb.group({

      userID: ['', [Validators.required, , Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      Email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      group: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      organization: ['', Validators.required],
      Department: [''],
      Address: [''],
      City: [''],
      Country: ['', Validators.required],
      Code: ['', Validators.required],
      Number: ['', [Validators.required, Validators.pattern('^(([0-9]{10}))*$')]],
      Status: [''],

    })

    this.resetForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
      confirmpassword: ['', Validators.required],
    },
      { validator: this.checkpasswords });

  }

  ngOnInit() {
    this.loadprofile();
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




  loadprofile() {
    const json = {
      userId: localStorage.getItem('userEmail')
    }
    this.myservice.getprofile(json).subscribe((response: any) => {
      if (response) {
        let permissions = [];
        let permissionlist = [];
        this.profileres = response;


        this.myservice.sendpassword(this.profileres.profilePic);
        localStorage.setItem('profilepic', this.profileres.profilePic)
        if (this.profileres.profilePic === "NULL") {
          this.url = 'assets/images/user.png'
        } else {
          this.url = this.profileres.profilePic;
        }
        this.grpslist = [];
        for (let item of this.profileres.userGroups) {
          this.grpslist.push(item.group.groupName);
        }

        if ('userGroups' in response && response.userGroups instanceof Array) {
          for (let item of response.userGroups) {
            if ('group' in item && 'groupName' in item.group) {
              permissions.push(item.group.groupName);
              for (let gitem of item.group.groupPermissions) {
                permissionlist.push(gitem.permission.authority)
              }
            }
          }
        }
        response['userPermissions'] = permissionlist;
        this.dataService.sendUserType(response);

      }

    })

  }

  close() {
    this.userprofile = true;
    this.editprofile = false;
    this.password = false;
  }

  closeform() {
    this.editprofile = false;
    this.userprofile = true;
    this.password = false;
    if (this.profileres.profilePic === "NULL") {
      this.url = 'assets/images/user.png'
    } else {
      this.url = this.profileres.profilePic;
    }
  }

  onSelectFile(event) {
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onabort = (evet) => {
    }

    fileReader.onload = (event) => {
      this.url = fileReader.result;
    }
  }

  updateprofile() {
    this.getGroupList();
    this.countrtList = country.countrydata;
    this.userprofile = false;
    this.password = false;
    this.editprofile = true;
    let groupList = [];
    let phoneNumber;


    this.ngZone.run(() => {
      this.eventForm.controls['Email'].disable();
      this.eventForm.controls['userID'].disable();
      this.eventForm.controls['Status'].disable();
      this.eventForm.controls['group'].disable();
      this.eventForm.controls['Status'].updateValueAndValidity();
    })

    if ('userGroups' in this.profileres && this.profileres.userGroups instanceof Array) {
      for (let g_item of this.profileres.userGroups) {
        if ('group' in g_item) {
          groupList.push(g_item.group.groupId);
        }
      }

    }

    if (this.profileres.phone.includes('-')) {
      phoneNumber = this.profileres.phone.split('-')[1];
    }

    this.eventForm.patchValue({
      Address: this.profileres.address,
      City: this.profileres.city,
      Country: this.profileres.country,
      Department: this.profileres.department,
      Email: this.profileres.username,
      first_name: this.profileres.firstName,
      group: groupList.length > 0 ? groupList : null,
      last_name: this.profileres.lastName,
      organization: this.profileres.organization,
      Number: phoneNumber,
      Status: this.profileres.status ? this.profileres.status : 'active',
      userID: this.profileres.username,
    })

    this.onSelectCountryDropdown({ value: this.profileres.country });

  }

  onSelectCountryDropdown(event) {
    let country = this.getCountryCode(event.value);
    this.eventForm.patchValue({
      Code: country ? country.dialcode : ''
    })
    this.eventForm.controls['Code'].disable();
  }

  getCountryCode(value) {
    for (let item of this.countrtList) {
      if (item.value == value) {
        return item
      }
    }
    return null
  }
  getGroupList() {
    this.userManagementService.getDropdownList().subscribe(datasetData => {
      this.connectorTypes = datasetData;
    })
  }

  onSelectDropdown(event) {

  }

  onSubmit() {
    if (this.eventForm.valid) {
      let country = this.getCountryCode(this.eventForm.value.Country);
      let mobileNumber = country.dialcode + '-' + this.eventForm.value.Number;

      let param = {
        address: this.eventForm.value.Address,
        city: this.eventForm.value.City,
        country: this.eventForm.value.Country,
        department: this.eventForm.value.Department,
        email: this.eventForm.getRawValue().Email,
        firstName: this.eventForm.value.first_name,
        groupIds: this.eventForm.getRawValue().group,
        lastName: this.eventForm.value.last_name,
        organization: this.eventForm.value.organization,
        phone: mobileNumber,
        status: this.eventForm.getRawValue().Status,
        userId: this.eventForm.getRawValue().userID,
      }
      param['profilePic'] = this.url

      param['id'] = this.profileres.id;
      this.myservice.updateprofile(param, this.profileres.id).subscribe(data => {
        this.eventForm.reset();
        this.editprofile = false;
        this.password = false;
        this.userprofile = true;
        this.loadprofile();
      })
    }

  }

  changepassword() {
    this.password = true;
    this.userprofile = false;
    this.editprofile = false;
  }

}
