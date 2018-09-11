import {Component, TemplateRef, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {CountryService} from '../../Shared/services/country.service';
import {ProductService} from '../../Shared/services/product.service';
import {CategoryServices} from '../../Shared/services/category.services';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { NgxSpinnerService } from 'ngx-spinner';
import {PapaParseService} from 'ngx-papaparse';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';

var _ = require('lodash');
var Hashids = require('hashids');

import 'rxjs/Rx';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'pimport',
  templateUrl: 'pimport.template.html',
  providers: [CountryService, MerchantServices, ProductService, CategoryServices]
})
export class PimportComponent implements OnInit {
  public county = [];
  public state: any;
  public test1: any;
  public test2 = [];
  public test3: any;
  public city: any;
  public count = 0;

  // import
  public modalAdd: BsModalRef;
  public csv: any;
  public data: any;
  public impData: any;
  public procmodal: BsModalRef;
  public procmodal2: BsModalRef;
  public productCode: any;
  public imageData: any;
  public mainImage = [];
  public varImage = [];

  // right management
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  public tempdata = [];
  public tempdata2 = [];
  public varName = [];
  private mainI: any;
  private varfinal: any;
  private final: any;
  private extraI: any;
  public m: any;
  public v: any;
  public success = false;
  public countlength = 0;
  public count1 = 0;
  public xyzaa: any;
  public xyza: any;
  public xyzzzz = true;
  public attName = [];
  public tag = [];
  public loadingtext: any;

  constructor(private toastr: ToastrService,
              private http: Http,
              private sanitizer: DomSanitizer,
              private modalService: BsModalService,
              private papa: PapaParseService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private _countryService: CountryService,
              private _productService: ProductService,
              private _categoryService: CategoryServices,
              private _merchantService: MerchantServices) {
  }

  ngOnInit() {
    var eid = this.getUser();

    // this.imageurl();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'Import') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    // this._countryService.getCountry()
    //   .subscribe(
    //     res => {
    //      // console.log(res);
    //
    //     });

    // this.getJSONC().subscribe(
    //   res => {
    //     // console.log(res);
    //     this.county = res;
    //   });
    // this.getJSONS().subscribe(
    //   res => {
    //     this.state = res;
    //   });
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  // Import Product

  addCatModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }

