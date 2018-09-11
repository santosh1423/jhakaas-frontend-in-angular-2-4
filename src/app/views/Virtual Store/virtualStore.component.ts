import {Component, TemplateRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {PapaParseService} from 'ngx-papaparse';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VirtualStoreService} from '../../Shared/services/virtualStore.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import { NgxSpinnerService } from 'ngx-spinner';
import {ProductService} from '../../Shared/services/product.service';
import * as AWS from 'aws-sdk';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'virtualStore',
  templateUrl: 'virtualStore.template.html',
  providers: [MerchantServices, VirtualStoreService, ProductService]
})
export class VirtualStoreComponent implements OnInit , AfterViewInit {
  @ViewChild('storeName') storeName: any;
  @ViewChild('procategory') procategory: any;
  @ViewChild('radioVir') radioVir: any;
  @ViewChild('storeCreate') storeCreate: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  headers = new HttpHeaders();
  model: any = {};
  public modalAdd: BsModalRef;
  public csv: any;
  public data: any;
  public productObj: any;
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public impData: any;
  public empId: any;
  public procmodal: BsModalRef;
  public proCatObj: Array<any> = [];
  public proCatObj1: Array<any> = [];
  public proCat: Array<any> = [];
  public proCat1: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public tmpexampleData2: Array<any> = [];
  public baseProductId: any;
  public virtualStoreArray: Array<any> = [];

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  public allProdByBAseId: any;
  public allStore: Array<any> = [];
  public storeID: any;
  public procatId: any;
  public loadingtext = 'Please Wait....';
  public prodById: any;

