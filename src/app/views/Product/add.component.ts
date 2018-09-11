import {Component, TemplateRef, ViewChild, OnInit, ElementRef} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';
import {ProductService} from '../../Shared/services/product.service';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {Router} from '@angular/router';
import {GeoLocation} from '../../Shared/services/geoLocation';
import {CategoryServices} from '../../Shared/services/category.services';
import {DomSanitizer} from '@angular/platform-browser';
import {CountryService} from '../../Shared/services/country.service';
import { NgxSpinnerService } from 'ngx-spinner';

var _ = require('lodash');
var Hashids = require('hashids');


@Component({
  selector: 'add',
  templateUrl: 'add.template.html',
  styleUrls: ['product.component.css'],
  providers: [ProductService, MerchantServices, CountryService]
})
export class AddComponent implements OnInit {

  @ViewChild('hsnCode') redel: any;
  @ViewChild('addproduct') myform: any;
  @ViewChild('attribute') attrform: any;
  @ViewChild('Varattribute') Varattribute: any;
  @ViewChild('name') name: any;
  @ViewChild('manufacturer') manufacturer: any;
  @ViewChild('country') country: any;
  @ViewChild('unit') unit: any;
  @ViewChild('price') price: any;
  @ViewChild('hsnCode') hsnCode: any;
  @ViewChild('category') category: any;

  dtOptions: any = {};
  public files: Array<any> = [];
  public file: any;
  public licImg: Array<any> = [];
  public licImg1: Array<any> = [];
  public proImg: Array<any> = [];
  public companiesObj: Array<any> = [];
  public tmpexampleData: Array<any> = [];
  public attributeData: Array<any> = [];
  public VarattributeData: Array<string> = [];
  public VarattributeHeader: Array<string> = [];
  public headerName = [];
  public hlength: any;
  public attribute: any;
  public catCode: any;
  public finalAttribute = [];
  public description: any;
  public features: any;
  public warning_information: any;
  public tmpexampleData1: Array<any> = [];
  public companies: Array<any> = [];
  public proCat: Array<any> = [];
  public proCatObj: Array<any> = [];
  public url: any;
  public hsn = null;
  public ean = null;
  public tags: Array<string> = [];
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  public attrImgname: any;
  public attrCorImgArr = [];
  public varImageShow = false;
  public attrVarImgArr = [];
  public units: Array<any> = ['Kilo Gram', 'Gram', 'Packets', 'Bottle', 'Box', 'Liter', 'Milli Liter', 'Dozen', 'Piece', 'Meter', 'Foot', 'Inch', 'Package'];
  public unitselected: Array<any> = [];
  public countryObj: Array<any> = [];
  public countryData: Array<any> = [];
  public countryId: any;
  public countryIDData: any;
  public hsnObj: Array<any> = [];
  public hsnData: Array<any> = [];
  public hsnId: any;
  public productCode: any;
  public loadingtext = 'Please Wait....';

  public pName: any;
  public parentAtrribute: any;
  public showCoreH =  false;
  public showVarH =  false;
  public dupVar =  false;
  public countrySymbol = '₹';
  public imgShow: any;
  public disimgShow = false;


  constructor(private toastr: ToastrService,
              private modalService: BsModalService,
              private _productService: ProductService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private _countryService: CountryService,
              private _merchantService: MerchantServices) {
  }

