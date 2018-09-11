import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../../Shared/services/alert.service';
import { AuthenticationService } from '../../Shared/services/authentication.service';
import swal from 'sweetalert2';

@Component({
  selector: 'login.template.html',
  templateUrl: 'login.template.html',
  styleUrls: [ 'login.component.css' ]
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    // this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          if (data.success === true) {
            this.router.navigate(['/starterview']);
          } else {
            swal(
              'Oops...',
              'Invalid Username or Password!',
              'error');
          }
        },
        error => {
          this.alertService.error(error);
          // this.loading = false;
        });
   // this.router.navigate(['/starterview']);
  }
}
