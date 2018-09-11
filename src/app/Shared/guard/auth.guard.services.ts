import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService} from '../services/authentication.service';
import {LoginComponent} from '../../views/Login/login.component';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationservice: AuthenticationService) {
  }

  canActivate() {
    this.authenticationservice.isLoggedIn();
    return true;
  }

  canActivateChild() {
    this.authenticationservice.isLoggedIn();
    return true;
  }
}
