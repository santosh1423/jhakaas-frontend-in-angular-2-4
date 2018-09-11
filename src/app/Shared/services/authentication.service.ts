import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';


@Injectable()
export class AuthenticationService {
  private userUrl = environment.apiUrl + 'login';
  constructor(private router: Router, private http: Http) { }

  login(username: string, password: string) {
    return this.http.post( this.userUrl , { username: username, password: password })
      .map((response: Response) => {
        // login successful if there's a api_token in the response
        const data = response.json();
        if (JSON.stringify(data.success) === 'true') {
          // store user details and api_token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('api_token', JSON.stringify(data.user.api_token));
          sessionStorage.setItem('firstName', JSON.stringify(data.user.firstName));
          sessionStorage.setItem('lastName', JSON.stringify(data.user.lastName));
          sessionStorage.setItem('_id', JSON.stringify(data.user._id));
          sessionStorage.setItem('name', JSON.stringify(data.user.firstName + ' ' + data.user.lastName));
          sessionStorage.setItem('type', JSON.stringify(data.user.type));
          sessionStorage.setItem('username', JSON.stringify(data.user.mobileNumber));
        }
        return response.json( );
      });
  }

  isLoggedIn() {
    if (sessionStorage.getItem('api_token')) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url and return false
      this.router.navigate(['/login']);
      return false;
    }
  }

  getUser() {
    return sessionStorage.getItem('name');
  }

  apiToken() {
    return sessionStorage.getItem('api_token');
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('api_token');
  }
}
