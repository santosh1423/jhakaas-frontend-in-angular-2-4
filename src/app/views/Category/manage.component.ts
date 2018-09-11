import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CategoryServices} from '../../Shared/services/category.services';
import {ActivatedRoute} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {Category} from '../../Shared/model/category';
import {ToastrService} from 'ngx-toastr';
import 'rxjs/Rx';
import swal from 'sweetalert2';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';
import {MerchantServices} from '../../Shared/services/merchant.services';

var Hashids = require('hashids');


@Component({
  selector: 'manage',
  templateUrl: 'manage.template.html',
  styleUrls: ['category.component.css'],
  providers: [CategoryServices, MerchantServices]
})
export class CmanageComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  @ViewChild('subCategoryAdd')
  subCategoryAdd: any;

  public editdocImg: any;
  public editurl: any;
  public editfiles: any;
  public editfile: any;
  public categoryIdObj: any;
  public categoryObj: any;
  public sub: any;
  public _id: String;
  public modalUpdate: BsModalRef;
  public categoryNameObj: any;
  public subcategoryNameObj: any;
  public catseq: any;
  public dtOptions: any;
  public files: any;
  public file: any;
  public docImg: any;
  public url: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  public title: any;
  public index = 0;
  public page: any;
  public subCatDiv = false;
  public minus = false;
  public plus =  true;
  public viewP = false;
  public viewM = false;
  public chain: any;
  public modalManage: BsModalRef;
  public categoryPCObj: any;
  get dtTrigger(): any {
    return this._dtTrigger;
  }

  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }

  value: any;
  _dtTrigger: any = new Subject();

  constructor(private _categoryService: CategoryServices, private route: ActivatedRoute,
              private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private toastr: ToastrService) {

  }

  ngOnInit() {
    var noPreviewKey = 'category/merchant/icon/logo.png';
    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this.page = params['manage'];
      // console.log(this.page);
      // console.log(this.page);
      if (this.page === 'Product') {
        this.viewP = true;
      }
      if (this.page === 'Merchant') {
        this.viewM = true;
      }
    });
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
    this.getSubCategory();
    this.dtOptions = {
      // ajax: 'data/data.json',
      // dom: 'lfrtip',
      // dom: 'l<"pull-right"B>frtip',
      dom: 'lfrtip',
      processing: true,
      // Configure the buttonslfrtiplfrtip
      buttons: [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  addsubCategoryDiv() {
      this.subCatDiv = true;
      this.minus = true;
      this.plus = false;
  }

  removesubCategoryDiv() {
    this.subCatDiv = false;
    this.plus = true;
    this.minus = false;
  }

  fileSelect(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    this.uploadfile();
  }


  uploadfile() {

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'category/' + this.file.name, Body: this.file}, (err, data) => {

      this.docImg = data.Key;
      // console.log(this.docImg);
      if (this.docImg !== null) {
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.docImg
        };

        new Promise((resolve, reject) => {
          s3.getSignedUrl('getObject', urlParams, (err2, url) => {
            this.url = url;
            if (err2) reject(err)
            else resolve(url);
          });
        });
      }
    });
  }

  editfileSelect(evt) {
    this.editfiles = evt.target.files;
    this.editfile = this.editfiles[0];
    this.edituploadfile();
  }

  edituploadfile() {

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'category/icon/' + this.editfile.name, Body: this.editfile}, (err, data) => {
      // console.log(this.docImg);
      this.editdocImg = data.Key;
      // console.log(this.editdocImg);
      if (this.editdocImg !== null) {
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

  add_Subcategory(value: any) {
    value.createBy = this.empId;
    value.updateBy = this.empId;
    // console.log(this.docImg);
    if (this.docImg !== undefined) {
      value.icon = this.docImg;
    } else {
      value.icon = 'category/merchant/icon/logo.png';
    }
    var date = new Date();
    var n = date.getTime();
    var hashids = new Hashids(value.name, 3);
    var a = hashids.encode(n);
    a = a.substr(0, 3).toUpperCase();
    value.code = a;
    if (value.type === 'Merchant') {
      this._categoryService.getMerIndex()
        .subscribe(
          index => {
            this.index = 0;
            if (index.length !== 0) {
              this.index = index[0].index;
            }
            if (this.index !== undefined) {
              this.index = this.index + 1;
              value.index = this.index;
              // console.log(value);
              this._categoryService.addSubCategory(value)
                .subscribe(
                  (categoryData => {
                    if (categoryData !== null) {
                      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                        // Destroy the table first
                        dtInstance.destroy();
                        // Call the dtTrigger to rerender again
                        this._dtTrigger.next();
                      });
                      this.getSubCategory();
                      this.subCategoryAdd.reset();
                      this.toastr.success('Sub-Category added successfully!', 'Success');
                      this.docImg = undefined;
                    }
                  })
                );
            }
          }
        );
    } else {
      this._categoryService.getProIndex()
        .subscribe(
          index => {
            this.index = 0;
            this.index = index[0].index;
            if (this.index !== undefined && this.index !== 0) {
              this.index = this.index + 1;
              value.index = this.index;
              this._categoryService.addSubCategory(value)
                .subscribe(
                  (categoryData => {
                    if (categoryData !== null) {
                      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                        // Destroy the table first
                        dtInstance.destroy();
                        // Call the dtTrigger to rerender again
                        this._dtTrigger.next();
                      });
                      this.getSubCategory();
                      this.toastr.success('Sub-Category added successfully!', 'Success');
                      this.subCategoryAdd.reset();
                      this.docImg = undefined;
                    }
                  })
                );
            }
          }
        );
    }
  }

  getCategoryById(params: String, Updatetemplate: TemplateRef<any>) {
    this.modalUpdate = this.modalService.show(Updatetemplate);
    this._id = params;
    this._categoryService.getCategoryByID(this._id)
      .then(
        (categoryData => {
          if (categoryData !== null) {
            this.categoryIdObj = categoryData;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this._dtTrigger.next();
            });

          }
        })
      )
      .catch(error => console.log(error));
  }

  updateCategory(value: Category) {
    // value.updateBy = this.empId;
    if(this.editdocImg !== undefined) {
      value.icon = this.editdocImg;
    }
    const putdata = JSON.stringify(value);
    this._categoryService.updateCategory(this._id, putdata)
      .subscribe(
        data => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
          this.getSubCategory();
        }
      );
    this.modalUpdate.hide();
  }
  manageseq(template: TemplateRef<any>) {
    this.modalManage = this.modalService.show(template);
  }

  getSubCategory() {
    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this._categoryService.getCategoryByID(this._id)
        .then(
          (categoryData => {
            if (categoryData !== null) {
              this.categoryObj = categoryData;
              this.title = this.categoryObj.name;
              // console.log(this.categoryObj.name);
              this._categoryService.getCategoryBySub(this.categoryObj.name, this.page)
                .then(
                  (subCategoryData => {
                    if (subCategoryData !== null) {
                      this.subcategoryNameObj = subCategoryData;
                      if (this.subcategoryNameObj.length > 0) {
                        this._merchantService.getChainCategory(this.categoryObj.name)
                          .subscribe(
                            chainObj => {
                              this.chain = chainObj;
                              // console.log(this.chain);
                            });
                      } else {
                        this._merchantService.getChainCategory(this.categoryObj.name)
                          .subscribe(
                            chainObj => {
                              this.chain = chainObj;
                              // this.chain.push({id: this.categoryObj._id, name: this.categoryObj.name});
                              // console.log(this.categoryObj.name);
                            });
                      }
                      this.catseq = subCategoryData;
                      for (let i = 0; i < this.subcategoryNameObj.length; i++) {
                        var awsConfig = new AWS.Config({
                          accessKeyId: environment.awsAccessKey,
                          secretAccessKey: environment.awsSecretKey,
                          region: environment.awsRegion,
                        });
                        const s3 = new AWS.S3(awsConfig);
                        const urlParams = {
                          Bucket: 'jhakaas-docs',
                          Key: this.subcategoryNameObj[i].icon
                        };
                        new Promise((resolve, reject) => {
                          s3.getSignedUrl('getObject', urlParams, (err, url) => {
                            this.url = url;
                            this.subcategoryNameObj[i].url = this.url;
                            this.catseq[i].url = this.url;
                            if (err) reject(err)
                            else resolve(url);
                          });
                        });
                      }


                      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                        // Destroy the table first
                        dtInstance.destroy();
                        // Call the dtTrigger to rerender again
                        this._dtTrigger.next();
                      });
                    }
                  })
                )
                .catch(error => console.log(error));
            }
          })
        )
        .catch(error => console.log(error));
    });
  }

  statuschange(param: any, param2: any) {
    const get = this;
    swal({
      title: 'Are you sure?',
      text: 'To change the status!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then(function () {
        get._categoryService.updatestatus(param, param2).subscribe(
          data => {
            get.getSubCategory();
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

  UpdateSeq(value) {
    // console.log('s');
    for (let i = 0; i < value.length; i++) {
      this._categoryService.updateCategoryIndex(value[i]._id, i + 1)
        .subscribe(
          data => {
            // console.log(data);
          }
        );
      if (i === value.length) {
        this.modalManage.hide();
        this.toastr.success('Sub-Category Sequence Update successfully!', 'Success');
      }
    }
  }
}
