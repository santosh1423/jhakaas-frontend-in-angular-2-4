import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CategoryServices} from '../../Shared/services/category.services';
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
import { NgxSpinnerService } from 'ngx-spinner';

var Hashids = require('hashids');


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

class Category {
  _id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  type: string;
  attribute: {
    attName: string,
    attType: string,
    mandatory: boolean
  };
  index: number;
  status: string;
  parentCategory: string;
  hsnCode: string;
}

@Component({
  selector: 'category',
  templateUrl: 'proCategory.template.html',
  styleUrls: ['category.component.css'],
  providers: [CategoryServices, MerchantServices , HttpClient, AuthenticationService]
})

export class ProCategoryComponent  implements OnInit, AfterViewInit {
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
  public categoryObj: any;
  public categoryNameObj: any;
  public categoryPCObj: any;
  public categoryIdObj: any;
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
  public parentCategory1: any;
  public parentCategory2: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  value: any;
  public index = 0;
  public parentcategoryNameObj: any;
  public chain: any;
  public loadingtext = 'Please Wait.... Uploading Image!';
  constructor(private _categoryService: CategoryServices,
              private toastr: ToastrService, private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private spinner: NgxSpinnerService,
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
                if (this.empRights[i].name === 'Category') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    // this.getCategoryDetails();
    this.categoryName();
    this.ParentcategoryName();
    const that = this;
    this.getCategoryDetails();
    // this.dtOptions = {
    //   pageLength: 10,
    //   // dom: 'l<"pull-right"B>frtip',
    //   dom: 'lfrtip',
    //   serverSide: true,
    //   processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     that.http
    //       .post<DataTablesResponse>(
    //         environment.apiUrl + 'category/product',
    //         dataTablesParameters, {
    //           headers: this.headers
    //         }
    //       ).subscribe(resp => {
    //       that.categoryObj = resp.data;
    //       // console.log(that.categoryObj);
    //       if (that.categoryObj.icon !== null) {
    //         var awsConfig = new AWS.Config({
    //           accessKeyId: environment.awsAccessKey,
    //           secretAccessKey: environment.awsSecretKey,
    //           region: environment.awsRegion,
    //         });
    //         const s3 = new AWS.S3(awsConfig);
    //         for (let i = 0; i < that.categoryObj.length; i++) {
    //           const urlParams = {
    //             Bucket: 'jhakaas-docs',
    //             Key: that.categoryObj[i].icon
    //           };
    //           new Promise((resolve, reject) => {
    //             s3.getSignedUrl('getObject', urlParams, (err, url) => {
    //               that.url = url;
    //               that.categoryObj[i].url = that.url;
    //               if (err) reject(err)
    //               else resolve(url);
    //             });
    //           });
    //         }
    //       }
    //
    //       callback({
    //         recordsTotal: resp.recordsTotal,
    //         recordsFiltered: resp.recordsFiltered,
    //         data: []
    //       });
    //     });
    //   },
    //   columns: [
    //     {data: 'icon'},
    //     {data: 'code'},
    //     {data: 'name'},
    //     {data: 'parentCategory'},
    //     {data: 'status'},
    //     {data: '', orderable: false},
    //     {data: '', orderable: false},
    //     {data: '', orderable: false},
    //     {data: '', orderable: false}]
    // };
  }

