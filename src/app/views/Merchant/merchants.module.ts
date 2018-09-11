import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DataTablesModule} from 'angular-datatables';
import { CarouselModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { AlertModule } from 'ngx-bootstrap';


import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { TabsModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SelectModule } from 'ng2-select';
import { NgxQRCodeModule } from 'ngx-qrcode2';


import {NewmerchantComponent} from './newmerchant.component';
import {MerchantsearchComponent} from './merchantsearch.component';
import {PendingmerchantComponent} from './pendingmerchant.component';
import {MerchantexportComponent} from './merchantexport.component';
import {MerchantimportComponent} from './merchantimport.component';
import {ManagemerchantComponent} from './managemerchant.component';
import {MerchantOrderComponent} from './merchantOrder.component';
import {OrderviewComponent} from './orderview.component';
import { AgmCoreModule } from '@agm/core';

import { EqualValidator } from '../../Shared/directives/equalvalidator.directive';
import { CapitalizeDirective } from '../../Shared/directives/Capitalize.directive';


import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import {RlTagInputModule} from 'angular2-tag-autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    NewmerchantComponent,
    MerchantsearchComponent,
    PendingmerchantComponent,
    MerchantexportComponent,
    MerchantimportComponent,
    ManagemerchantComponent,
    MerchantOrderComponent,
    OrderviewComponent,
    EqualValidator,
    CapitalizeDirective,
  ],
  imports: [
    RlTagInputModule,
    NgxSpinnerModule,
    CarouselModule.forRoot(),
    BrowserModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    FormsModule,
    SelectModule,
    NgxQRCodeModule,
    CKEditorModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    DataTablesModule,
    TabsModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD0rk9tbxnofuJwX8ZRXcw0Js6TfJ4jkaM'
    }),
    ShowHidePasswordModule.forRoot(),
  ],
  exports: [
    NewmerchantComponent,
    MerchantsearchComponent,
    PendingmerchantComponent,
    MerchantexportComponent,
    MerchantimportComponent,
    ManagemerchantComponent,
    MerchantOrderComponent,
    OrderviewComponent,
  ],
})

export class MerchantsModule {
}