  public changeListener(template2, files: FileList) {
    this.loadingtext = 'Please Wait.... Rearranging your Data!';
    // this.procmodal2 = this.modalService.show(template2, this.config);
    if (files && files.length > 0) {
      this.spinner.show();
      // setTimeout(() => this.procmodal2.hide(), 5000);
      const file: File = files.item(0);
      this.csv = files[0];
      this.papa.parse(this.csv, {
        header: true,
        skipEmptyLines: true,
        // worker: true,
        complete: (results, file2) => {
          this.impData = results.data;
          // console.log(this.impData);
          var data = [];
          var data2 = [];
          var cat = [];
          var attribute = [];
          var manuF = [];
          var that = this;
          var awsConfig = new AWS.Config({
            accessKeyId: environment.awsAccessKey,
            secretAccessKey: environment.awsSecretKey,
            region: environment.awsRegion,
          });
          const s3 = new AWS.S3(awsConfig);
          var grouppedArray = _.groupBy(this.impData, 'categoryName');
          var key = _.uniq(_.map(this.impData, 'categoryName'));
          data.push(grouppedArray);
          for (let i = 0; i < key.length; i++) {
            data2.push(data[0][key[i]]);
          }

          for (let i = 0; i < data2.length; i++) {
            this.varName = [];
            this.attName = [];
            var aa = [];
            data2[i][0].tags.split(',').forEach(function (item) {
              aa.push(item);
            });
            // console.log(aa);
            if (aa.length !== 0) {
              data2[i][0].tags = aa;
            }

            this._productService.getCategoryByName(data2[i][0].categoryName)
              .then(res1 => {
                var catData = res1[0];
                var exVar = [];
                if (res1.length !== 0) {
                  data2[i][0].categoryId = res1[0]._id;
                  data2[i][0].categoryC = res1[0].code;
                  for (let k = 1; k <= 10; k++) {
                    if (data2[i][0]['variationTypeLabel' + k] !== '') {
                      exVar[k - 1] = data2[i][0]['variationTypeLabel' + k];
                    }
                  }
                  var a = res1[0].attribute;
                  var attName = [];
                  // console.log(a.length);
                  var  doNotMatch = [];
                  for (let j = 0; j < a.length; j++) {
                    attName[j] = a[j].attName;
                    // console.log(a[j].attName);
                  }
                  // console.log(attName);
                  for (let i2 = 0; i2 < exVar.length; i2++) {
                    if (attName.indexOf(exVar[i2]) === -1) {
                      doNotMatch.push(exVar[i2]);
                    }
                  }
                  if ( doNotMatch.length !== 0 ) {
                    for ( let o = 0; o < doNotMatch.length; o++) {
                      var attribute2 = [];
                      attribute2.push({
                        type: 'Variation',
                        attName: doNotMatch[o],
                        attType: 'Alphanumeric',
                        mandatory: false
                      });
                      this._categoryService.addAttr(attribute2[0], res1[0]._id)
                        .subscribe(AttributeData => {
                        });

                    }
                  }
                } else {
                  var hashids = new Hashids(data2[i][0].categoryName, 3);
                  var a2 = hashids.encode(i).toUpperCase();
                  cat.splice(0, cat.length);
                  attribute.splice(0, attribute.length);
                  for (let k = 1; k <= 10; k++) {
                    var exVar2 = data2[i][0]['variationTypeLabel' + k];
                    if (exVar2 !== '') {
                      attribute.push({
                        type: 'Variation',
                        attName: exVar2,
                        attType: 'Alphanumeric',
                        mandatory: false
                      });
                    }
                    if (k === 10) {
                      if (attribute.length !== 0) {
                        // console.log(attribute);
                        cat.push({
                          name: data2[i][0].categoryName,
                          icon: 'category/No-image-available.jpg',
                          type: 'Product',
                          createBy: this.empId,
                          updateBy: this.empId,
                          code: a2,
                          attribute: attribute
                        });
                        if (cat.length !== 0) {
                          this._categoryService.addCategory(cat[0])
                            .subscribe(addCat => {
                              if (addCat.length !== 0) {
                                data2[i][0].categoryId = addCat._id;
                                data2[i][0].categoryC = addCat.code;
                                // cat = [];
                              }
                            });
                        }
                      } else {
                        cat.push({
                          name: data2[i][0].categoryName,
                          icon: 'category/No-image-available.jpg',
                          type: 'Product',
                          createBy: this.empId,
                          updateBy: this.empId,
                          code: a2
                        });
                        if (cat.length !== 0) {
                          this._categoryService.addCategory(cat[0])
                            .subscribe(addCat => {
                              if (addCat.length !== 0) {
                                data2[i][0].categoryId = addCat._id;
                                data2[i][0].categoryC = addCat.code;
                                // cat = [];
                              }
                            });
                        }
                      }
                    }
                  }
                }
              }).then(res3 => {
              if (i === data2.length - 1) {
                this.addManu(data2);
              }
            });
          }
        }
      });
    }
  }

  addManu(data3) {
    // console.log('addMenu');
    var data = [];
    var data2 = [];
    var grouppedArray = _.groupBy(this.impData, 'manufacturer');
    var key = _.uniq(_.map(this.impData, 'manufacturer'));
    data.push(grouppedArray);
    for (let i = 0; i < key.length; i++) {
      data2.push(data[0][key[i]]);
    }
    var manuF = [];
    for (let i = 0; i < data2.length; i++) {
      this._productService.getManufactureByName(data2[i][0].manufacturer)
        .subscribe(Mres1 => {
          if (Mres1.length !== 0) {
            // console.log(Mres1[0]);
            data2[i][0].companyId = Mres1[0].name;
          } else {
            manuF.splice(0, manuF.length);
            if (manuF.length === 0) {
              manuF.push({
                name: data2[i][0].manufacturer,
                createBy: this.empId,
                updateBy: this.empId
              });
              this._productService.addCompany(manuF[0])
                .subscribe(addmanuF => {
                  if (addmanuF.length !== 0) {
                    data2[i][0].companyId = manuF[0].name;
                  }
                });
            }
          }
          if (i === data2.length - 1) {
            if (data3.length !== 0) {
              var a = data3;
              this.reArrangeData(a);
            }

          }
          //   }).then(Mres2 => {
          //   //   console.log('Mres2');
          //   // if (!data2[i][0].hasOwnProperty('companyId')) {
          //   //   this._productService.addCompany(manuF[0])
          //   //     .subscribe(addmanuF => {
          //   //       if (addmanuF.length !== 0) {
          //   //         data2[i][0].companyId = addmanuF._id;
          //   //       }
          //   //     });
          //   // }
          // }).then(Mres3 => {
          //   // console.log('Mres3 + Putting Data');
          //   // for (let p = 0; p < data2[i].length; p++) {
          //   //   data2[i][p].categoryCode = data2[i][0].categoryC;
          //   //   data2[i][p].category = data2[i][0].categoryId;
          //   //   data2[i][p].manufacturer = data2[i][0].companyId;
          //   // }
          //   if (i === data2.length - 1) {
          //     this.reArrangeData(data2);
          //   }
          // });
        });
    }
  }

