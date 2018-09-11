import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import { Http, Headers, Response } from '@angular/http';
import { AuthenticationService } from '../../../Shared/services/authentication.service';
import 'rxjs/add/operator/map';

declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements OnInit {
  public name: string;
  constructor(private _auth: AuthenticationService, private router: Router) {}

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery('body').hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      });
    }
  }

  ngOnInit() {
    this.name = JSON.parse(this._auth.getUser());
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  logout() {
    return this._auth.logout();
  }


}
