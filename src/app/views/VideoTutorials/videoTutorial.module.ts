
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import {SelectModule} from 'ng2-select';
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
import {AddTutorialComponent} from "./addTutorial.component";

@NgModule({
  declarations: [
    AddTutorialComponent
  ],
  imports: [
    BrowserModule,
    SortableModule,
    RouterModule,
    PeityModule,
    AlertModule,
    SparklineModule,
    IboxtoolsModule,
    SelectModule,
    FormsModule,
    DataTablesModule,
    TabsModule,
    FormsModule,
  ],
  exports: [

  ],
})

export class VideoTutorialModule {
}
