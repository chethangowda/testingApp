import { Injectable } from '@angular/core';
import { Location } from '@angular/common'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private location: Location) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isLogin = localStorage.getItem('isLogin');
    let userdetails = JSON.parse(localStorage.getItem('userDetails'));
    let ppppppp
    if (userdetails) {
      ppppppp = userdetails['userPermissions'];
    }

    if (!isLogin || isLogin == 'false') {
      this.router.navigate(['/login']);
      return true;
    } else if (isLogin) {
      if (state.url == '/') {
        this.router.navigate(['/' + localStorage.getItem('dashboard')])
      }
      if (next.data.roles) {
        let tempData = next.data.roles;
        const found = ppppppp.some(it => {
          return tempData.includes(it)
        })
        return found;
      }
    }
    // let isLogin = localStorage.getItem('isLogin');
    // if (!isLogin || isLogin == 'false') {
    //   this.router.navigate(['/login']);
    //   return false;
    // } else if((localStorage.getItem('dashboard') == 'userdashBoard' && state.url == '/adminDashboard')) {
    //     this.router.navigate(['/'+localStorage.getItem('dashboard')]);
    //     return false
    // } else {
    //     return true;
    // }

  }
}


// else if((localStorage.getItem('dashboard') == 'userdashBoard' && state.url == '/adminDashboard')
//             || localStorage.getItem('dashboard') == 'adminDashboard' && state.url == '/userdashBoard') {
//             this.router.navigate(['/'+localStorage.getItem('dashboard')]);
//             return false
//         }
