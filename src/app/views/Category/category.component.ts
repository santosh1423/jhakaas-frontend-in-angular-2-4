import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {CategoryServices} from '../../Shared/services/category.services';
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
  templateUrl: 'category.template.html',
  styleUrls: ['category.component.css'],
  providers: [CategoryServices, MerchantServices, HttpClient, AuthenticationService]
})
export class CategoryComponent implements OnInit, AfterViewInit {
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
  public date: Date;
  public catObj: any;
  public tmpexampleData1: Array<any> = [];
  public chain: any;
  public loadingtext = 'Please Wait.... Uploading Image!';
  public showCatIcon = true;

  constructor(private _categoryService: CategoryServices,
              private toastr: ToastrService, private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }

  ngOnInit(): void {
    var eid = this.getUser();
    this.dtOptions = {
      dom: 'lfrtip'
    };
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
    this.getCategoryDetails();
    this.categoryName();
    this.allCategory();
    // this.manageseq();

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getCategoryDetails() {
    const that = this;
    this._categoryService.getParentCat().subscribe(
      res => {
        this.categoryObj = res;
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

            if (this.categoryObj[i].name !== undefined) {
              // console.log(this.categoryObj[i].name);
              this._categoryService.getSubCategory(this.categoryObj[i].name)
                .subscribe(
                  chainObj => {
                    // console.log(chainObj);
                    var subCat = [];
                    if (chainObj.length !== 0) {
                      for (let j = 0; j < chainObj.length; j++) {
                          subCat.push(chainObj[j].name);
                          if (j === chainObj.length - 1) {
                            this.categoryObj[i].subCat = subCat;
                          }
                      }
                    }

                    // console.log(this.chain);
                  });
            }
            if (i === this.categoryObj.length - 1) {
              console.log(this.categoryObj);
            }

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


  getUser() {
    return sessionStorage.getItem('_id');

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  download() {
    var json2csv = require('json2csv');
    // const fields = ['_id', 'code', 'name', 'parentCategory', 'status'];
    const fields = ['_id', 'code', 'name',  'status'];
    // const fieldsName = ['id', 'Code', 'Category Name', 'ParentCategory', 'Status'];
    const fieldsName = ['id', 'Code', 'Category Name', 'Status'];
    json2csv({data: this.categoryObj, fields: fields, fieldNames: fieldsName}, function (err, csv) {
      if (err) {

      }
      if (csv !== undefined) {
        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL = window.URL.createObjectURL(csvData);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'MerchantCategoryDetails.csv');
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

  addCatModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }


   // getCategoryDetails() {
   //
   // }

  getCategoryById(params: String, Updatetemplate: TemplateRef<any>) {
    this.modalUpdate = this.modalService.show(Updatetemplate);
    this._id = params;

    this._categoryService.getCategoryByID(this._id)
      .then(
        (categoryData => {
          if (categoryData !== null) {
            this.categoryIdObj = categoryData;
            console.log(this.categoryIdObj);

            var awsConfig = new AWS.Config({
              accessKeyId: environment.awsAccessKey,
              secretAccessKey: environment.awsSecretKey,
              region: environment.awsRegion,
            });
            const s3 = new AWS.S3(awsConfig);
              const urlParams = {
                Bucket: 'jhakaas-docs',
                Key: this.categoryIdObj.icon
              };
              new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', urlParams, (err, url) => {
                  this.url = url;
                  this.categoryIdObj.url = this.url;
                  if (err) reject(err)
                  else resolve(url);
                });
              });

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

  categoryName() {
    this._categoryService.getParentCategoryName()
      .subscribe(
        categoryObj => {
          this.categoryNameObj = categoryObj;
          // console.log(this.categoryNameObj);
          for (let i = 0; i < this.categoryNameObj.length; i++) {
            this.tmpexampleData.push({'id': this.categoryNameObj[i].name, 'text': this.categoryNameObj[i].name});
          }
          this.categoryNameObj = this.tmpexampleData;
        });
  }


  allCategory() {
    this._categoryService.getCategoryName()
      .subscribe(
        categoryObj => {
          this.catObj = categoryObj;
          for (let i = 0; i < this.catObj.length; i++) {
            this.tmpexampleData1.push({'id': this.catObj[i]._id, 'text': this.catObj[i].name});
          }
          this.catObj = this.tmpexampleData1;
        });
  }


  public refreshValue1(value: any): void {
    this.parentCategory1 = value.text;
  }

  public refreshValue2(value: any): void {
    this.parentCategory2 = value.text;
  }

  // Adding Category

  addCategory(value: any) {
    var that = this;
    value.parentCategory = this.parentCategory1;

    if (this.docImg !== undefined) {
      value.icon = this.docImg;
    } else {
      value.icon = 'category/merchant/icon/logo.png';
    }


    this._categoryService.getMerIndex()
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
                    this.getCategoryDetails();
                    this.toastr.success('Category added successfully!', 'Success');
                  }
                });
          }
        }
      );

    this.modalAdd.hide();
  }

  manageSeqCategory(value: any) {
    for (let i = 0; i < value.length; i++) {
      this._categoryService.updateCategoryIndex(value[i]._id, i + 1)
        .subscribe(
          data => {
            if (data.length !== 0) {
              if (i === value.length - 1) {
                this.modalManage.hide();
                this.toastr.success('Category Sequence Update successfully!', 'Success');
                // this.rerender();
                this.getCategoryDetails();

              }
            }
          }
        );
    }

  }

  removeIcon() {
    console.log('sdf');
    this.editdocImg = 'category/merchant/icon/logo.png';
    this.showCatIcon = false;
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
    s3.upload({Bucket: 'jhakaas-docs', Key: 'category/merchant/icon/' + this.file.name, Body: this.file}, (err, data) => {

      this.docImg = data.Key;
      if (this.docImg !== null) {
        this.spinner.hide();
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.docImg
        };
      }
      // new Promise((resolve, reject) => {
      //   s3.getSignedUrl('getObject', urlParams, (err2, url) => {
      //     this.url = url;
      //     if (err2) reject(err)
      //     else resolve(url);
      //   });
      // });
      // }
    });
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
    s3.upload({Bucket: 'jhakaas-docs', Key: 'category/merchant/icon/' + this.editfile.name, Body: this.editfile}, (err, data) => {
      this.editdocImg = data.Key;
      console.log(this.editdocImg);
      if (this.editdocImg !== null) {
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
      },
      function (dismiss) {
      }
    );
  }

  manageseq(template: TemplateRef<any>) {
    this.modalManage = this.modalService.show(template);
    this._categoryService.getParentCat().subscribe(
      res => {
        this.categoryPCObj = res;
        // console.log(this.categoryPCObj);
        if (this.categoryPCObj !== null) {
          var awsConfig = new AWS.Config({
            accessKeyId: environment.awsAccessKey,
            secretAccessKey: environment.awsSecretKey,
            region: environment.awsRegion,
          });
          const s3 = new AWS.S3(awsConfig);
          for (let i = 0; i < this.categoryPCObj.length; i++) {
            const urlParams = {
              Bucket: 'jhakaas-docs',
              Key: this.categoryPCObj[i].icon
            };
            new Promise((resolve, reject) => {
              s3.getSignedUrl('getObject', urlParams, (err, url) => {
                this.url = url;
                this.categoryPCObj[i].url = this.url;
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


updateCategory(value: Category) {
  if (this.parentCategory2 !== undefined) {
    value.parentCategory = this.parentCategory2;
  }
  value.icon = this.editdocImg;
  const putdata = JSON.stringify(value);
  this._categoryService.updateCategory(this._id, putdata)
    .subscribe(
      data => {
        if (data.length !== 0) {
          this.toastr.success('Category Update successfully!', 'Success');
          this.rerender();
          this.getCategoryDetails();
          this.showCatIcon = true;
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
      that._categoryService.updatestatus(param, param2).subscribe(
        data => {
          if (data !== undefined) {
            // that.rerender();
            that.getCategoryDetails();

          }
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