  ngOnInit() {

    var eid = this.getUser();
    this.dtOptions = {
      // ajax: 'data/data.json',
      // dom: 'lfrtip',
      dom: 'l<"pull-right">frtip',
      processing: true,
      // Configure the buttonslfrtiplfrtip
    };
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'ProductManagement') {
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
  }
  submitFormCheck() {
    if (!this.name.valid) {
      this.toastr.error('Product Name Required!', 'Error', {timeOut: 5000});
    }if (!this.manufacturer.valid) {
      this.toastr.error('Company Required!', 'Error', {timeOut: 5000});
    }if (!this.country.valid) {
      this.toastr.error('Country Required!', 'Error', {timeOut: 5000});
    }if (!this.unit.valid) {
      this.toastr.error('Unit Required!', 'Error', {timeOut: 5000});
    }if (!this.price.valid) {
      this.toastr.error('MRP Required!', 'Error', {timeOut: 5000});
    }
    // if (!this.hsnCode.valid) {
    //   this.toastr.error('HSN Code Required!', 'Error', {timeOut: 5000});
    // }
    if (!this.category.valid) {
      this.toastr.error('Category Required!', 'Error', {timeOut: 5000});
    }
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  getName(value) {
    var str = value.replace(/\s/g, '');
    var date = new Date();
    var n = date.getTime();
    var s = Math.floor(Math.random() * 4) + 1;
    var hashids = new Hashids(value.name, 4);
    var a = hashids.encode(n).toUpperCase();
    var f = a.substr(s , 4);
      this.pName = f;
    // console.log(this.pName);
    // console.log(n);
    // console.log(s);
    // console.log(f);
  }

  TagsExample() {
     swal('Product Tags Example', "<table datatable class='display table table-striped table-bordered table-hover dataTables-example'>" +
       "<thead>" +
       "<th>Sr No.</th>" +
       "<th>Category</th>" +
       "<th>Example</th>" +
       "</thead>" +
       "<tbody>" +
       "<tr>" +
       "<td>1</td>" +
       "<td>Grocery</td>" +
       "<td>Ex1</td>" +
       "</tr>" +
       "<tr>" +
       "<td>2</td>" +
       "<td>Medical</td>" +
       "<td>Ex2</td>" +
       "</tr>" +
       "<tr>" +
       "<td>3</td>" +
       "<td>AbC</td>" +
       "<td>Ex3</td>" +
       "</tr>" +
       "</tbody>" +
       "</table>");
  }

  getCountryId(value) {
    this.countryId = value.id;
    this._countryService.getCountryByID(this.countryId)
      .subscribe(
        countryIDObj => {
          this.countryIDData = countryIDObj;
          this.countrySymbol = countryIDObj.currencies[0].symbol;
          this.productCode = this.countryIDData.alpha2Code;
        });
  }

  eanCheck(ean) {
    if (ean !== '') {
      this._productService.getEAN(ean)
        .subscribe(
          result => {
            if (result.length !== 0) {
              swal(
                'Oops...',
                'EAN Number Is Already Exist!',
                'error');
              this.ean = null;
            }
          }
        );
    }
  }

  hsnCheck(hsn) {
    if (hsn !== '') {
      this._productService.getHSN(hsn)
        .subscribe(
          result => {
            if (result.length !== 0) {
              swal(
                'Oops...',
                'HSN Code Is Already Exist!',
                'error');
                this.hsn = null;

            }
          }
        );
    }
  }

  getHsnId(value) {
    this.hsnId = value.text;
    // console.log(this.hsnId);
  }



  getProductCategory() {
    this._productService.getAllProductCategory()
      .subscribe(
        res => {
          this.proCatObj = res;
          for (let i = 0; i < this.proCatObj.length; i++) {
            this.tmpexampleData1.push({'id': this.proCatObj[i]._id, 'text': this.proCatObj[i].name});
          }
          this.proCat = this.tmpexampleData1;
        });
  }

  getcat(value) {
    this.disimgShow = false;
    this.showCoreH = false;
    this.showVarH = false;
    this.attributeData = [];
    this._productService.getProductCategoryID(value.id)
      .subscribe(
        res => {
          this.attributeData = res.attribute;
          this.catCode = res.code;
          for (let i = 0; i < this.attributeData.length; i++) {
            if (this.attributeData[i].type === 'Core') {
              this.showCoreH = true;
            }
            if (this.attributeData[i].type === 'Variation') {
              this.showVarH = true;
            }
          }
          // console.log(this.attributeData);
          if (res.parentCategory !== undefined && this.attributeData !== undefined) {
            this._productService.getParentAttribute(res.parentCategory)
              .subscribe(
                parentres => {
                  this.parentAtrribute = parentres[0].attribute;
                  for (let i = 0; i < this.parentAtrribute.length; i++) {
                    if (this.parentAtrribute[i].type !== undefined) {
                          if (this.parentAtrribute[i].type === 'Core') {
                            this.showCoreH = true;
                          }
                       if (this.parentAtrribute[i].type === 'Variation') {
                            this.showVarH = true;
                          }
                    }

                  }
                  for ( let i = 0; i < this.parentAtrribute.length; i++) {
                    this.attributeData.push(this.parentAtrribute[i]);
                  }
                  this.tmpexampleData = [];
                  for (let i = 0; i < this.attributeData.length; i++) {
                    if (this.attributeData[i].type === 'Variation') {
                      if (this.attributeData[i].attType !== 'Image') {
                        this.tmpexampleData.push(this.attributeData[i].attName);
                       }
                       if (this.attributeData[i].attType === 'Image'){
                        this.disimgShow = true;
                      }
                    }
                  }
                  if (this.tmpexampleData !== undefined) {
                    this.VarattributeHeader = this.tmpexampleData;
                    this.hlength = this.VarattributeHeader.length;
                  }
                });
          } else {
            this.tmpexampleData = [];
            for (let i = 0; i < this.attributeData.length; i++) {
              if (this.attributeData[i].type === 'Variation') {
                if (this.attributeData[i].attType !== 'Image') {
                  this.tmpexampleData.push(this.attributeData[i].attName);
                }
                if (this.attributeData[i].attType === 'Image'){
                  this.disimgShow = true;
                }
                // this.tmpexampleData.push(this.attributeData[i].attName);
              }
            }
            if (this.tmpexampleData !== undefined) {
              this.VarattributeHeader = this.tmpexampleData;
              this.hlength = this.VarattributeHeader.length;
            }
          }

          // console.log(this.VarattributeHeader);
        });
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

  licenceUpload(value) {
    this.licImg = [];
    this.licImg1 = [];
    this.files = value;
    var filelength = this.files.length;
    this.spinner.show();
    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      // console.log(filelength - 1);
      this.uploadfilelic(filelength - 1);
    }
  }

  uploadfilelic(filelength) {
    // console.log(filelength);
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'product/license/' + this.file.name, Body: this.file}, (err, data) => {
      this.licImg.push({
        key: data.Key,
      });
      if (this.licImg.length - 1  === filelength) {
        this.spinner.hide();

        // console.log(this.licImg);
        for (let i = 0; i < this.licImg.length; i++){
          const urlParams = {
            Bucket: 'jhakaas-docs',
            Key:  this.licImg[i].key
          };
          new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', urlParams, (err, url) => {
              // console.log(url);
              this.licImg[i].url = url;
              // delete this.varAttributeData[i].variation['images'];
              // console.log(this.varAttributeData[0]);
              // console.log(this.varAttributeData[0]);
              if (err) reject(err)
              else resolve(url);
            });
          });
        }
      }
    });
  }

  removeLicense(i) {
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
      that.licImg.splice(i, 1);
    }).catch(function () {
      swal(
        'Safe!',
        'Your License Image is Safe!',
        'success'
      );
    });
    // this.license_images.splice(i, 1);
  }

  removeProImg(i) {
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
      that.proImg.splice(i, 1);
    }).catch(function () {
      swal(
        'Safe!',
        'Your License Image is Safe!',
        'success'
      );
    });
    // this.license_images.splice(i, 1);
  }




  ProImgUpload(value) {
    this.proImg = [];
    this.files = value;
    var filelength = this.files.length;
    this.spinner.show();
    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      this.uploadfilepro(filelength - 1);
    }
  }

  uploadfilepro(filelength) {

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'product/images/' + this.file.name, Body: this.file}, (err, data) => {
      this.proImg.push({
        key: data.Key,
      });
      if (this.proImg.length - 1  === filelength) {
        this.spinner.hide();
        for (let i = 0; i < this.proImg.length; i++){
          const urlParams = {
            Bucket: 'jhakaas-docs',
            Key:  this.proImg[i].key
          };
          new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', urlParams, (err, url) => {
              // console.log(url);
              this.proImg[i].url = url;
              // delete this.varAttributeData[i].variation['images'];
              // console.log(this.varAttributeData[0]);
              // console.log(this.varAttributeData[0]);
              if (err) reject(err)
              else resolve(url);
            });
          });
        }
      }
    });
  }

  attrVarImg(value, name) {
    // console.log(name);
    this.files = value;
    // this.file = this.files[0];
    //
    for (let i = 0; i < this.files.length; i++) {
      this.file = this.files[i];
      if (this.file !== undefined) {
        var awsConfig = new AWS.Config({
          accessKeyId: environment.awsAccessKey,
          secretAccessKey: environment.awsSecretKey,
          region: environment.awsRegion,
        });
        const s3 = new AWS.S3(awsConfig);
        s3.upload({
          Bucket: 'jhakaas-docs',
          Key: 'product/attribute/images/' + this.file.name,
          Body: this.file
        }, (err, data) => {
          // this.attrImgname = '{' + JSON.stringify(name) + ':' + '"' + data.Key + '"' + '}';
          this.attrCorImgArr.push({
            key: data.Key
          });
        });
      }
    }
  }

  imageShowClick(value){
    this.imgShow = value;
  }

  getunit(unitdata) {
    this.unitselected = [];
    // console.log(unitdata);
    for (let i = 0; i < unitdata.length; i++) {
      this.unitselected[i] = unitdata[i].id;
    }
    // console.log(this.unitselected);
  }

  varAtt(value: any) {
    if (this.attrCorImgArr.length !== 0) {
      value.images = this.attrCorImgArr;
      if (this.attrCorImgArr[0].key !== null) {
        var awsConfig = new AWS.Config({
          accessKeyId: environment.awsAccessKey,
          secretAccessKey: environment.awsSecretKey,
          region: environment.awsRegion,
        });
        const s3 = new AWS.S3(awsConfig);
        // console.log('as');
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.attrCorImgArr[0].key
        };
        new Promise((resolve, reject) => {
          s3.getSignedUrl('getObject', urlParams, (err, url) => {
            this.url = url;
            // this.varImageShow.push(this.url);
            value.url = this.url;
            this.varImageShow = true;
            this.attrCorImgArr = [];
            if (err) reject(err)
            else resolve(url);
          });
        });
      }

    }
    var xyz = value;
    for (var prop in xyz) {
      if (xyz[prop] === '' || xyz[prop] === null) {
        xyz[prop] = 'NA';
      }
    }

    if (this.VarattributeData.length !== 0) {
      for (let i = 0; i < this.VarattributeData.length  ; i++) {
        var arr = this.VarattributeData[i];
        var a = _.isEqual(JSON.stringify(xyz), JSON.stringify(arr));
        if (a === true) {
          this.dupVar = false;
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Same Variation availble.!please try with other value',
          });
          this.Varattribute.reset();
          return;
        } else {
          this.dupVar = true;
        }
      }
      } else {
        this.VarattributeData.push(value);
      }
      if (this.dupVar === true) {
        this.VarattributeData.push(value);
        this.dupVar = false;
      }
      this.Varattribute.reset();
  }
  removeVar(i) {
    // console.log(i);
    this.VarattributeData.splice(i, 1);
  }

  addAtt(value: any) {
    this.attribute = value;
    // if (this.attrImgArr !== undefined) {
    //   var image = [];
    //   image.push({
    //     images: this.attrImgArr
    //   });
    //   // this.attrImgArr = JSON.parse(this.attrImgname);
    //   this.attribute = _.merge(this.attribute, image);
    // }
    // console.log(this.attribute);
    if (this.attribute !== undefined) {
      this.toastr.success('Product Attribute Save Successfully!', 'Good job!');
    }
  }

  addProduct(value: any) {
    value.productType = 'General';
    // console.log(value);
    if (this.attribute !== undefined) {
      if (value.category !== undefined && value.category !== '') {
        value.category = value.category[0].id;
      }

      if (this.imgShow !== undefined ) {
        value.imageShown = this.imgShow;
      }else {
        value.imageShown = 'Core';
      }
      if (value.country !== undefined && value.country !== '') {
        value.country = value.country[0].text;
      }else {
        delete value.country;
      }
      if (this.unitselected.length  > 0) {
        value.unit = this.unitselected;
      }else {
        delete value.unit;
      }
      if (this.hsnId !== undefined) {
        value.hsnCode = this.hsnId;
      }else {
        delete value.hsnCode;
      }
      if (value.manufacturer !== undefined && value.manufacturer !== '') {
        value.manufacturer = value.manufacturer[0].text;
      }else {
        delete value.manufacturer;
      }
      if (this.proImg !== undefined) {
        value.images = this.proImg;
      }
      if (this.proImg.length === 0) {
        var abc = [];
        abc.push({
          index : '0',
          key : 'category/merchant/icon/no-image-available.png'
        });
        value.images[0] = abc[0];
      }
      if (this.licImg !== undefined) {
        value.license_images = this.licImg;
      }else {
        delete value.license_images;
      }
      if (value.videos !== undefined && value.videos !== '') {
        var v = [];
        v.push({
          links: value.videos,
        });
        value.videos = v[0];
      }else {
        delete value.videos;
      }
      value.createBy = this.empId;
      value.updateBy = this.empId;
      this.productCode = this.productCode.concat(this.catCode).concat(this.pName);
      value.baseProductId = this.productCode;
      // this.productCode = this.productCode.concat(this.pName);
      this.pName = null;
      var postData = value;
      if (this.VarattributeData.length !== 0) {
        for (let i = 0; i < this.VarattributeData.length; i++) {
          var hashids = new Hashids(value.name, 3);
          var a = hashids.encode(i).toUpperCase();
          this.productCode = this.productCode.concat(a);
          postData.code = this.productCode;
          this.finalAttribute = [];
          this.finalAttribute.push({
            id: this.productCode,
            status: 'Active',
            core: this.attribute,
            variation: this.VarattributeData[i]
          });
          postData.attributes = this.finalAttribute[0];
          postData.varNo = i + 1;
          this.productCode = this.productCode.substring(0, this.productCode.length - 3);
          this._productService.postProduct(postData)
            .subscribe(
              result => {
                if (result._id) {
                  if ( i === this.VarattributeData.length - 1) {
                    this.toastr.success('Your ' + this.VarattributeData.length + ' Records are Save Successfully!', 'Good job!');
                    this.router.navigate(['product/plist']);
                  }
                  // window.location.reload();
                  // this.attrform.reset();
                  // this.myform.reset();
                }
              }
            );
        }
      } else {
        var date = new Date();
        var n = date.getTime();
        hashids = new Hashids(value.name, 3);
        a = hashids.encode(n).toUpperCase();
        this.productCode = this.productCode.concat(a);
        postData.code = this.productCode;
        this.finalAttribute = [];
        this.finalAttribute.push({
          id: this.productCode,
          status: 'Active',
          core: this.attribute,
          variation: this.VarattributeData
        });
        postData.attributes = this.finalAttribute[0];
        postData.varNo = 1;
        this._productService.postProduct(postData)
          .subscribe(
            result => {
              if (result._id) {
                this.toastr.success('Your Records are Save Successfully!', 'Good job!');
                this.attrform.reset();
                this.myform.reset();
                this.router.navigate(['product/plist']);
              }
            }
          );
      }
    } else {
      if (this.attributeData.length !== 0) {
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'Please Save attribute Form first',
        });
      } else {
        if (value.category !== undefined && value.category !== '') {
          value.category = value.category[0].id;
        }

        // console.log(this.imgShow);
        if (this.imgShow !== undefined) {
          value.imageShown = this.imgShow;
        } else {
          value.imageShown = 'Core';
        }
        if (value.country !== undefined && value.country !== '') {
          value.country = value.country[0].text;
        }else {
          delete value.country;
        }
        if (this.hsnId !== undefined) {
          value.hsnCode = this.hsnId;
        }else {
          delete value.hsnCode;
        }
        if (this.unitselected.length  > 0) {
          value.unit = this.unitselected;
        }else {
          delete value.unit;
        }
        if (value.manufacturer !== undefined && value.manufacturer !== '') {
          value.manufacturer = value.manufacturer[0].text;
        }else {
          delete value.manufacturer;
        }
        if (this.proImg !== undefined) {
          value.images = this.proImg;
        }
        if (this.proImg.length === 0) {
          var abc = [];
          abc.push({
            index : '0',
            key : 'category/merchant/icon/no-image-available.png'
          });
          value.images[0] = abc[0];
        }
        if (this.licImg !== undefined) {
          value.license_images = this.licImg;
        }
        if (value.videos !== undefined && value.videos !== '') {
          var v = [];
          v.push({
            links: value.videos,
          });
          value.videos = v[0];
        }else {
          delete value.videos;
        }
        value.createBy = this.empId;
        value.updateBy = this.empId;
        this.productCode = this.productCode.concat(this.catCode).concat(this.pName);
        value.baseProductId = this.productCode;
        // this.productCode = this.productCode.concat(this.pName);
        this.pName = null;
        // this.productCode = this.productCode.concat('1');
        var postData2 = value;
        if (this.VarattributeData.length !== 0) {
          for (let i = 0; i < this.VarattributeData.length; i++) {
            var hashids = new Hashids(value.name, 3);
            var a = hashids.encode(i).toUpperCase();
            this.productCode = this.productCode.concat(a);
            postData2.code = this.productCode;
            this.finalAttribute = [];
            this.finalAttribute.push({
              id: this.productCode,
              status: 'Active',
              core: this.attribute,
              variation: this.VarattributeData[i]
            });
            postData2.attributes = this.finalAttribute[0];
            postData2.varNo = i + 1;
            this._productService.postProduct(postData2)
              .subscribe(
                result => {
                  if (result._id) {
                    if ( i === this.VarattributeData.length - 1) {
                     this.toastr.success('Your ' + this.VarattributeData.length + ' Records are Save Successfully!', 'Good job!');
                      this.router.navigate(['product/plist']);
                    }
                  }
                }
              );
          }
        } else {
          var date = new Date();
          var n = date.getTime();
          var s = Math.floor(Math.random() * 4) + 1;
          var hashids = new Hashids(value.name, 3);
          var a = hashids.encode(n).toUpperCase();
          var f = a.substr(s , 3);
          this.productCode = this.productCode.concat(f);
          // console.log(this.productCode);
          postData2.code = this.productCode;
          this.finalAttribute = [];
          this.finalAttribute.push({
            id: this.productCode,
            status: 'Active',
            core: this.attribute,
            variation: this.VarattributeData
          });
          postData2.attributes = this.finalAttribute[0];
          postData2.varNo = 1;
          // console.log(postData2);
          this._productService.postProduct(postData2)
            .subscribe(
              result => {
                if (result._id) {
                   this.toastr.success('Your Records are Save Successfully!', 'Good job!');
                   this.router.navigate(['product/plist']);
                }
                // window.location.reload();
              }
            );
        }
      }

    }
  }
}
