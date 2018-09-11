import {Component, TemplateRef, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy} from '@angular/core';
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
import * as AWS from 'aws-sdk';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs/Subject';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'viewStore',
  templateUrl: 'viewStore.template.html',
  providers: [MerchantServices, VirtualStoreService]
})
export class ViewStoreComponent implements OnInit , AfterViewInit {
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
  public sub: any;
  public _id: String;
  public procmodal: BsModalRef;
  public proCatObj: Array<any> = [];
  public proCat: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public baseProductId: any;
  public virtualStoreArray: Array<any> = [];
  public allStore: Array<any> = [];

  public allProdByBAseId: any;
  public title: any;
  public limit = 0;
  public allProduct: any;
  public productData: Array<any> = [];
  public prodCount: any;
  public totalCount: any;
  public hideLoadButton = true;
  public merid: any;
  public catID: any;


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private _virtualStoreService: VirtualStoreService,
              private papa: PapaParseService,
              private http: HttpClient,
              private toastr: ToastrService,
              private route: ActivatedRoute,
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
      dom: 'lfrtip',
      // processing: true,
      // Configure the buttons

    };

    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      // console.log(this._id);
      this.limit = 12;
      this.loadData(this.limit);

    });


  }


  getUser() {
    return sessionStorage.getItem('_id');
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
    // this.scroll();
  }

  proShowModal(template: TemplateRef<any>, proid) {
    this.modalAdd = this.modalService.show(template);
  }



  loadMoreData () {
    this.limit = this.limit + 12;
    this.loadData(this.limit);
  }

  productSearch(value) {
    if (value.search !== '') {
      this.hideLoadButton = false;
      // console.log(value.search);
    var data = [];
    data.push({
      'keyword': value.search,
      'catid' : this._id,
      'mid' : this.merid
    });
    // console.log(data);
      // console.log('fghvj');
        this._virtualStoreService.getSearchProd(data[0])
          .subscribe(
            pobj => {
              // console.log('fghvj1');
              // console.log(pobj.products);
              this.allProduct = pobj.products;
              this.prodCount = pobj.products.length;
              var awsConfig = new AWS.Config({
                accessKeyId: environment.awsAccessKey,
                secretAccessKey: environment.awsSecretKey,
                region: environment.awsRegion,
              });
              const s3 = new AWS.S3(awsConfig);
              for (let i = 0; i < this.allProduct.length; i++) {
                if (this.allProduct[i].images.length > 0) {
                  const urlParams = {
                    Bucket: 'jhakaas-docs',
                    Key: this.allProduct[i].images[0].key
                  };
                  new Promise((resolve, reject) => {
                    s3.getSignedUrl('getObject', urlParams, (err, url) => {
                      this.allProduct[i].url = url;
                      if (err) reject(err)
                      else resolve(url);
                    });
                  });


                }
                else if (this.allProduct[i].attributes.length > 0) {
                  if (this.allProduct[i].attributes[0].variation.hasOwnProperty('images')) {
                    const urlParams = {
                      Bucket: 'jhakaas-docs',
                      Key: this.allProduct[i].attributes[0].variation.images
                    };
                    new Promise((resolve, reject) => {
                      s3.getSignedUrl('getObject', urlParams, (err, url) => {
                        this.allProduct[i].url = url;
                        if (err) reject(err)
                        else resolve(url);
                      });
                    });
                  }
                }
                else {
                  const urlParams = {
                    Bucket: 'jhakaas-docs',
                    Key: 'category/No-image-available.jpg'
                  };
                  new Promise((resolve, reject) => {
                    s3.getSignedUrl('getObject', urlParams, (err, url) => {
                      this.allProduct[i].url = url;
                      if (err) reject(err)
                      else resolve(url);
                    });
                  });
                }
              }
            });
    }else if (value.search === '') {
      this.hideLoadButton = true;
      this.loadData(this.limit);
    }

  }

  // scroll (): void {
  //   var that = this;
  //   $(window).scroll(function () {
  //     if ($(window).scrollTop() + $(window).height() === $(document).height()) {
  //       that.loadData();
  //     }
  //   });
  // }

  loadData(limit: number) {
    this._virtualStoreService.getOneMerchant()
      .subscribe(
        res => {
          this.merid = res[0]._id;
          // console.log(this.merid);
          this._virtualStoreService.getStoreById(this._id, limit)
            .subscribe(
              res => {
                this.allProduct = res;
                // console.log(this.allProduct);
                // this.prodCount = this.allProduct.length;
                this.prodCount = res.length;
                this.title = res[0].category_name;


                this._virtualStoreService.getTotalStore(this._id)
                  .subscribe(
                    res1 => {
                      this.totalCount = res1.length;
                      if(this.totalCount < 12) {
                        this.hideLoadButton = false;
                      }
                    });

                if(this.prodCount === this.totalCount){
                  this.hideLoadButton = false;
                }


                var awsConfig = new AWS.Config({
                  accessKeyId: environment.awsAccessKey,
                  secretAccessKey: environment.awsSecretKey,
                  region: environment.awsRegion,
                });
                const s3 = new AWS.S3(awsConfig);
                for (let i = 0; i < this.allProduct.length; i++) {
                  if (this.allProduct[i].images.length > 0) {
                    const urlParams = {
                      Bucket: 'jhakaas-docs',
                      Key: this.allProduct[i].images[0].key
                    };
                    new Promise((resolve, reject) => {
                      s3.getSignedUrl('getObject', urlParams, (err, url) => {
                        this.allProduct[i].url = url;
                        if (err) reject(err)
                        else resolve(url);
                      });
                    });

                  }
                  else if (this.allProduct[i].attributes.length > 0) {
                        if (this.allProduct[i].attributes[0].variation.hasOwnProperty('images')) {
                        const urlParams = {
                          Bucket: 'jhakaas-docs',
                          Key: this.allProduct[i].attributes[0].variation.images
                        };
                        new Promise((resolve, reject) => {
                          s3.getSignedUrl('getObject', urlParams, (err, url) => {
                            this.allProduct[i].url = url;
                            if (err) reject(err)
                            else resolve(url);
                          });
                        });
                    }
                  }
                  else {
                    const urlParams = {
                      Bucket: 'jhakaas-docs',
                      Key: 'category/No-image-available.jpg'
                    };
                    new Promise((resolve, reject) => {
                      s3.getSignedUrl('getObject', urlParams, (err, url) => {
                        this.allProduct[i].url = url;
                        if (err) reject(err)
                        else resolve(url);
                      });
                    });
                  }
                }
              });
        });

  }
}
