import {Component, TemplateRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
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
  selector: 'company',
  templateUrl: 'company.template.html',
  styleUrls: ['product.component.css'],
  providers: [ProductService, MerchantServices, AuthenticationService]
})
export class CompanyComponent implements OnInit , AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  headers = new HttpHeaders();
  model: any = {};
  private _id: String;
  public modalAdd: BsModalRef;
  public tmpexampleData: Array<any> = [];
  public modalUpdate: BsModalRef;
  public modalManage: BsModalRef;
  public companyObj: any;
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
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'ProductCompany') {
                  this.view = this.empRights[i].view;
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
            environment.apiUrl + 'company/datatable',
            dataTablesParameters, {
              headers: this.headers
            }
          ).subscribe(resp => {
          that.companyObj = resp.data;
          // console.log(that.companyObj);
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'name'},
        // {data: 'createdBy'},
        {data: 'createdAt'},
        {data: 'updatedAt'},
        {data: 'status'},
        {data: '', orderable: false},
        {data: '', orderable: false},
        {data: '', orderable: false}]
    };
  }

  // reload the Data
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // rerender Table
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  download() {
    // if (this.companyObj.length > 0) {
    //   for (let i = 0; i < this.companyObj.length; i++) {
    //     this.companyObj[i].updatedAt = moment(this.companyObj.updatedAt).utc(this.companyObj.updatedAt).format('llll');
    //     this.companyObj[i].updatedAt = moment(this.companyObj.updatedAt).format('DD/MM/YYYY');
    //     this.companyObj[i].createdAt = moment(this.companyObj.createdAt).utc(this.companyObj.createdAt).format('llll');
    //     this.companyObj[i].createdAt = moment(this.companyObj.createdAt).format('DD/MM/YYYY');
    //   }
    // }
    var json2csv = require('json2csv');
    const fields = ['_id', 'name', 'status', 'createdAt', 'updatedAt'];
    const fieldsName = ['id', 'Company Name', 'Status', 'CreatedAt', 'UpdatedAt'];
    json2csv({data: this.companyObj, fields: fields, fieldNames: fieldsName}, function (err, csv) {
      if (err) {

      }
      if (csv !== undefined) {
        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL = window.URL.createObjectURL(csvData);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'CompanyDetails.csv');
        tempLink.click();
      }
    });
  }
  addCompModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }

  getCompanyById(params: String, Updatetemplate: TemplateRef<any>) {
    this.modalUpdate = this.modalService.show(Updatetemplate);
    this._id = params;

    this._productService.getCompanyByID(this._id)
      .then(
        (companyData => {
          if (companyData !== null) {
            this.companyIdObj = companyData;
            this.companyIdObj.createdAt = moment(this.companyIdObj.createdAt).utc(this.companyIdObj.createdAt).format('MMMM Do YYYY, h:mm:ss a');
            this.companyIdObj.updatedAt = moment(this.companyIdObj.updatedAt).utc(this.companyIdObj.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
          }
        })
      )
      .catch(error => console.log(error));
  }

  addCompany(value: any) {
      value.createBy = this.empId;
      value.updateBy = this.empId;
      // console.log(value);
      this._productService.addCompany(value)
        .subscribe(
          data => {
            if (data !== undefined) {
              this.toastr.success('Company added successfully!', 'Success');
              this.rerender();
            }
          }
        );
      this.modalAdd.hide();
  }

  deleteCompanyById(params: String) {
    this._id = params;
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    })
      .then((Delete) => {
        if (Delete) {
          swal(
            'Deleted!',
            'Your Record has been Deleted.',
            'success'
          );
          this._productService.companyDelete(this._id).subscribe();
          this.rerender();
        } else {
          swal('Your record is safe!');
        }
      });
  }

  updateCompany(value: any) {
    value.icon = this.editdocImg;
    value.updateBy = this.empId;
    const putdata = JSON.stringify(value);
    this._productService.updateCompany( this._id, putdata)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success('Company Update successfully!', 'Success');
            this.rerender();
          }

        }
      );
    this.modalUpdate.hide();
  }



  statuschange(param: any, param2: any) {
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'To change the status!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then(function () {
        that._productService.updatestatus(param, param2).subscribe(
          data => {
            that.rerender();
          }
        );
        swal(
          'Updated!',
          'Your status has been updated.',
          'success'
        );
      }
    );
  }

}
