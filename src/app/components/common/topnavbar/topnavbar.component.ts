import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { Http, Headers, Response } from '@angular/http';
import { AuthenticationService } from '../../../Shared/services/authentication.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

declare var jQuery:any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {

  constructor(private _auth: AuthenticationService, private router: Router) {

  }

  toggleNavigation(): void {
    jQuery('body').toggleClass('mini-navbar');
    smoothlyMenu();
  }

  logout() {
    return this._auth.logout();
  }

}