  reArrangeData(data2: any) {
    // console.log('reArrangeData');
    for (let i = 0; i < data2.length; i++) {
      for (let p = 0; p < data2[i].length; p++) {
        data2[i][p].categoryCode = data2[i][0].categoryC;
        data2[i][p].category = data2[i][0].categoryId;
        data2[i][p].tags = data2[i][0].tags;
        // data2[i][p].manufacturer = data2[i][0].manufacturerName;
      }
      if (i === data2.length - 1) {
        this.addCatComp(data2);
      }
    }

  }

  addCatComp(data2: any) {
    // console.log('addCatComp');
    for (let k = 0; k < data2.length; k++) {
      for (let p = 0; p < data2[k].length; p++) {
        this.tempdata2.push(data2[k][p]);
      }
      if (k === data2.length - 1) {
        this.proData(this.tempdata2);
      }
    }
  }

  proData(data: any) {
    // console.log('proData');
    var data2 = [];
    var data3 = [];
    var grouppedArray = _.groupBy(data, 'parentProductId');
    var key = _.uniq(_.map(data, 'parentProductId'));
    data3.push(grouppedArray);
    for (let i = 0; i < key.length; i++) {
      data2.push(data3[0][key[i]]);
    }
    var array =[];
    // console.log(data2.length)
    for (let i = 0; i < data2.length; i++) {
      // Creating code for generating baseProductId
      var date = new Date();
      var n = date.getTime();

      var s = (Math.random().toString(36).substr(2, 8));
      //array.push(s);
      var hashids = new Hashids(data2[i][0].name);
      var a = hashids.encode(n);
      // var ha3 = new Hashids(a);
      // var ha = ha3.encode(n);
      var addg = s.concat(a);
      var hashids2 = new Hashids(addg, 4);
      var aa = hashids2.encode(i);
      // console.log(aa);
      // console.log(aa.length);
      // console.log(s);
      // var f = addg.substr(6 , 4);
     // array.push(aa);

      // console.log(addg.length);
      for (let j = 0; j < data2[i].length; j++) {
        // console.log(aa);
        this.productCode = data2[i][j].manufacturerCountry;
        this.productCode = this.productCode.concat(data2[i][j].categoryCode);
        this.productCode = this.productCode.concat(aa);
        // console.log(this.productCode.length);
        data2[i][j].baseProductId = this.productCode;
        // console.log(this.productCode);
        // array.push(data2[i][j].baseProductId);
        var s2 = (Math.random().toString(36).substr(2, 8));
        var date1 = new Date();
        var n1 = date1.getTime();
        var hashids3 = new Hashids(data2[i][j].name, 3);
        var aa2 = hashids3.encode(n1);
        var addg1 = s2.concat(aa2);
        var hashids21 = new Hashids(addg1, 3);
        var aa1 = hashids21.encode(j);
        // console.log(s2.length);
        array.push(addg1);
        this.productCode = this.productCode.concat(aa1).toUpperCase();
        // array.push(this.productCode);
        // array.push( this.productCode);

        // console.log(array.length);
        // console.log(this.productCode.length);
        data2[i][j].code = this.productCode;
        // console.log(this.productCode);
        // data2[i][j].manufacturer = data2[i][0].manufacturerName;
        var l = j + 1;
        data2[i][j].varNo = l;

      }
      if (i === data2.length - 1) {
        var a = _.filter(array, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
        // var a =_.uniqBy(array);
        // console.log(a);
        // console.log(a.length);
        this.imageUpload(data2);
      }
    }
  }

  imageUpload(data2: any) {
    for (let i = 0; i < data2.length; i++) {
      var count = 0;
      count = data2[i].length;
      this.count1 = this.count1 + count;
    }

    var that = this;
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);


    for (let i = 0; i < data2.length; i++) {
      this._productService.uploadImage(data2[i][0].baseProductId, data2[i][0].mainImageURL).then(mainres => {
        that.mainImage = [];

        if (mainres !== []) {
          that.m = mainres;
        }
      }).then(res1 => {
        // console.log(that.m);
        that.mainImage = [];
        if (that.m.hasOwnProperty('key')) {
          that.mainImage.push({
            key: that.m.key
          });
        } else {
          that.mainImage.push({
            key: 'category/merchant/icon/no-image-available.png'
          });
        }
      }).then(res11 => {
        setTimeout(3000);

      }).then(res2 => {
        // console.log(that.varImage);
        var varData = [];
        var varData2 = [];
        var attData = [];
        for (let k = 0; k < data2[i].length; k++) {
          this.countlength = this.countlength + 1;
          varData = [];
          varData2 = [];
          // varData.splice(0, varData.length);
          attData = [];
          // attData.splice(0, attData.length);
          if (that.m.hasOwnProperty('key')) {
            data2[i][k].images = that.mainImage;
          }
          if (varData.length === 0) {
            for (let l = 1; l <= 10; l++) {
              var exVar1 = data2[i][k]['variationTypeLabel' + l];
              if (exVar1 !== '') {
                // console.log(data2[i][k]['variationTypeLabel' + l]);
                // console.log(data2[i][k]['variationTypeValue' + l]);
                varData2.push({
                  [data2[i][k]['variationTypeLabel' + l]]: data2[i][k]['variationTypeValue' + l],
                });
              }
              if (l === 10) {
                if (varData2.length !== 0) {
                  varData = varData2.reduce(function (result, currentObject) {
                    for (var key in currentObject) {
                      if (currentObject.hasOwnProperty(key)) {
                        result[key] = currentObject[key];
                      }
                    }
                    return result;
                  }, {});
                }
              }
            }
            if (attData.length === 0 && varData.length !== 0) {
              attData.push({
                id: data2[i][k].code,
                status: 'Active',
                variation: varData
              });

              if (attData.length !== 0) {
                data2[i][k].attributes = attData;
              }
            }
            // }
          }
          data2[i][k].createBy = this.empId;
          data2[i][k].updateBy = this.empId;
        }
      }).then(res3 => {
        if (i === data2.length - 1) {
          for (let k = 0; k < data2.length; k++) {
            for (let p = 0; p < data2[k].length; p++) {
              this.tempdata.push(data2[k][p]);
            }
            if (k === data2.length - 1) {
              // console.log(this.tempdata);
              this.xyza = this.toastr.success('Product Data Arranged successfully!', 'Success');
              // this.procmodal2.hide();
              // swal('Your Data Arranged successfully!');
              this.spinner.hide();
              if (this.xyza.hasOwnProperty('message')) {
                this.xyzzzz = false;
              }
            }
          }
        }
      });
    }
  }