  constructor(private _merchantService: MerchantServices,
              private _virtualStoreService: VirtualStoreService,
              private _prodService: ProductService,
              private modalService: BsModalService,
              private papa: PapaParseService,
              private http: HttpClient,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }
  ngOnInit(): void {
    this.getCategory();
    this.getProCategory();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'VirtualStore') {
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
      // dom: 'l<"pull-right"B>frtip',
      dom: 'lfrtip',
      // serverSide: true,
      processing: true,
      // ajax: (dataTablesParameters: any, callback) => {
      //   that.http
      //     .post<DataTablesResponse>(
      //       environment.apiUrl + 'product/datatable',
      //       dataTablesParameters, {
      //         headers: this.headers
      //       }
      //     ).subscribe(resp => {
      //     that.productObj = resp.data;
      //     // console.log(that.productObj[0].attributes[0].variation);
      //     for (let i = 0; i < that.productObj.length ; i++) {
      //       that.productObj[i].pStatus = that.productObj[i].attributes[0].status;
      //       that.productObj[i].plus = false;
      //       that.productObj[i].minus = true;
      //       // that.productObj[i].variation = JSON.stringify(that.productObj[i].attributes[0].variation);
      //       // that.productObj[i].variation = that.productObj[i].variation.replace(/[^a-zA-Z:, ]/g, '');
      //     }
      //     // console.log(that.productObj[0].variation);
      //     callback({
      //       recordsTotal: resp.recordsTotal,
      //       recordsFiltered: resp.recordsFiltered,
      //       data: []
      //     });
      //   });
      // },
      // columns: [
      //   {data: 'code'},
      //   {data: 'manufacturer'},
      //   {data: 'name'},
      //   {data: 'price'},
      //   // {data: 'unit'},
      //   {data: 'status'},
      //   // {data: ''},
      //   {data: 'pStatus', orderable: false},
      //   {data: 'createBy'},
      //   {data: 'updateBy'},
      //   {data: '', orderable: false},
      //   // {data: '', orderable: false}
      //   ]
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
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
  getCategory() {
    this._virtualStoreService.getAllCategory()
      .subscribe(
        res => {
          this.proCatObj = res;
          for (let i = 0; i < this.proCatObj.length; i++) {
            this.tmpexampleData1.push({'id': this.proCatObj[i]._id, 'text': this.proCatObj[i].name});
          }
          this.proCat = this.tmpexampleData1;
        });
  }
  getProCategory() {
    this._virtualStoreService.getProCategory()
      .subscribe(
        res => {
          this.proCatObj1 = res;
          for (let i = 0; i < this.proCatObj1.length; i++) {
            this.tmpexampleData2.push({'id': this.proCatObj1[i]._id, 'text': this.proCatObj1[i].name});
          }
          this.proCat1 = this.tmpexampleData2;
          // console.log(this.proCat1);
        });
  }
  selectedCat(value) {
    this.storeID = value.id;
    this._virtualStoreService.getAllVirtualStore()
      .subscribe(
        res => {
          this.allStore = res;
          for (let i = 0; i < this.allStore.length; i++) {
            if (this.allStore[i].name === value.id) {
              swal(
                value.text + ' Already Exist!',
                'Create New Store',
                'error');
              this.storeID = undefined;
              // this.productObj = [];
              this.storeCreate.reset();
              }

          }

        });
  }

  selectedProCat(value) {
    this.spinner.show();
    this.procatId = value.id;
    // console.log(value);
    this._virtualStoreService.getSelectedCatPro(value.id)
      .subscribe(
        res => {
          // console.log(res);
          this.productObj = res;
          this.spinner.hide();
          for (let i = 0; i < this.productObj.length ; i++) {
                    // this.productObj[i].pStatus = this.productObj[i].attributes[0].status;
                    this.productObj[i].plus = false;
                    this.productObj[i].minus = true;
                  // that.productObj[i].variation = JSON.stringify(that.productObj[i].attributes[0].variation);
                  // that.productObj[i].variation = that.productObj[i].variation.replace(/[^a-zA-Z:, ]/g, '');
                }
                this.rerender();
        });
  }
  selectAllPro() {
    if (!this.procategory.valid) {
      this.toastr.error('Product Category Required!', 'Error', {timeOut: 3000,});
    }
    // if (!this.storeName.valid) {
    //   this.toastr.error('Store Name Required!', 'Error', {timeOut: 3000,});
    // }
    this.virtualStoreArray = [];
    if (this.productObj !== undefined) {
      for (let i = 0; i < this.productObj.length; i++) {
        this.productObj[i].plus = true;
        this.productObj[i].minus = false;
        this.virtualStoreArray.push(this.productObj[i]._id);
      }
      // console.log(this.virtualStoreArray);
    }

  }
  addAllPro() {
    if (!this.procategory.valid) {
      this.toastr.error('Product Category Required!', 'Error', {timeOut: 3000,});
    }
    if (!this.storeName.valid) {
      this.toastr.error('Store Name Required!', 'Error', {timeOut: 3000,});
    }
    this.virtualStoreArray = [];
    if (this.productObj !== undefined) {

      const that = this;
      swal({
        title: 'Are you sure?',
        text: 'You want to add all Product !',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
        .then((Delete) => {
          if (Delete) {
            // swal(
            //   'Deleted!',
            //   'Your Record has been Deleted.',
            //   'success'
            // );
            for (let i = 0; i < this.productObj.length; i++) {
              this.productObj[i].plus = true;
              this.productObj[i].minus = false;
              this.virtualStoreArray.push(this.productObj[i]._id);
              if ( i === this.productObj.length - 1) {
                if(this.storeID !== undefined && this.procatId !== undefined && this.virtualStoreArray.length > 0) {
                  var value = [];
                  value.push({
                    'name': this.storeID,
                    'pid': this.procatId,
                    'products': this.virtualStoreArray,
                    'createBy': this.empId,
                    'updateBy': this.empId,
                    'status': 'Active'
                  });

                  this._merchantService.postVirtualStore(value[0])
                    .subscribe(
                      result => {
                        this.toastr.success('Your Store Created Successfully!', 'Good job!');
                        // setTimeout(function () {
                        //   window.location.reload();
                        // }, 2000);
                        this.router.navigate(['virtualstore/list']);
                      });
                }

              }
            }

          } else {
            // swal('Your record is safe!');
          }
        });



      // console.log(this.virtualStoreArray);
    }

  }

  removeAllPro() {
    if (!this.procategory.valid) {
      this.toastr.error('Product Category Required!', 'Error', {timeOut: 3000, } );
    }
    // if (!this.storeName.valid) {
    //   this.toastr.error('Store Name Required!', 'Error', {timeOut: 3000,});
    // }
    if (this.productObj !== undefined) {
      for (let i = 0; i < this.productObj.length; i++) {
        this.productObj[i].plus = false;
        this.productObj[i].minus = true;
        this.virtualStoreArray = [];
      }
      // console.log(this.virtualStoreArray);
    }
  }
  addProd(proid, index) {
    this.productObj[index].plus = true;
    this.productObj[index].minus = false;
    this._virtualStoreService.getBaseProdIdById(proid)
      .subscribe(
        res => {
          this.baseProductId = res.baseProductId;
          this._virtualStoreService.getAllProdByBaseProdId( this.baseProductId)
            .subscribe(
              res1 => {
                this.allProdByBAseId = res1;
                for (let i = 0; i < this.allProdByBAseId.length; i++) {
                  this.virtualStoreArray.push(this.allProdByBAseId[i]._id);
                }
                // console.log(this.virtualStoreArray);
              });
        });
  }

  removeProd(proid, i) {
    this.productObj[i].plus = false;
    this.productObj[i].minus = true;

    this._virtualStoreService.getBaseProdIdById(proid)
      .subscribe(
        res => {
          this.baseProductId = res.baseProductId;
          this._virtualStoreService.getAllProdByBaseProdId( this.baseProductId)
            .subscribe(
              res1 => {
                this.allProdByBAseId = res1;
                for(let i = 0; i < this.allProdByBAseId.length; i++) {
                  for(let j = 0; j < this.virtualStoreArray.length; j++) {
                      if(  this.allProdByBAseId[i]._id === this.virtualStoreArray[j]) {
                        this.virtualStoreArray.splice(j, 1);
                      }
                  }
                }
                // console.log(this.virtualStoreArray);
              });
        });

  }

  showProduct(template: TemplateRef<any>, id, index) {
    this.modalAdd = this.modalService.show(template);

    this._prodService.getProductById(id)
      .subscribe(
        res => {
        this.prodById = res;
          var awsConfig = new AWS.Config({
            accessKeyId: environment.awsAccessKey,
            secretAccessKey: environment.awsSecretKey,
            region: environment.awsRegion,
          });
          const s3 = new AWS.S3(awsConfig);
            if (this.prodById.images.length > 0) {
              const urlParams = {
                Bucket: 'jhakaas-docs',
                Key: this.prodById.images[0].key
              };
              new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', urlParams, (err, url) => {
                  this.prodById.url = url;
                  if (err) reject(err)
                  else resolve(url);
                });
              });

            }
            // else if (this.allProduct[i].hasOwnProperty('attributes')) {
            // if (this.allProduct[i].attributes[0].hasOwnProperty('variation')) {
            //   const urlParams = {
            //     Bucket: 'jhakaas-docs',
            //     Key: this.allProduct[i].attributes[0].variation.images[0].key
            //   };
            //   new Promise((resolve, reject) => {
            //     s3.getSignedUrl('getObject', urlParams, (err, url) => {
            //       this.allProduct[i].url = url;
            //       if (err) reject(err)
            //       else resolve(url);
            //     });
            //   });
            //
            // }
            // if (this.allProduct[i].attributes[0].variation.hasOwnProperty('images')) {
            //   const urlParams = {
            //     Bucket: 'jhakaas-docs',
            //     Key: this.allProduct[i].attributes[0].variation.images[0].key
            //   };
            //   new Promise((resolve, reject) => {
            //     s3.getSignedUrl('getObject', urlParams, (err, url) => {
            //       this.allProduct[i].url = url;
            //       if (err) reject(err)
            //       else resolve(url);
            //     });
            //   });
            //
            // }
            // }
            else {
              const urlParams = {
                Bucket: 'jhakaas-docs',
                Key: 'category/No-image-available.jpg'
              };
              new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', urlParams, (err, url) => {
                  this.prodById.url = url;
                  if (err) reject(err)
                  else resolve(url);
                });
              });
            }

        });
}


  createStore(value) {
    // console.log(value);
    if (value.category.length > 0) {
      value.name = value.category[0].id;
      value.pid = value.procategory[0].id;
      value.products = this.virtualStoreArray;
      value.createBy = this.empId;
      value.updateBy = this.empId;
      value.status = 'Active';
      this._merchantService.postVirtualStore(value)
        .subscribe(
          result => {
              this.toastr.success('Your Store Created Successfully!', 'Good job!');
            // setTimeout(function () {
            //   window.location.reload();
            // }, 2000);
            this.router.navigate(['virtualstore/list']);
          });
    }


  }


}