  // reload the Data
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // get All parent category

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
    var json2csv = require('json2csv');
    const fields = ['_id', 'code', 'name', 'parentCategory', 'status'];
    const fieldsName = ['id', 'Code', 'Category Name', 'ParentCategory', 'Status'];
    json2csv({data: this.categoryObj, fields: fields, fieldNames: fieldsName}, function (err, csv) {
      if (err) {

      }
      if (csv !== undefined) {
        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL = window.URL.createObjectURL(csvData);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'ProductCategoryDetails.csv');
        tempLink.click();
      }
    });
  }
  getMerchantType(value) {
    // console.log(value);
    // console.log(value.text);
    // console.log(value.id);
    this._merchantService.getChainCategory(value.text)
      .subscribe(
        chainObj => {
          this.chain = chainObj;
          // this.chain.push({name : value.text, id: value.id});
          // console.log(this.chain);
        });
  }
  categoryName() {
    this._categoryService.getProCategoryName()
      .subscribe(
        categoryObj => {
          this.categoryNameObj = categoryObj;
          this.tmpexampleData = [];
          for (let i = 0; i < this.categoryNameObj.length ; i++) {
            this.tmpexampleData.push({'id': this.categoryNameObj[i].name, 'text': this.categoryNameObj[i].name});
          }
          this.categoryNameObj = this.tmpexampleData;
        });
  }
  ParentcategoryName() {

    this._categoryService.getProParentCat()
      .subscribe(
        pcategoryObj => {
          this.parentcategoryNameObj = pcategoryObj;
          this.tmpexampleData = [];
          for (let i = 0; i < this.parentcategoryNameObj.length ; i++) {
            this.tmpexampleData.push({'id': this.parentcategoryNameObj[i].name, 'text': this.parentcategoryNameObj[i].name});
          }
          this.parentcategoryNameObj = this.tmpexampleData;
        });
  }

  public refreshValue1(value: any): void {
    this.parentCategory1 = value.text;
  }

  getCategoryDetails() {
    const that = this;
    this._categoryService.getProParentCat().subscribe(
      res => {
        this.categoryObj = res;
        // console.log(this.categoryObj);
        if (this.categoryObj !== null) {
          var awsConfig = new AWS.Config({
            accessKeyId: environment.awsAccessKey,
            secretAccessKey: environment.awsSecretKey,
            region: environment.awsRegion,
          });
          const s3 = new AWS.S3(awsConfig);
          for (let i = 0; i < this.categoryObj.length; i++) {
            const urlParams = {
              Bucket: 'jhakaas-docs',
              Key: this.categoryObj[i].icon
            };
            new Promise((resolve, reject) => {
              s3.getSignedUrl('getObject', urlParams, (err, url) => {
                this.url = url;
                this.categoryObj[i].url = this.url;
                if (err) reject(err)
                else resolve(url);
              });
            });
          }
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        }
        // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //   // Destroy the table first
        //   dtInstance.destroy();
        //   // Call the dtTrigger to rerender again
        //   this._dtTrigger.next();
        // });

      });

  }

  addCategory(value: any) {
    var that = this;
    value.parentCategory = this.parentCategory1;
    var date = new Date();
    var n = date.getTime();
    var hashids = new Hashids(value.name, 3);
    var a = hashids.encode(n);
    a = a.substr(0, 3).toUpperCase();
    value.code = a;
    value.type = 'Product';
    if (this.docImg !== undefined){
      value.icon = this.docImg;
    } else {
      value.icon = 'category/merchant/icon/logo.png';
    }
    this._categoryService.getProIndex()
      .subscribe(
        index => {
          this.index = 0;
          if (index.length !== 0) {
            this.index = index[0].index;
          }
          if (this.index !== null) {
            this.index = this.index + 1;
            value.index = this.index;
            var date = new Date();
            var n = date.getTime();
            var hashids = new Hashids(value.name, 3);
            var a = hashids.encode(n);
            a = a.substr(0, 3).toUpperCase();
            value.code = a;
            this._categoryService.addCategory(value)
              .subscribe(
                data => {
                  if (data !== undefined) {
                    this.toastr.success('Category added successfully!', 'Success');
                    this.rerender();
                    this.getCategoryDetails();
                  }
                }
              );
          }
        }
      );
      this.modalAdd.hide();


  }
  fileSelect(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    this.spinner.show();
    this.uploadfile();
  }

  uploadfile() {

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'category/product/icon' + this.file.name, Body: this.file},  (err, data) => {
      this.docImg = data.Key;
      if (this.docImg !== null) {
        this.spinner.hide();
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.docImg
        };
      }
    });

  }
  public refreshValue2(value: any): void {
    this.parentCategory2 = value.text;
  }

  manageSeqCategory(value: any) {
    for (let i = 0; i < value.length; i++) {
      this._categoryService.updateCategoryIndex(value[i]._id, i)
        .subscribe(
          data => {
            if (data.length !== 0) {
              this.modalManage.hide();
            }
          }
        );
    }
    this.toastr.success('Product Category Sequence Update successfully!', 'Success');
  }

  updateCategory(value: Category) {
    if (this.parentCategory2 !== undefined) {
      value.parentCategory = this.parentCategory2;
    }
    value.icon = this.editdocImg;
    const putdata = JSON.stringify(value);
    this._categoryService.updateCategory( this._id, putdata)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success('Category Update successfully!', 'Success');
            this.rerender();
            this.getCategoryDetails();
          }

        }
      );
    this.modalUpdate.hide();
  }
  editfileSelect(evt) {
    this.editfiles = evt.target.files;
    this.editfile = this.editfiles[0];
    this.spinner.show();
    this.edituploadfile();
  }

  edituploadfile() {

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'category/product/icon' + this.editfile.name, Body: this.editfile},  (err, data) => {

      this.editdocImg = data.Key;
      if (this.editdocImg !== undefined) {
        this.spinner.hide();
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.editdocImg
        };

        new Promise((resolve, reject) => {
          s3.getSignedUrl('getObject', urlParams, (err2, url) => {
            this.editurl = url;
            if (err2) reject(err)
            else resolve(url);
          });
        });
      }
    });
  }
  addCatModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  manageseq(template: TemplateRef<any>) {
    this.modalManage = this.modalService.show(template);
    this._categoryService.getProParentCat().subscribe(
      res => this.categoryPCObj = res);
  }
  getCategoryById(params: String, Updatetemplate: TemplateRef<any>) {
    this.modalUpdate = this.modalService.show(Updatetemplate);

    this._id = params;

    this._categoryService.getCategoryByID(this._id)
      .then(
        (categoryData => {
          if (categoryData !== null) {
            this.categoryIdObj = categoryData;
            this.createdAt = moment(this.categoryIdObj.createdAt).format('MMMM Do YYYY, h:mm:ss a');
            this.updatedAt = moment(this.categoryIdObj.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
            this.parent.push({'id': this.categoryIdObj.parentCategory, 'text': this.categoryIdObj.parentCategory});
            this.parentCat = this.parent[0];
            if (this.parent.length > 0) {
              this.parent.pop();
            }
          }
        })
      )
      .catch(error => console.log(error));
  }
  refresh() {
    const a = this;
    swal({
      title: 'Proccesing!',
      text: 'Please Wait...',
      timer: 1000,
      onOpen: function () {
        swal.showLoading();
      }
    }).then(
      function () {
        a.rerender();
        a.getCategoryDetails();
      },
      function (dismiss) {
      }
    );
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
      that._categoryService.updatestatus(param, param2).subscribe(
          data => {
            // get.getCategoryDetails();
            that.rerender();
            that.getCategoryDetails();

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