  import(template: TemplateRef<any>) {
    if (this.csv !== undefined) {
      this.loadingtext = 'Please Wait.... Import in Progress!';
      this.spinner.show();
      // this.procmodal = this.modalService.show(template, this.config);
      this._productService.importProduct(this.tempdata)
        .subscribe(
          res => {
            var data = res;
            this.success = data.success;
            if (data.success === true) {
              // this.procmodal.hide();
              this.xyzaa = this.toastr.success('Product Import successfully!', 'Success');
              this.spinner.hide();
              this.router.navigate(['product/plist']);

            }
            if (data.error !== undefined) {
              console.log(data.error);
            }
            // if (this.procmodal.hasOwnProperty('content')) {
            //   // this.procmodal.hide();
            // }
          }
        );

    } else {
      swal({
        type: 'warning',
        title: 'Error',
        text: 'Please select file to upload',
      });
    }

  }

  // End of import


  // country Api Post

  // getJSONC(): Observable<any> {
  //   return this.http.get('assets/Data/country_alpha.json')
  //     .map((res: any) => res.json());
  // }
  //
  // getJSONS(): Observable<any> {
  //   return this.http.get('assets/Data/Contries.json')
  //     .map((res: any) => res.json());
  // }

  // getDta() {
  //   for (let i = 0; i < this.county.length; i++) {
  //     if (this.county[i].latlng !== null) {
  //       this.county[i].loc = [this.county[i].latlng[1], this.county[i].latlng[0]];
  //     }
  //     for (let j = 0; j < this.state.length; j++) {
  //       if (this.county[i].name === this.state[j].CountryName) {
  //         this.test1 = this.state[j].States;
  //         this.test2 = []
  //         for (let k = 0; k < this.test1.length; k++) {
  //           this.test2.push({
  //             name: this.test1[k].StateName,
  //             cities: this.test1[k].Cities
  //           });
  //         }
  //         this.county[i].states = this.test2;
  //       }
  //     }
  //   }
  //
  // }
  //
  // putState() {
  //   for (let i = 0; i < this.county.length; i++) {
  //     this._countryService.postCounrty(this.county[i])
  //       .subscribe(res2 => {
  //       });
  //     this.count++;
  //   }
  // }

}
