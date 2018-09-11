import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import {SelectModule} from 'ng2-select';
import {SubscriptionListComponent} from "./subscriptionList.component";
import {SubscriptionManagementComponent} from "./subscriptionManagement.component";
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import {DataTablesModule} from 'angular-datatables';
import { AlertModule } from 'ngx-bootstrap';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    SubscriptionListComponent,
    SubscriptionManagementComponent
  ],
  imports: [
    BrowserModule,
    SortableModule,
    BsDatepickerModule,
    RouterModule,
    PeityModule,
    AlertModule,
    SparklineModule,
    IboxtoolsModule,
    SelectModule,
    FormsModule,
    DataTablesModule,
    TabsModule,
  ],
  exports: [

  ],
})

export class SubscriptionModule {
}
