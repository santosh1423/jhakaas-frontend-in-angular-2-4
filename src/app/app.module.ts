import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import {ROUTES} from './app.routes';
import { AppComponent } from './app.component';
import {DataTablesModule} from 'angular-datatables';
import {SelectModule} from 'ng2-select';
import { PapaParseModule} from 'ngx-papaparse';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { CKEditorModule } from 'ng2-ckeditor';
import {SubscriptionModule} from "./views/Subscription/subscription.module";
import {VirtualStoreModule} from "./views/Virtual Store/virtualStore.module";
import {PolicyMasterModule} from './views/Policy Master/policyMaster.module';
import {HsnModule} from './views/HSNMaster/hsn.module';
// App views
import {AppviewsModule} from './views/appviews/appviews.module';
import {CategoryModule} from './views/Category/category.module';
import {MerchantsModule} from './views/Merchant/merchants.module';
import {ProductsModule} from './views/Product/products.module';
import {SystemSettingModule} from './views/SystemSetting/systemSetting.module';
import {CustomerModule} from "./views/CustomerList/customer.module";
import {PaymentOptionModule} from "./views/PaymentOption/paymentOption.module";
import {VideoTutorialModule} from "./views/VideoTutorials/videoTutorial.module";
import {HomeScreenModule} from "./views/Home Screen Slider/homeScreen.module";
import {VoucherModule} from "./views/Voucher/voucher.module";
// App modules/components
import {LayoutsModule} from './components/common/layouts/layouts.module';

// Login
import {LoginModule} from './views/Login/login.module';
import { CarouselModule } from 'angular4-carousel';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    VirtualStoreModule,
    PolicyMasterModule,
    SubscriptionModule,
    CustomerModule,
    FormsModule,
    HsnModule,
    VoucherModule,
    VideoTutorialModule,
    HomeScreenModule,
    HttpModule,
    HttpClientModule,
    LayoutsModule,
    LoginModule,
    SelectModule,
    AppviewsModule,
    CarouselModule,
    PaymentOptionModule,
    CategoryModule,
    MerchantsModule,
    ProductsModule,
    SystemSettingModule,
    NgxQRCodeModule,
    CKEditorModule,
    RouterModule.forRoot(ROUTES),
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      closeButton: true,
      newestOnTop: true,
      progressBar: true,
      enableHtml: true,
    }),
    BrowserAnimationsModule,
    PapaParseModule,
    DataTablesModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent ]
})
export class AppModule { }

