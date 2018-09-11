import {Component, TemplateRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import { MerchantServices} from '../../Shared/services/merchant.services';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {ProductService} from '../../Shared/services/product.service';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'plist',
  templateUrl: 'plist.template.html',
  providers: [ProductService, MerchantServices, AuthenticationService]
})
export class PlistComponent implements OnInit{
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  headers = new HttpHeaders();
  model: any = {};
  private _id: String;
  public modalAdd: BsModalRef;
  public tmpexampleData: Array<any> = [];
  public modalUpdate: BsModalRef;
  public modalManage: BsModalRef;
  public productObj: any;
  public companyNameObj: any;
  public companyPCObj: any;
  public companyIdObj: any;
  public icon: string;
  public parent: Array<any> = [];
  public parentCat: Array<any> = [];
  public files: any;
  public file: any;
  public docImg: any;
  public url: any;
  public editdocImg: any;
  public editurl: any;
  public editfiles: any;
  public editfile: any;
  public createdAt: any;
  public updatedAt: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  value: any;

  constructor(private _productService: ProductService,
              private toastr: ToastrService, private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }

  ngOnInit(): void {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          // console.log(res[0]);
          // console.log('fg');
          if (res[0].profile !== undefined) {
            // console.log('fgh');
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'ProductManagement') {
                  this.view = this.empRights[i].view;
                  // console.log(this.view);
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }
          }
        });
    const that = this;
    this.dtOptions = {
      pageLength: 10,
      dom: 'lfrtip',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.apiUrl + 'product/datatable',
            dataTablesParameters, {
              headers: this.headers
            }
          ).subscribe(resp => {
          that.productObj = resp.data;
          // console.log(that.productObj[0].attributes[0].variation);
          for (let i = 0; i < that.productObj.length ; i++) {
            if (that.productObj[i].attributes.length > 0) {
              that.productObj[i].pStatus = that.productObj[i].attributes[0].status;
            } else {
              that.productObj[i].pStatus = 'Active';
            }
            // that.productObj[i].variation = JSON.stringify(that.productObj[i].attributes[0].variation);
            // that.productObj[i].variation = that.productObj[i].variation.replace(/[^a-zA-Z:, ]/g, '');
          }
          // console.log(that.productObj[0].variation);
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'code'},
        {data: 'manufacturer'},
        {data: 'name'},
        {data: 'price'},
        {data: 'unit'},
        {data: 'status'},
        // {data: ''},
        // {data: 'pStatus', orderable: false},
        {data: 'createBy', orderable: true},
        {data: 'updateBy'},
        {data: '', orderable: false},
        {data: '', orderable: false}]
    };
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }


}
