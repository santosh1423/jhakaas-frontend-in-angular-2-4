import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { UserAddComponent } from './userAdd.component';
import { UserEditComponent } from './userEdit.component';
import { UserListComponent } from './userList.component';
import { RightmanagementComponent } from './rightmanagement.component';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { UserEqualValidator } from '../../Shared/directives/userequivalidator.directive';
import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import {DataTablesModule} from 'angular-datatables';
import { SelectModule } from 'ng2-select';
import { AlertModule } from 'ngx-bootstrap';
import {SendNotificationComponent} from "./sendNotification.component";
import {SmsComponent} from "./sms.component";
import {SmtpComponent} from "./smtp.component";

@NgModule({
  declarations: [
    UserAddComponent,
    UserEditComponent,
    UserListComponent,
    RightmanagementComponent,
    UserEqualValidator,
    SendNotificationComponent,
    SmsComponent,
    SmtpComponent
  ],
  imports: [
    SelectModule,
    BrowserModule,
    AlertModule.forRoot(),
    ShowHidePasswordModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    FormsModule,
    DataTablesModule,
  ],
  exports: [
    UserAddComponent,
    UserEditComponent,
    UserListComponent,
    RightmanagementComponent
  ],
})

export class SystemSettingModule {
}

