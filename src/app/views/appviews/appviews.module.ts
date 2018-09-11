import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';



import {StarterViewComponent} from './starterview.component';
import {LoginComponent} from './login.component';
import {MyProfileComponent} from './myprofile.component';
import {ChangepasswordComponent} from './changepassword.component';
import {ForgotpasswordComponent} from './forgotpassword.component';

import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';

@NgModule({
  declarations: [
    StarterViewComponent,
    LoginComponent,
    MyProfileComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    StarterViewComponent,
    LoginComponent,
    MyProfileComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent
  ],
})

export class AppviewsModule {
}
