import {Routes} from '@angular/router';

import {StarterViewComponent} from './views/appviews/starterview.component';
// import {LoginComponent} from './views/appviews/login.component';
import { LoginComponent} from './views/Login/login.component';
import { AuthGuard } from './Shared/guard/auth.guard.services';
import {MyProfileComponent} from './views/appviews/myprofile.component';
import {ForgotpasswordComponent} from './views/appviews/forgotpassword.component';
import {ChangepasswordComponent} from './views/appviews/changepassword.component';
import {BlankLayoutComponent} from './components/common/layouts/blankLayout.component';
import {BasicLayoutComponent} from './components/common/layouts/basicLayout.component';
// Category
import {CategoryComponent} from './views/Category/category.component';
import {CategoryPincodeComponent} from './views/Category/categorypincode.component';
import {ProCategoryComponent} from './views/Category/proCategory.component';
import {ProManageComponent} from './views/Category/proManage.component';
import {CmanageComponent} from './views/Category/manage.component';
import {CimportComponent} from './views/Category/cimport.component';

// Merchant
import {NewmerchantComponent} from './views/Merchant/newmerchant.component';
import {MerchantsearchComponent} from './views/Merchant/merchantsearch.component';
import {PendingmerchantComponent} from './views/Merchant/pendingmerchant.component';
import {MerchantexportComponent} from './views/Merchant/merchantexport.component';
import {MerchantimportComponent} from './views/Merchant/merchantimport.component';
import {ManagemerchantComponent} from './views/Merchant/managemerchant.component';
import {MerchantOrderComponent} from './views/Merchant/merchantOrder.component';
import {OrderviewComponent} from './views/Merchant/orderview.component';
// SystemSettings
import {UserAddComponent} from './views/SystemSetting/userAdd.component';
import {UserEditComponent} from './views/SystemSetting/userEdit.component';
import {UserListComponent} from './views/SystemSetting/userList.component';
import {RightmanagementComponent} from './views/SystemSetting/rightmanagement.component';
// product
import {ManageComponent} from './views/Product/manage.component';
import {AddComponent} from './views/Product/add.component';
import {PlistComponent} from './views/Product/plist.component';
import {PimportComponent} from './views/Product/pimport.component';
import {PexportComponent} from './views/Product/pexport.component';
import {PgrouplistComponent} from './views/Product/pgrouplist.component';
import {PricechangeComponent} from './views/Product/pricechange.component';
import {ReqnewproductComponent} from './views/Product/reqnewproduct.component';
import {AddgroupComponent} from './views/Product/addgroup.component';
import {CompanyComponent} from './views/Product/company.component';

// Cusomer
import {CustomerListComponent} from "./views/CustomerList/customerList.component";
import {CustomerOrderComponent} from './views/CustomerList/customerOrder.component';
import {CreatePaymentOptionComponent} from "./views/PaymentOption/createPaymentOption.component";
import {AddTutorialComponent} from "./views/VideoTutorials/addTutorial.component";
import {SubscriptionListComponent} from "./views/Subscription/subscriptionList.component";
import {SubscriptionManagementComponent} from "./views/Subscription/subscriptionManagement.component";
import {SendNotificationComponent} from "./views/SystemSetting/sendNotification.component";
import {HomeScreenSliderComponent} from "./views/Home Screen Slider/homeScreenSlider.component";
import {VouchermanagementComponent} from "./views/Voucher/vouchermanagement.component";
import {VoucherReedemComponent} from "./views/Voucher/voucherReedem.component";
import {SmsComponent} from "./views/SystemSetting/sms.component";
import {SmtpComponent} from "./views/SystemSetting/smtp.component";
import {VirtualStoreComponent} from "./views/Virtual Store/virtualStore.component";
import {StoreListComponent} from "./views/Virtual Store/storeList.component";
import {ManageStoreComponent} from "./views/Virtual Store/manageStore.component";
import {ViewStoreComponent} from "./views/Virtual Store/viewStore.component";
import {PolicyMasterComponent} from './views/Policy Master/policyMaster.component';
import {AddHSNComponent} from './views/HSNMaster/addHSN.component';
import {ImportHSNComponent} from './views/HSNMaster/importHSN.component';

export const ROUTES: Routes = [
  // Main redirect
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  // App views
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'starterview', component: StarterViewComponent, canActivate: [ AuthGuard ]}
    ]
  },
  {
    path: 'voucher', component: BasicLayoutComponent,
    children: [
      {path: 'manage' , component: VouchermanagementComponent},
      {path: 'reedem' , component: VoucherReedemComponent},
    ]
  },
  // Handle all other routes
  {path: '**',  redirectTo: 'starterview'}
];
