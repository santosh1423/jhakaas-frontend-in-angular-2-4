import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import { TabsModule } from 'ngx-bootstrap';
import {SelectModule} from 'ng2-select';
import {RlTagInputModule} from 'angular2-tag-autocomplete';
import {CategoryCapitalizeDirective} from '../../Shared/directives/CategoryCapitalize.directive';
import {CategoryComponent} from './category.component';
import {CategoryPincodeComponent} from './categorypincode.component';
import {CmanageComponent} from './manage.component';
import {ProCategoryComponent } from './proCategory.component';
import {ProManageComponent} from './proManage.component';
import {CimportComponent} from './cimport.component';
import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import {DataTablesModule} from 'angular-datatables';
import { AlertModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    CategoryComponent,
    CategoryPincodeComponent,
    CmanageComponent,
    ProCategoryComponent,
    ProManageComponent,
    CimportComponent,
    CategoryCapitalizeDirective
  ],
  imports: [
    NgxSpinnerModule,
    RlTagInputModule,
    AlertModule.forRoot(),
    BrowserModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    SelectModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    DndModule.forRoot(),
    TabsModule.forRoot()
  ],
  exports: [
    CategoryComponent,
    CategoryPincodeComponent,
    CmanageComponent,
    CimportComponent,
  ],
})

export class CategoryModule {
}

