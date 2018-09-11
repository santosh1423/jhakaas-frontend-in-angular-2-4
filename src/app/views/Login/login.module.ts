import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';


// Login with Authguard

import { AlertComponent } from '../../Shared/directives/alert.component';
import { AuthGuard} from '../../Shared/guard/auth.guard.services';
import { AlertService } from '../../Shared/services/alert.service';
import { AuthenticationService} from '../../Shared/services/authentication.service';
import { UserService } from '../../Shared/services/user.service';
import { LoginComponent } from './login.component';

import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';

@NgModule({
  declarations: [
    AlertComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    FormsModule,
    ShowHidePasswordModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
  ],
  exports: [
    AlertComponent,
    LoginComponent,
  ],
})

export class LoginModule {
}
