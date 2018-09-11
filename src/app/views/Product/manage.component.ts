import {Component, TemplateRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {ProductService} from '../../Shared/services/product.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';
import {CountryService} from '../../Shared/services/country.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Subject';

var _ = require('lodash');
var Hashids = require('hashids');

@Component({
  selector: 'manage',
  templateUrl: 'manage.template.html',
  styleUrls: ['product.component.css'],
  providers: [ProductService, MerchantServices, CountryService]
})
// export class ManageComponent implements OnInit, AfterViewInit {
export class ManageComponent implements OnInit {
  // @ViewChild(DataTableDirective)
  // dtElement: DataTableDirective;
  // dtTrigger: Subject<any> = new Subject();
  // dtOptions: DataTables.Settings = {};

  @ViewChild('name') name: any;
  @ViewChild('price') price: any;

  public companiesObj: Array<any> = [];
  public tmpexampleData: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public tmpexampleData2: Array<any> = [];
  public tmpexampleData3: Array<any> = [];
  public description: any;
  public coreData: any;
  public varData: any;
  public productCode: any;
  public null = 0;
  public varModalEdit: BsModalRef;
  public varModalAdd: BsModalRef;
  public features: any;
  public warning_information: any;
  public companies: Array<any> = [];
  public proCat: Array<any> = [];
  public proCatObj: Array<any> = [];
  public proCompActive: Array<any> = [];
  public proCatActive: Array<any> = [];
  public productObj: any;
  public countryObj: Array<any> = [];
  public countryData: Array<any> = [];
  public tags: Array<string> = [];
  public url: any;
  public sub: any;
  public company: any;
  public category: any;
  public _id: any;
  public files: Array<any> = [];
  public file: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public color: any;
  public empId: any;
  public licurl: Array<any> = [];
  public license_images: Array<any> = [];
  public upAtt: Array<any> = [];
  public varttData: Array<any> = [];
  public images: Array<any> = [];
  public imgseq: any;
  public proAttribute: Array<any> = [];
  public SelectedCatObj: Array<any> = [];
  public attribute: Array<any> = [];
  public unitselected: Array<any> = [];
  public units: Array<any> = ['Kilo Gram', 'Gram', 'Packets', 'Bottle', 'Box', 'Liter',
    'Milli Liter', 'Dozen', 'Piece', 'Meter', 'Foot', 'Inch', 'Package'];
  public tmpexampleData4: Array<any> = [];
  public activeCountry: Array<any> = [];
  public licenseImg: Array<any> = [];
  public country: Array<any> = [];
  public varAttributeData: Array<any> = [];
  public arr: any;
  public coreAttributeData: Array<any> = [];
  public coreTmpData: Array<any> = [];
  public varTmpData: Array<any> = [];
  public parentAtrribute: Array<any> = [];
  public varAttributeData1: Array<any> = [];
  public varModalData: Array<any> = [];
  public varId: any;
  public proID: any;
  public countrySymbol: any;
  public updated_status: any;
  public varModalStatus: any;
  public links: any;
  public varImges: Array<any> = [];
  public updatedImgSeq: Array<any> = [];
  public varGridShow: Array<any> = [];
  public varNewImg: Array<any> = [];
  public varNewImgUrl: string;
  public onlyImg: string;
  public dupVar = false;
  public arr1: Array<any> = [];
  public varRowIndex = 0;
  public varModalEditHide = false;
  public viewP = false;
  public page: any;
  public imgShow: any;
  public disimgShow = false;
  public imageShownChecked: any;
  public varImges1: any;
  public dupVar1 = false;
  public updatedImgSeq1 = false;
  public statuschanged = false;
  public countryId: any;
  public selectedUnits = [];
  public varID: any;

  // HSN CODE
  public hsnObj: Array<any> = [];
  public hsnData: Array<any> = [];
  public tmpexampleHSN: Array<any> = [];
  public proHSNActive: Array<any> = [];
  public hsnId: any;


  constructor(private toastr: ToastrService,
              private modalService: BsModalService,
              private _productService: ProductService,
              private _countryService: CountryService,
              private router: Router, private route: ActivatedRoute,
              private _merchantService: MerchantServices,
              private _sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    const eid = this.getUser();
    this._countryService.getCountry()
      .subscribe(
        countryObj => {
          this.countryObj = countryObj;
          this.countryData = [];
          for (let i = 0; i < this.countryObj.length; i++) {
            this.countryData.push({'id': this.countryObj[i]._id, 'text': this.countryObj[i].name});
          }
          this.countryObj = this.countryData;
        });
    this._productService.getHSNCode()
      .subscribe(
        hsnObj => {
          this.hsnObj = hsnObj;
          this.hsnData = [];
          for (let i = 0; i < this.hsnObj.length; i++) {
            this.hsnData.push({'id': this.hsnObj[i]._id, 'text': this.hsnObj[i].name + ':-' + '[' + this.hsnObj[i].code + ']'});
          }
          this.hsnObj = this.hsnData;
        });
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'ProductDataManagement') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }
          }

        });
    this.getCompany();
    this.getProductCategory();
    this.getProductById();

    // this.dtOptions = {
    //   dom: 'lfrtip',
    //   // dom: 'ifrtlp',
    //   // processing: true,
    //   // Configure the buttonslfrtiplfrtip
    //
    // };
  }


  getUser() {
    return sessionStorage.getItem('_id');
  }

  //
  // ngAfterViewInit(): void {
  //   this.dtTrigger.next();
  // }
  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }
  getProductCategory() {
    this._productService.getAllProductCategory()
      .subscribe(
        res => {
          this.proCatObj = res;
          // console.log(this.proCatObj);
          for (let i = 0; i < this.proCatObj.length; i++) {
            this.tmpexampleData1.push({'id': this.proCatObj[i]._id, 'text': this.proCatObj[i].name});
          }
          this.proCat = this.tmpexampleData1;
        });
    // console.log(this.tmpexampleData1);
  }

  getCompany() {
    this._productService.getAllCompany()
      .subscribe(
        res => {
          this.companiesObj = res;
          for (let i = 0; i < this.companiesObj.length; i++) {
            this.tmpexampleData.push({'id': this.companiesObj[i]._id, 'text': this.companiesObj[i].name});
          }
          this.companies = this.tmpexampleData;
        });
  }

  submitFormCheck() {
    if (!this.name.valid) {
      this.toastr.error('Product Name Required!', 'Error', {timeOut: 5000});
    }
    if (!this.price.valid) {
      this.toastr.error('MRP Required!', 'Error', {timeOut: 5000});
    }
  }

  imageShowClick(value) {
    this.imgShow = value;
  }

  getProductById() {
    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this.page = params['manage'];
      if (this.page === 'Manage') {
        this.viewP = false;
      } else {
        this.viewP = true;
      }
      this._productService.getProductById(this._id)
        .subscribe(
          res => {
            this.productObj = res;
            // console.log(this.productObj);
            // this.varAttributeData.push(this.productObj.attributes[0].variation);
            this._productService.getAllVariation(this.productObj.baseProductId)
              .subscribe(result => {
                var data = result;
                var awsConfig = new AWS.Config({
                  accessKeyId: environment.awsAccessKey,
                  secretAccessKey: environment.awsSecretKey,
                  region: environment.awsRegion,
                });
                const s3 = new AWS.S3(awsConfig);
                for (let i = 0; i < data.length; i++) {
                  if (data[i].attributes.length !== 0) {
                    this.varAttributeData.push(data[i].attributes[0]);
                    this.varGridShow.push(data[i].attributes[0]);
                    this.onlyImg = this.varAttributeData[0].variation.hasOwnProperty('url');
                  }
                  // this.varAttributeData.push(data[i].attributes[0]);
                }
                for (let i = 0; i < this.varAttributeData.length; i++) {
                  if ('variation' in this.varAttributeData[i]) {
                    // if (this.varAttributeData[i].variation.images[0].key !== null) {
                    if ('images' in this.varAttributeData[i].variation) {
                      // console.log('as');
                      const urlParams = {
                        Bucket: 'jhakaas-docs',
                        Key: this.varAttributeData[i].variation.images[0].key
                      };
                      new Promise((resolve, reject) => {
                        s3.getSignedUrl('getObject', urlParams, (err, url) => {
                          // console.log(url);
                          this.varAttributeData[i].variation.url = url;
                          // delete this.varAttributeData[i].variation['images'];
                          // console.log(this.varAttributeData[0]);
                          // console.log(this.varAttributeData[0]);
                          if (err) reject(err)
                          else resolve(url);
                        });
                      });

                    }
                  }
                  // console.log(this.varAttributeData);
                }
                // console.log(this.varAttributeData[0].status);
                // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                //   // Destroy the table first
                //   dtInstance.destroy();
                //   // Call the dtTrigger to rerender again
                //   this.dtTrigger.next();
                // });
                // this.dtTrigger.next();
              });
            // if(this.productObj.attributes[0].id !== undefined){
            //     console.log(this.productObj.attributes[0].id);
            //     this.variationId = this.productObj.attributes[0].id;
            // }


            if (this.productObj.tags !== undefined) {
              this.tags = this.productObj.tags;
              // console.log(this.tags);
            }

            if (this.productObj.imageShown !== undefined) {
              this.imageShownChecked = this.productObj.imageShown;
              // if(this.imageShownChecked === 'Core')
            }
            if (this.productObj.videos.length !== 0) {
              this.links = this.productObj.videos[0].links;
            }
            if (this.productObj.attributes.length !== 0) {
              this.coreData = this.productObj.attributes[0].core;
              this.varData = this.productObj.attributes[0].variation;
            }
            if (this.productObj.country !== undefined) {
              this._countryService.getCountryByNameD(this.productObj.country)
                .subscribe(countryNameData => {
                  this.countrySymbol = countryNameData[0].currencies[0].symbol;
                });
              this.activeCountry = [];
              this.activeCountry.push({'text': this.productObj.country, 'id': this.productObj.country});
              // this.country =  this.activeCountry[0];
            }
            if (this.productObj.unit !== undefined) {
              this.tmpexampleData4 = [];
              for (let i = 0; i < this.productObj.unit.length; i++) {
                this.tmpexampleData4.push({'text': this.productObj.unit[i], 'id': this.productObj.unit[i]});
              }

              this.unitselected = this.tmpexampleData4;

            }
            if (this.productObj.category !== undefined) {
              // console.log(this.productObj.category._id);
              this.category = this.productObj.category._id;
              this.selected_cat(this.category);
            }
            if (this.productObj.attributes.length > 0) {
              this.proAttribute = this.productObj.attributes;
              // console.log(this.proAttribute);
            }
            // console.log(this.productObj);
              if (this.productObj.manufacturer !== undefined) {
              this.tmpexampleData2.push({
                'id': this.productObj.manufacturer,
                'text': this.productObj.manufacturer
              });
            } else {
              this.tmpexampleData2.push({'id': '', 'text': ''});
            }
            this.proCompActive = this.tmpexampleData2;

            if (this.productObj.hsnCode !== undefined) {
              this.tmpexampleHSN.push({
                'id': this.productObj.hsnCode,
                'text': this.productObj.hsnCode
              });
            } else {
              this.tmpexampleHSN.push({'id': '', 'text': ''});
            }
            this.proHSNActive = this.tmpexampleHSN;

            if (this.productObj.category !== undefined) {
              this.tmpexampleData3.push({'id': this.productObj.category._id, 'text': this.productObj.category.name});
            } else {
              this.tmpexampleData3.push({'id': '', 'text': ''});
            }
            this.proCatActive = this.tmpexampleData3;

            if (this.productObj.license_images !== null) {
              const awsConfig = new AWS.Config({
                accessKeyId: environment.awsAccessKey,
                secretAccessKey: environment.awsSecretKey,
                region: environment.awsRegion,
              });
              const s3 = new AWS.S3(awsConfig);
              for (let i = 0; i < this.productObj.license_images.length; i++) {
                const urlParams = {
                  Bucket: 'jhakaas-docs',
                  Key: this.productObj.license_images[i].key
                };
                // this.license_images[i] = this.productObj.license_images[i];
                new Promise((resolve, reject) => {
                  s3.getSignedUrl('getObject', urlParams, (err, url) => {
                    this.licurl.push(url);
                    this.license_images.splice(i, 1, {
                      'id': this.productObj.license_images[i]._id,
                      'key': this.productObj.license_images[i].key,
                      'url': url,
                    });
                    if (err) reject(err);
                    else resolve(url);
                  });
                });
              }
              this.licenseImg = this.license_images;
            }
            if (this.productObj.images !== null) {
              const awsConfig = new AWS.Config({
                accessKeyId: environment.awsAccessKey,
                secretAccessKey: environment.awsSecretKey,
                region: environment.awsRegion,
              });
              const s3 = new AWS.S3(awsConfig);
              for (let i = 0; i < this.productObj.images.length; i++) {
                const urlParams = {
                  Bucket: 'jhakaas-docs',
                  Key: this.productObj.images[i].key
                };
                new Promise((resolve, reject) => {
                  s3.getSignedUrl('getObject', urlParams, (err, url) => {
                    this.images.splice(i, 1, {
                      'id': this.productObj.images[i]._id,
                      'index': this.productObj.images[i].index,
                      'key': this.productObj.images[i].key,
                      'url': url,
                    });

                    if (err) reject(err);
                    else resolve(url);
                  });
                });
              }
              this.imgseq = this.images;
            }
          });
    });

  }

  getCountryId(value) {
    // console.log(value);
    this.countryId = value.text;
    this._countryService.getCountryByID(value.id)
      .subscribe(
        countryIDObj => {
          this.countrySymbol = countryIDObj.currencies[0].symbol;
        });
  }

  printqr(value) {
    var content = document.getElementById(value).innerHTML;
    var mywindow = window.open('', 'Print', 'height=600,width=800');

    mywindow.document.write('<html><head><title>Print</title>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus()
    mywindow.print();
    mywindow.close();
    return true;
  }

  updateSeq(value) {
    // console.log(value);
    for (let i = 0; i < value.length; i++) {
      this._productService.updateProImageIndex(this._id, value)
        .subscribe(
          data => {

          }
        );
    }
  }

  updateVarSeq(value) {
    // console.log(value);
    this.varGridShow = value;
    for (let i = 0; i < value.length; i++) {
      this._productService.getvarId(value[i].id)
        .subscribe(
          data => {
            var a = data[0];
            this._productService.updateVarSeq(a._id, i + 1)
              .subscribe(
                data2 => {
                }
              );
          }
        );
    }
  }

  updateVarImgSeq(value) {
    // console.log(value);
    this.updatedImgSeq = value;
    this.updatedImgSeq1 = true;
  }

  proImgUpload(value) {
    // console.log(value);
    this.files = value;

    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      this.uploadfilepro();
    }
  }

  uploadfilepro() {
    const awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'product/images/' + this.file.name, Body: this.file}, (err, data) => {
      this.images.push({
        key: data.Key,
      });
    });
  }


  removeProVarImg(j) {
    for (let i = 0; i < this.varAttributeData.length; i++) {
      if (this.varId === this.varAttributeData[i].id) {
        this.varImges.splice(j, 1);
        // this.varAttributeData[i].variation.images.splice(i, 1);
      }
    }

    // this.varId
    // this.varAttributeData[i].variation.images[i];


  }

  removeProImg(i, rowID) {
    const that = this;
    const that1 = this;
    swal({
      title: 'Are you sure?',
      text: 'To Delete the Product Image!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      that._productService.deleteProImg(that1._id, rowID)
        .subscribe(
          productObjObj => {
            if (productObjObj === null) {
              // this.toastr.success('Product Image Deleted Successfully', 'Success!')
            }
          });
      swal(
        'Deleted!',
        'Your Product Image.',
        'success'
      );
      that.images.splice(i, 1);
    }).catch(function () {
      swal(
        'Safe!',
        'Your Product Image is Safe!',
        'success'
      );
    });
  }


  licenceUpload(value) {
    // this.licImg = [];
    // console.log(value);
    this.files = value;
    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      this.uploadfilelic();
    }
  }

  uploadfilelic() {

    const awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    // console.log(this.productObj.license_images);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'product/license/' + this.file.name, Body: this.file}, (err, data) => {
      this.license_images.push({
        key: data.Key,
      });

    });

    // console.log(this.licImg);
  }

  removeLicense(i, rowID) {
    // console.log(rowID);
    const that = this;
    const that1 = this;
    swal({
      title: 'Are you sure?',
      text: 'To Delete the License Image!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      that._productService.deleteLicImg(that1._id, rowID)
        .subscribe(
          productObjObj => {
            if (productObjObj === null) {
              // this.toastr.success('Product Image Deleted Successfully', 'Success!')
            }
          });
      swal(
        'Deleted!',
        'Your License Image.',
        'success'
      );
      that.license_images.splice(i, 1);
    }).catch(function () {
      swal(
        'Safe!',
        'Your License Image is Safe!',
        'success'
      );
    });
    // this.license_images.splice(i, 1);
  }


  addVarModal(template: TemplateRef<any>) {
    this.varModalAdd = this.modalService.show(template);
  }

  compSelect(value) {
    this.company = value.text;
  }

  hsnSelect(value) {
    this.hsnId = value.text;
  }

  selectedUnit(value) {
    this.selectedUnits = value;
  }

  catselected(value) {
    this.category = value.id;
    // console.log(this.category);
    this.selected_cat(this.category);
  }

  selected_cat(catId) {
    this.disimgShow = false;
    this._productService.getSelectedCat(catId)
      .subscribe(
        res => {
          this.SelectedCatObj = res.attribute;
          // console.log(res);
          if (res.parentCategory !== undefined) {
            this._productService.getParentAttribute(res.parentCategory)
              .subscribe(
                parentres => {
                  this.varTmpData = [];
                  this.coreTmpData = [];
                  this.parentAtrribute = parentres[0].attribute;
                  for (let i = 0; i < this.parentAtrribute.length; i++) {
                    this.SelectedCatObj.push(this.parentAtrribute[i]);
                  }

                  if (this.SelectedCatObj !== undefined) {
                    for (let i = 0; i < this.SelectedCatObj.length; i++) {
                      // console.log(this.SelectedCatObj.length);
                      // console.log(this.SelectedCatObj);
                      if (this.SelectedCatObj[i].type === 'Variation') {
                        if (this.SelectedCatObj[i].attType !== 'Image') {
                          this.varTmpData.push(this.SelectedCatObj[i]);
                        } else {
                          this.disimgShow = true;
                        }
                      } else if (this.SelectedCatObj[i].type === 'Core') {
                        this.coreTmpData.push(this.SelectedCatObj[i]);
                      }
                    }
                    this.varAttributeData1 = this.varTmpData;
                    this.coreAttributeData = this.coreTmpData;
                    // console.log(this.coreAttributeData);

                  }

                });
          } else {
            if (this.SelectedCatObj !== undefined) {
              this.varTmpData = [];
              this.coreTmpData = [];
              // console.log(this.SelectedCatObj);
              for (let i = 0; i < this.SelectedCatObj.length; i++) {
                if (this.SelectedCatObj[i].type === 'Variation') {
                  if (this.SelectedCatObj[i].attType !== 'Image') {
                    this.varTmpData.push(this.SelectedCatObj[i]);
                  }
                  if (this.SelectedCatObj[i].attType === 'Image') {
                    this.disimgShow = true;
                  }
                } else if (this.SelectedCatObj[i].type === 'Core') {
                  this.coreTmpData.push(this.SelectedCatObj[i]);
                }
              }
              this.varAttributeData1 = this.varTmpData;
              // console.log(this.varTmpData);
              this.coreAttributeData = this.coreTmpData;
              // console.log(this.varAttributeData1);
            }
          }
        });

  }

  attrVarImg(value) {
    // console.log(name);
    this.files = value;

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    // this.file = this.files[0];
    //
    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      if (this.file !== undefined) {

        s3.upload({
          Bucket: 'jhakaas-docs',
          Key: 'product/attribute/images/' + this.file.name,
          Body: this.file
        }, (err, data) => {
          // this.attrImgname = '{' + JSON.stringify(name) + ':' + '"' + data.Key + '"' + '}';
          this.varNewImg.push({
            key: data.Key
          });
          const urlParams = {
            Bucket: 'jhakaas-docs',
            Key: data.Key
          };
          new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', urlParams, (err, url) => {
              this.varNewImgUrl = url;
              if (err) reject(err);
              else resolve(url);
            });
          });
        });


      }
    }
    if (this.varNewImg.length !== 0) {
      // const urlParams = {
      //   Bucket: 'jhakaas-docs',
      //   Key: this.varNewImg[0].key
      // };
      // new Promise((resolve, reject) => {
      //   s3.getSignedUrl('getObject', urlParams, (err, url) => {
      //     this.varNewImgUrl  = url;
      //     if (err) reject(err);
      //     else resolve(url);
      //   });
      // });
    }

  }

  addNewVar(value) {
    var varNo = 0;
    var xyz = value;
    var status = value.status;
    for (var prop in xyz) {
      if (xyz[prop] === '' || xyz[prop] === null) {
        xyz[prop] = 'NA';
      }
      // console.log(xyz[prop]);
    }
    delete xyz.status;
    // this.arr1 = this.varAttributeData;


    if (this.varAttributeData.length !== 0) {

      // this.arr1 = this.varAttributeData;
      // console.log(this.arr1);
      for (let i = 0; i < this.varAttributeData.length; i++) {
        this.arr = this.varAttributeData[i].variation;
        delete this.arr.status;
        if (this.arr.hasOwnProperty('url')) {
          // delete this.arr.url;
          xyz.url = this.arr.url;
        }
        if (this.arr.hasOwnProperty('images')) {
          // delete this.arr.images;
          xyz.images = this.arr.images;
        }
        var a = _.isEqual(JSON.stringify(xyz), JSON.stringify(this.arr));
        if (a === true) {
          this.dupVar = false;
          this.varModalAdd.hide();
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Same Variation availble.!please try with other value',
          });

          // this.Varattribute.reset();
          return;
        } else {
          this.dupVar = true;
        }
      }
      // console.log(this.varAttributeData);
    }


    if (this.dupVar === true) {
      this.dupVar = false;
      // console.log(this.arr1);
      // this.varAttributeData = this.arr1;
      // this.varGridShow = this.arr1;
      // this.upAtt = this.arr1;
      // console.log(this.arr1);
      if (this.varNewImg.length !== 0) {
        value.images = this.varNewImg;
        value.url = this.varNewImgUrl;
      }

      var data = this.productObj;
      delete data._id;
      delete data.createdAt;
      delete data.updatedAt;
      delete data._v;
      this.upAtt = [];
      this.varttData = [];
      data.attributes = this.upAtt[0];
      this._productService.getVarNo(this.productObj.baseProductId)
        .subscribe(varNoR => {
          this.productCode = this.productObj.baseProductId;
          varNo = varNoR[0].varNo;
          varNo = varNo + 1;
          // var date = new Date();
          // var n = date.getTime();
          var n = Math.floor((Math.random() * 9) + 1);
          var hashids = new Hashids(value.name, 3);
          var a = hashids.encode(n).toUpperCase();
          this.productCode = this.productCode.concat(a);
          data.code = this.productCode;
          this.upAtt.push({
            id: this.productCode,
            core: this.coreData,
            variation: value,
            status: status
          });

          data.attributes = this.upAtt[0];
          this.varGridShow.push({
            id: this.productCode,
            core: this.coreData,
            variation: value,
            status: status
          });
          this.varAttributeData.push({
            id: this.productCode,
            core: this.coreData,
            variation: value,
            status: status
          });
          data.varNo = varNo;
          // console.log(data);
          this.productCode = null;
          this._productService.postProduct(data)
            .subscribe(
              result => {
                if (result._id) {
                  this.varModalAdd.hide();
                  this.toastr.success('Records are Save Successfully with new Variation!', 'Good job!');
                    setTimeout(() => window.location.reload(), 500);
                  // this.router.navigate(['/product/Manage', this._id]);
                  // this.getProductById();
                }
              }
            );
        });
    }


  }

  removeVar(i) {
    this.varAttributeData.splice(i, 1);
  }

  //

  updateVarAtt(value) {
    // console.log(value);
    // console.log(this.varImges1);
    if (this.varImges.length !== this.varImges1) {
      this.dupVar1 = true;
      this.dupVar = true;
    } else {
      this.dupVar1 = false;
    }

    this.updated_status = value.status;
    if (this.updatedImgSeq1 === true) {
      this.dupVar1 = true;
      this.dupVar = true;
      value.images = this.updatedImgSeq;
      value.url = this.updatedImgSeq[0].url;
    }
    // else if (this.varImges.length > 0) {
    else {
      this.dupVar1 = false;
      if (this.varImges.length > 0) {
        value.images = this.varImges;
        value.url = this.varImges[0].url;
      }
    }

    if (this.dupVar1 === false) {
      var xyz = value;
      delete xyz.status;
      if (this.varGridShow.length !== 0) {
        // this.arr1 = this.varAttributeData;
        // console.log(this.arr1);
        for (let i = 0; i < this.varGridShow.length; i++) {
          this.arr = this.varGridShow[i].variation;
          delete this.arr.status;
          if (this.arr.hasOwnProperty('url')) {
            // delete this.arr.url;
            xyz.url = this.arr.url;
          }
          if (this.arr.hasOwnProperty('images')) {
            // delete this.arr.images;
            xyz.images = this.arr.images;
          }

          var a = _.isEqual(JSON.stringify(xyz), JSON.stringify(this.arr));
          if (a === true && this.statuschanged === false) {
            this.dupVar = false;
            this.varModalEdit.hide();
            swal({
              type: 'error',
              title: 'Oops...',
              text: 'Same Variation availble.!please try with other value',
            });

            // this.Varattribute.reset();
            return;
          } else if (a === true && this.statuschanged === true) {
            this.varModalEdit.hide();
          } else {
            this.dupVar = true;
            this.dupVar1 = true;
          }
        }

      }
    }
    if (this.dupVar1 === true) {
      if (this.dupVar === true) {
        this.dupVar = false;

        this.upAtt = [];
        this.upAtt.push({
          attributes: {
            id: this.varId,
            status: this.updated_status,
            core: this.coreData,
            variation: value
          },
          category: this.category,
          updateBy: this.empId,

        });
        // console.log(this.upAtt);
        this._productService.updateAttribute(this.proID, JSON.stringify(this.upAtt[0]))
          .subscribe(
            data => {
              if (data.length !== 0) {
                for (let i = 0; i < this.varGridShow.length; i++) {
                  if (this.varGridShow[i].id === this.varId) {
                    this.varGridShow.splice(i, 1, {
                      id: this.varId,
                      status: this.updated_status,
                      core: this.coreData,
                      variation: value
                    });
                  }
                }
                for (let i = 0; i < this.varAttributeData.length; i++) {
                  if (this.varAttributeData[i].id === this.varId) {
                    this.varAttributeData.splice(i, 1, {
                      id: this.varId,
                      status: this.updated_status,
                      core: this.coreData,
                      variation: value
                    });
                  }
                }
                this.varModalEdit.hide();
                this.toastr.success('Attribute Updated successfully!', 'Success');
                this.updatedImgSeq1 = false;
                this.varImges = null;
                this.updated_status = null;
              }
            }
          );
      }

    }


    // console.log(this.updated_status);

    // for(let i = 0; i < this.updatedImgSeq.length; i++){
    //   delete  this.updatedImgSeq[i].url
    // }


  }

  updateAtt(value: any) {
    // console.log(value);
    //
    // let name;
    // var a = JSON.stringify(value);
    // for (name in value) {
    //   console.log(name);
    //   // if(this.proAttribute[0].core   )
    // }
    //
    // console.log(this.proAttribute[0].core);

    // var b = a[key];
    // console.log(b);
    this.upAtt = [];
    this.upAtt.push({
      attributes: {
        id: this.productObj.code,
        core: value,
        variation: this.varData
      },
      category: this.category,
      updateBy: this.empId
    });
    // console.log(this.upAtt);
    this._productService.getBaseProId(this.productObj.baseProductId)
      .subscribe(
        res => {
          // console.log(res);
          var data = res;
          for (let i = 0; i < data.length; i++) {
            this._productService.updateAttribute(data[i]._id, JSON.stringify(this.upAtt[0]))
              .subscribe(
                data2 => {
                  if (data2.length !== 0) {
                    this.toastr.success('Attribute Updated successfully!', 'Success');
                  }
                }
              );
          }
        });

    // this.attribute = value;
    // if (this.attribute !== undefined) {
    //   this.toastr.success('Your Attribute Records updated Successfully!', 'Good job!');
    // }
  }

  EditModalHide() {
    this.varModalEditHide = true;
  }

  varStatusChange(value) {
    this.varModalEditHide = true;
    this.varAttributeData[this.varRowIndex].status = value;
    this.varGridShow[this.varRowIndex].status = value;
    if (this.varModalEditHide !== true) {
      this.varModalEdit.hide();
    }


    this._productService.updateAttribute(this.proID, JSON.stringify({attributes: this.varGridShow[this.varRowIndex]}))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.statuschanged = true;
            // for (let i = 0; i < this.varGridShow.length; i++) {
            //   if (this.varGridShow[i].id === this.varId) {
            //     this.varGridShow.splice(i, 1, {
            //       id: this.varId,
            //       status: this.updated_status,
            //       core: this.coreData,
            //       variation: value
            //     });
            //   }
            // }
            // for (let i = 0; i < this.varAttributeData.length; i++) {
            //   if (this.varAttributeData[i].id === this.varId) {
            //     this.varAttributeData.splice(i, 1, {
            //       id: this.varId,
            //       status: this.updated_status,
            //       core: this.coreData,
            //       variation: value
            //     });
            //   }
            // }

            // this.toastr.success('Attribute Updated successfully!', 'Success');
          }
        }
      );

  }

  varModal(template: TemplateRef<any>, i, varId) {
    this.varRowIndex = i;
    this.varImges = [];
    this.varModalEdit = this.modalService.show(template);
    this.varModalData = this.varAttributeData[i].variation;
    this.varID = this.varAttributeData[i].id;
    if ('images' in this.varGridShow[i].variation) {
      var awsConfig = new AWS.Config({
        accessKeyId: environment.awsAccessKey,
        secretAccessKey: environment.awsSecretKey,
        region: environment.awsRegion,
      });
      const s3 = new AWS.S3(awsConfig);
      for (let j = 0; j < this.varAttributeData[i].variation.images.length; j++) {
        if (this.varAttributeData[i].variation.images[j].key !== null) {
          // console.log('as');
          const urlParams = {
            Bucket: 'jhakaas-docs',
            Key: this.varAttributeData[i].variation.images[j].key
          };
          new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', urlParams, (err, url) => {
              this.varImges.push({
                'key': this.varAttributeData[i].variation.images[j].key,
                'url': url
              });
              this.varImges1 = this.varImges.length;
              if (err) reject(err)
              else resolve(url);
            });
          });

        }
      }
      // console.log(this.varImges);
    }

    this.varModalStatus = this.varAttributeData[i].status;
    this.varId = varId;
    // console.log(varId);
    this._productService.getProdID(this.varId)
      .subscribe(
        res => {
          this.proID = res[0]._id;
        });
  }


  update_product(value) {
    console.log(value);
    if (this.hsnId !== undefined) {
      value.hsnCode = this.hsnId;
    }
    if (this.company !== undefined) {
      value.manufacturer = this.company;
    } else {
      delete value.manufacturer;
    }
    if (this.imgShow !== undefined) {
      value.imageShown = this.imgShow;
    }
    if (this.category !== undefined) {
      value.category = this.category;
    } else {
      delete value.category;
    }
    if (value.videos !== undefined) {
      const v = [];
      v.push({
        links: value.videos,
      });
      value.videos = v[0];
    }
    if (this.license_images !== undefined) {
      value.license_images = this.license_images;
    }
    if (this.countryId !== undefined) {
      value.country = this.countryId;
    } else {
      delete value.country;
    }

    if (this.selectedUnits.length > 0) {
      var units = [];
      for (let i = 0; i < this.selectedUnits.length; i++) {
        units[i] = this.selectedUnits[i].id;
      }
      value.unit = units;
    } else {
      delete value.unit;
    }

    // if (value.status !== undefined) {
    //   // var a = [];
    //   // a.push({
    //   //   status: value.status
    //   // })
    //   this._productService.updateStatus(this._id, value.status)
    //     .subscribe(
    //       result => {}
    //     );
    //   delete value.status;
    // }

    if (this.images !== undefined) {
      value.images = this.images;
    }
    value.updateBy = this.empId;
    // console.log(value);
    const putdata = value;
    this._productService.getBaseProId(this.productObj.baseProductId)
      .subscribe(
        res => {
          var data = res;
          for (let i = 0; i < data.length; i++) {
            // var j = data.length - 1;
            this._productService.updateProduct(data[i]._id, JSON.stringify(putdata))
              .subscribe(
                result => {
                  if (result.length !== 0) {
                    if (i === data.length - 1) {
                      this.toastr.success(' Product Updated successfully!', 'Success');
                      this.router.navigate(['product/plist']);
                      // this.toastr.success(data.length + ' Product Updated successfully!', 'Success');
                    }
                  }

                }
              );
          }
        });


  }


}
