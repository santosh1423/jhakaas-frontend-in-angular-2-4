import {Component, TemplateRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {CategoryServices} from '../../Shared/services/category.services';
import {PapaParseService} from 'ngx-papaparse';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VirtualStoreService} from '../../Shared/services/virtualStore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import { NgxSpinnerService } from 'ngx-spinner';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'manageStore',
  templateUrl: 'manageStore.template.html',
  providers: [MerchantServices, VirtualStoreService]
})
export class ManageStoreComponent implements OnInit , AfterViewInit{
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  headers = new HttpHeaders();
  model: any = {};
  public modalAdd: BsModalRef;
  public csv: any;
  public data: any;
  public sub: any;
  public _id: String;
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
  public proCat: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public baseProductId: any;
  public virtualStoreArray: Array<any> = [];
  public allStore: Array<any> = [];
  public allProdByBAseId: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  public activeCat: Array<any> = [];
  public tmpexampleData2: Array<any> = [];
  public proCat1: Array<any> = [];
  public proCatObj1: Array<any> = [];
  public procatName: any;
  public loadingtext = 'Please Wait.... Loading Data!';


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private _virtualStoreService: VirtualStoreService,
              private papa: PapaParseService,
              private http: HttpClient,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }

  ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
          this._id = params['id'];
          this.getCategory();
  });
    const eid = this.getUser();
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

    this.dtOptions = {
      pageLength: 10,
      dom: 'lfrtip',
      // serverSide: true,
      // processing: true,
      // ajax: (dataTablesParameters: any, callback) => {
      //   that.http
      //     .post<DataTablesResponse>(
      //       environment.apiUrl + 'product/datatable',
      //       dataTablesParameters, {
      //         headers: this.headers
      //       }
      //     ).subscribe(resp => {
      //     that.productObj = resp.data;
      //     for (let i = 0; i < that.productObj.length; i++) {
      //       that.productObj[i].minus = true;
      //       that.productObj[i].plus = false;
      //     }
      //     that.sub = that.route.params.subscribe(params => {
      //       that._id = params['id'];
      //       that.getCategory();
      //       that._virtualStoreService.getVirtualStore(that._id)
      //         .subscribe(res => {
      //           that.impData = res;
      //
      //           for (let i = 0; i < that.productObj.length; i++) {
      //             // that.productObj[i].minus = true;
      //             // that.productObj[i].plus = false;
      //             that.productObj[i].pStatus = that.productObj[i].attributes[0].status;
      //             for (let j = 0; j < that.impData.products.length; j++) {
      //               if (that.productObj[i]._id === that.impData.products[j]) {
      //                 that.productObj[i].minus = false;
      //                 that.productObj[i].plus = true;
      //               }
      //             }
      //
      //
      //             // that.productObj[i].variation = JSON.stringify(that.productObj[i].attributes[0].variation);
      //             // that.productObj[i].variation = that.productObj[i].variation.replace(/[^a-zA-Z:, ]/g, '');
      //           }
      //
      //           // console.log(that.impData);
      //           for (let i = 0; i < that.impData.products.length; i++) {
      //             that.virtualStoreArray.push(that.impData.products[i]);
      //           }
      //           that.tmpexampleData1.push({'id': that.impData.name._id, 'text': that.impData.name.name});
      //           that.proCat = that.tmpexampleData1;
      //           // this.proCat = this.impData.name.name;
      //         });
      //     });
      //
      //
      //
      //
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
      //   {data: 'unit'},
      //   {data: 'status'},
      //   // {data: ''},
      //   {data: 'pStatus', orderable: false},
      //   {data: 'createBy'},
      //   {data: 'updateBy'},
      //   {data: '', orderable: false},
      //   // {data: '', orderable: false}
      // ]
    };
    // const that = this;
    this.getStore();

    this.getProCategory();


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
  getStore() {
    this._virtualStoreService.getVirtualStore(this._id)
      .subscribe(res => {
        this.impData = res;
        this.spinner.show();
        // console.log(this.impData);
        this.procatName = this.impData.pid.name;
        this._virtualStoreService.getSelectedCatPro(this.impData.pid._id)
          .subscribe(
            res1 => {
              // console.log(res1);
              this.productObj = res1;
              this.spinner.hide();
              for (let i = 0; i < this.productObj.length ; i++) {
                this.productObj[i].plus = false;
                this.productObj[i].minus = true;
              }
              for (let i = 0; i < this.productObj.length; i++) {
                // that.productObj[i].minus = true;
                // that.productObj[i].plus = false;
                // this.productObj[i].pStatus = this.productObj[i].attributes[0].status;
                for (let j = 0; j < this.impData.products.length; j++) {
                  if (this.productObj[i]._id === this.impData.products[j]) {
                    this.productObj[i].minus = false;
                    this.productObj[i].plus = true;
                  }
                }
              }
              for (let i = 0; i < this.impData.products.length; i++) {
                this.virtualStoreArray.push(this.impData.products[i]);
              }
              this.tmpexampleData1.push({'id': this.impData.pid._id, 'text': this.impData.pid.name});
              this.proCat = this.tmpexampleData1;
              this.rerender();
            });
      });
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  selectedProCat(value) {
    // console.log(value);
    if (value.id !== this.impData.pid._id) {
      // this.procatID = value.id;
      this._virtualStoreService.getSelectedCatPro(value.id)
        .subscribe(
          res => {
            // console.log(res);
            this.productObj = res;
            this.virtualStoreArray = [];
            for (let i = 0; i < this.productObj.length ; i++) {
              // this.productObj[i].pStatus = this.productObj[i].attributes[0].status;
              this.productObj[i].plus = false;
              this.productObj[i].minus = true;
              // that.productObj[i].variation = JSON.stringify(that.productObj[i].attributes[0].variation);
              // that.productObj[i].variation = that.productObj[i].variation.replace(/[^a-zA-Z:, ]/g, '');
            }
            for (let i = 0; i < this.productObj.length; i++) {
              // that.productObj[i].minus = true;
              // that.productObj[i].plus = false;
              // this.productObj[i].pStatus = this.productObj[i].attributes[0].status;
              for (let j = 0; j < this.impData.products.length; j++) {
                if (this.productObj[i]._id === this.impData.products[j]) {
                  this.productObj[i].minus = false;
                  this.productObj[i].plus = true;
                }
              }
            }
            // this.rerender();
          });
    }

  }

  selectAllPro() {
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
        // if (!this.storeName.valid) {
    //   this.toastr.error('Store Name Required!', 'Error', {timeOut: 3000,});
    // }

    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'You want to add all Product !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    })
      .then((Delete) => {
        if (Delete) {
          // swal(
          //   'Deleted!',
          //   'Your Record has been Deleted.',
          //   'success'
          // );
          this.virtualStoreArray = [];
          if (this.productObj !== undefined) {
            for (let i = 0; i < this.productObj.length; i++) {
              this.productObj[i].plus = true;
              this.productObj[i].minus = false;
              this.virtualStoreArray.push(this.productObj[i]._id);
              if ( i === this.productObj.length - 1) {
                this._merchantService.putProductVStore(this._id, this.virtualStoreArray)
                  .subscribe(
                    result => {
                      this.toastr.success('Your Store Updated Successfully!', 'Good job!');
                      this.router.navigate(['virtualstore/list']);
                      // setTimeout(function () {
                      //   window.location.reload();
                      // }, 2000);
                    });
              }
            }
            // console.log(this.virtualStoreArray);
          }

        } else {
          // swal('Your record is safe!');
        }
      });




  }

  removeAllPro() {
    if (this.productObj !== undefined) {
      for (let i = 0; i < this.productObj.length; i++) {
        this.productObj[i].plus = false;
        this.productObj[i].minus = true;
        this.virtualStoreArray = [];
      }
      // console.log(this.virtualStoreArray);
    }
  }

  getProCategory() {
    this.tmpexampleData2 = [];
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
  getCategory() {
    this._virtualStoreService.getActiveCategory(this._id)
      .subscribe(
        res => {
          this.activeCat = res.name.name;
         // console.log(res.name.name);
         //  this.tmpexampleData2.push({'id': 'cat', 'text': 'hch'});
        });

      // this.activeCat = this.tmpexampleData2[0];
    // console.log(this.activeCat);
    // console.log(this.tmpexampleData2);
  }

  addProd(proid, index) {
    this.productObj[index].plus = true;
    this.productObj[index].minus = false;
    this._virtualStoreService.getBaseProdIdById(proid)
      .subscribe(
        res => {
          this.baseProductId = res.baseProductId;
          this._virtualStoreService.getAllProdByBaseProdId(this.baseProductId)
            .subscribe(
              res1 => {
                this.allProdByBAseId = res1;
                for (let i = 0; i < this.allProdByBAseId.length; i++) {
                  this.virtualStoreArray.push(this.allProdByBAseId[i]._id);
                }
              });
        });
  }

  removeProd(proid, index) {
    this.productObj[index].plus = false;
    this.productObj[index].minus = true;

    this._virtualStoreService.getBaseProdIdById(proid)
      .subscribe(
        res => {
          this.baseProductId = res.baseProductId;
          this._virtualStoreService.getAllProdByBaseProdId( this.baseProductId)
            .subscribe(
              res1 => {
                this.allProdByBAseId = res1;
                for (let i = 0; i < this.allProdByBAseId.length; i++) {
                  for (let j = 0; j < this.virtualStoreArray.length; j++) {
                    if (  this.allProdByBAseId[i]._id === this.virtualStoreArray[j]) {
                      this.virtualStoreArray.splice(j, 1);
                    }
                  }
                }
                // console.log(this.virtualStoreArray);
              });
        });

  }

  updateStore() {
    // console.log(this.procatID);
    // if (value.category.length > 0) {
    //   value.name = value.category[0].id;
    //   value.products = this.virtualStoreArray;
    //   value.createBy = this.empId;
    //   value.updateBy = this.empId;
    //   value.status = 'Active';
      this._merchantService.putProductVStore(this._id, this.virtualStoreArray)
        .subscribe(
          result => {
            this.toastr.success('Your Store Updated Successfully!', 'Good job!');
            this.router.navigate(['virtualstore/list']);
            // setTimeout(function () {
            //   window.location.reload();
            // }, 2000);
          });
    // }
  }


}
