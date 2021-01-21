import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/services/data.service';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { SecurityConfigService } from 'src/services/security-config.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userActivity;
  menulist: any = [];
  userInactive: Subject<any> = new Subject();
  notificationOptions = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    position: ['bottom', 'right']
  };
  groupper: any = [];
  isLoggedIn: boolean;
  timeoutvalue: number;
  menuItems: any = [
    {
      id: '1',
      name: "Admin Dashboard",
      image: 'dashboard-icon.svg',
      path: 'adminDashboard',
      type: 'item',
      permissionRequired: ['ADMIN_PERMISSION'],
    },
    {
      id: '1',
      name: "User Dashboard",
      image: 'userdashboard.png',
      path: 'userdashBoard',
      type: 'item',
      permissionRequired: ['Dashboard_DataSet', 'Dashboard_ResourceMetrics', 'Dashboard_PMAL', 'Dashboard_Coverage', '', 'ADMIN_PERMISSION'],
    },
    {
      id: '2',
      name: "Patient Matching",
      image: 'patient-icon.svg',
      path: 'patientMatching',
      type: 'item',
      permissionRequired: ['View_PMAL', 'ADMIN_PERMISSION'],
    },
    {
      id: '3',
      name: "Analytics",
      image: 'analytics-icon.svg',
      path: 'analytics',
      type: 'item',
      permissionRequired: ['Analytics_Patientview', 'Analytics_Cohort', 'ADMIN_PERMISSION'],
    },
    {
      id: '4',
      name: "Administration",
      image: 'administration-icon.svg',
      // path: "userdashBoard",
      type: 'group',
      permissionRequired: ['View_DataSource', 'View_User', 'View_DataSet', 'View_Agent', 'View_Group', 'Config_UserMan', 'Config_PMAL', 'ADMIN_PERMISSION'],
      subMenu: [
        {
          id: '4.1',
          name: 'Data Source/Set/Agent',
          path: 'datasources',
          image: 'send.png',
          type: 'item',
          permissionRequired: ['View_DataSource', 'View_DataSet', 'View_Agent', 'ADMIN_PERMISSION'],
        },
        {
          id: '4.2',
          name: 'User Management',
          path: 'usermanagement',
          image: 'send.png',
          type: 'item',
          permissionRequired: ['View_User', 'ADMIN_PERMISSION'],
        },
        {
          id: '4.2',
          name: 'Group Management',
          path: 'groupmanagement',
          image: 'send.png',
          type: 'item',
          permissionRequired: ['View_Group', 'ADMIN_PERMISSION'],
        },
        {
          id: '4.3',
          name: 'Configuration',
          image: 'send.png',
          type: 'group',
          permissionRequired: ['Config_PMAL', 'Config_UserMan', 'ADMIN_PERMISSION'],
          subMenu: [
            // {
            //   id: '4.3.1',
            //   name: 'Workflow',
            //   path: 'workflow',
            //   image: 'dot.png',
            //   type: 'item',
            //   permissionRequired: [],
            // },
            // {
            //   id: '4.3.1',
            //   name: 'User',
            //   path: 'userConfiguration',
            //   image: 'dot.png',
            //   type: 'item',
            //   permissionRequired: ['Config_UserMan','ADMIN_PERMISSION'],
            // },
            {
              id: '4.3.2',
              name: 'PMAL',
              path: 'pmalConfiguration',
              image: 'dot.png',
              type: 'item',
              permissionRequired: ['Config_PMAL', 'ADMIN_PERMISSION'],
            },
            {
              id: '4.3.3',
              name: 'Application',
              path: 'serviceConfiguration',
              image: 'dot.png',
              type: 'item',
              permissionRequired: ['ADMIN_PERMISSION'],
            },
            {
              id: '4.3.4',
              name: 'Security',
              path: 'securityConfiguration',
              image: 'dot.png',
              type: 'item',
              permissionRequired: ['ADMIN_PERMISSION'],
            },
            // {
            //   id: '4.3.3',
            //   name: 'Transformation',
            //   path: 'transformation',
            //   image: 'dot.png',
            //   type: 'item',
            //   permissionRequired: [],
            // }
          ]
        },
        {
          id: '4.4',
          name: 'Logs and Audit',
          path: 'adminDashboard;tab=auditLog',
          image: 'send.png',
          type: 'item',
          permissionRequired: ['ADMIN_PERMISSION'],
        }
      ]
    }
  ]

  title = 'interopX';
  isSelectedTab: any;
  selectedList: any;
  userEmail: any;
  showProgressMsg: boolean = false;
  dashboardType: any;
  isAdmin: any = false;
  url: string;
  password: any;
  data1: object;
  service: any;
  permissionLists: any = [];
  redirectDashboard: any;
  sessionTimeOut: any;
  constructor(private router: Router,
    private dataService: DataService,
    private systemconfig: SecurityConfigService,
    private matdialogRef: MatDialog,
    private userIdle: UserIdleService) {

    this.loginConfiguration();

    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.isSelectedTab = data['url'].split('/')[1];
        if (data['url'] == "/login" && localStorage.getItem('isLogin')) {
          this.router.navigate(['/' + this.redirectDashboard]);
        }
      }
    })

    this.service = this.dataService.userType.subscribe(data => {
      localStorage.setItem('userDetails', JSON.stringify(data));
      this.loginConfiguration();
    })
  }

  inactive() {
    this.systemconfig.getsecurityconfigList().subscribe((response: any) => {
      for (let item of response) {
        if (item.key == 'inactivity_timeout') {
          if ('value' in item && item.value) {
            this.timeoutvalue = +item.value;

            // this.timeoutvalue = +item.value;
            if (this.timeoutvalue > 0) {
              this.userIdle.setConfigValues({ idle: this.timeoutvalue, timeout: 1, ping: 0 });

              // start watch
              this.userIdle.startWatching();

              // timeout count
              this.userIdle.onTimerStart().subscribe(count => {

              });

              // Start watch when time is up.
              this.userIdle.onTimeout().subscribe(() => {
                this.onLogOut();
              });
            }

          }
        }
      }
    })
  }


  loginConfiguration() {
    let userDetails = {}
    localStorage.setItem('dashboard', 'userdashBoard');
    userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      localStorage.setItem('isLogin', 'true');
      this.permissionLists = userDetails['userPermissions'];
      this.groupper = userDetails['userPermissions'];
      if ('userPermissions' in userDetails) {
        this.groupper = userDetails['userPermissions'];
      }
      this.userEmail = 'email' in userDetails ? userDetails['email'] : '';
      if ('profilePic' in userDetails && userDetails['profilePic']) {
        this.url = userDetails['profilePic'];
      } else {
        this.url = 'assets/images/user.png';
      }
      this.inactive();
    }


    this.getpermisssionforPage(this.menuItems);
    localStorage.setItem('permisionActive', JSON.stringify(this.menuItemsPath));

    for (let item of this.menuItemsPath) {
      if (item.isActive) {
        this.redirectDashboard = item.path;
        localStorage.setItem('dashboard', this.redirectDashboard);
        break;
      }
    }
  }

  menuItemsPath: any = []
  getpermisssionforPage(array) {
    let tempReturn
    if (array.type == 'item') {
      tempReturn = this.isInPermission(array.permissionRequired);
      array['isActive'] = tempReturn
      this.menuItemsPath.push(array);
    }

    if (array.type == 'group') {
      for (let item of array.subMenu) {
        this.getpermisssionforPage(item)
      }

    }

    if (array instanceof Array) {
      for (let item of array) {
        this.getpermisssionforPage(item);
      }
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onSelect(list): void {
    list.hide = !list.hide;
    this.selectedList = list;
  }

  myaccount() {
    this.router.navigate(['/myaccount']);
  }

  onSelectTab(selectedTab) {
    if (selectedTab.name == 'Logs and Audit') {
      this.router.navigate(['/adminDashboard', { tab: 'auditLog' }]);
      return;
    }
    selectedTab['show'] = !selectedTab['show'];
    if (selectedTab.name != 'Administration') {
      this.isSelectedTab = selectedTab.path;
    }
    if ('path' in selectedTab) {
      this.router.navigate(['/' + selectedTab.path]);
    }
  }


  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.userIdle.stopWatching();
    this.userIdle.stopTimer();
  }

  isInPermission(item) {
    const found = this.groupper.some(it => {
      return item.includes(it)
    })
    return found;
  }

}
