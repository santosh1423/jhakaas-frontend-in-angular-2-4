import {AddComponent} from './add.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import {SelectModule} from 'ng2-select';
import { NgxSpinnerModule } from 'ngx-spinner';

import {ManageComponent} from './manage.component';
import {PexportComponent} from './pexport.component';
import {PimportComponent} from './pimport.component';
import {PlistComponent} from './plist.component';
import {AddgroupComponent} from './addgroup.component';
import {PgrouplistComponent} from './pgrouplist.component';
import {PricechangeComponent} from './pricechange.component';
import {ReqnewproductComponent} from './reqnewproduct.component';
import {CompanyComponent} from './company.component';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BsDatepickerModule } from 'ngx-bootstrap';
import {RlTagInputModule} from 'angular2-tag-autocomplete';
import {ColorPickerModule} from 'ngx-color-picker';


import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import {DataTablesModule} from 'angular-datatables';
import { AlertModule } from 'ngx-bootstrap';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import { SortableModule } from 'ngx-bootstrap/sortable';

@NgModule({
  declarations: [
    AddComponent,
    ManageComponent,
    PexportComponent,
    PimportComponent,
    PlistComponent,
    AddgroupComponent,
    PgrouplistComponent,
    PricechangeComponent,
    ReqnewproductComponent,
    CompanyComponent
  ],
  imports: [
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    DndModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserModule,
    SortableModule,
    RouterModule,
    NgxSpinnerModule,
    DndModule.forRoot(),
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    SelectModule,
    FormsModule,
    DataTablesModule,
    TabsModule,
    FormsModule,
    CKEditorModule,
    RlTagInputModule,
    CKEditorModule,
    ColorPickerModule,
    NgxBarcodeModule
  ],
  exports: [
    AddComponent,
    ManageComponent,
    PexportComponent,
    PimportComponent,
    PlistComponent,
    AddgroupComponent,
    PgrouplistComponent,
    PricechangeComponent,
    ReqnewproductComponent,
    CompanyComponent
  ],
})

export class ProductsModule {
}
