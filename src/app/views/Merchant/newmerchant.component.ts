import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {Router} from '@angular/router';
import {GeoLocation} from '../../Shared/services/geoLocation';
import {CategoryServices} from '../../Shared/services/category.services';
import {CountryService} from '../../Shared/services/country.service';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Merchant} from '../../Shared/model/merchant';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import * as AWS from 'aws-sdk';
// import AWS = require('aws-sdk');
// import {AWS} from 'aws-sdk';
import {ICarouselConfig, AnimationConfig} from 'angular4-carousel';
import {country} from 'aws-sdk/clients/importexport';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'newmerchant',
  templateUrl: 'newmerchant.template.html',
  styleUrls: ['merchant.component.css'],
  providers: [MerchantServices, GeoLocation, CategoryServices, CountryService]
})
export class NewmerchantComponent implements OnInit {

  @ViewChild('myInput') myInputVariable: any;
  @ViewChild('Docname') myInputVariable2: any;
  @ViewChild('email') email: any;
  @ViewChild('password') password: any;
  @ViewChild('confirmPassword') confirmPassword: any;
  @ViewChild('days') days: any;
  @ViewChild('mobileNumber') mobileNumber: any;
  @ViewChild('firstName') firstName: any;
  @ViewChild('lastName') lastName: any;
  @ViewChild('gender') gender: any;
  @ViewChild('dob') dob: any;
  @ViewChild('merType') merType: any;
  @ViewChild('name') name: any;
  @ViewChild('aadharCard') aadharCard: any;
  @ViewChild('gst') gst: any;
  @ViewChild('country') country: any;
  @ViewChild('State') State: any;
  @ViewChild('City') City: any;
  @ViewChild('postalCode') postalCode: any;
  @ViewChild('Address1') Address1: any;
  @ViewChild('landmark') landmark: any;
  @ViewChild('radio1') radio1: any;
  @ViewChild('deliveryTime') deliveryTime: any;
  @ViewChild('vrm') vrm: any;
  @ViewChild('paymentType') paymentType: any;
  @ViewChild('orderPlacement') orderPlacement: any;
  @ViewChild('minimumOrder') minimumOrder: any;

  public lat: any;
  public lng: any;
  public file: any;
  public data: any;
  public docImg: any;
  public docStoreImg: any;
  public merchant: Merchant;
  public showSelected: boolean;
  public maxDate: Date;
  public openTime: any;
  public closeTime: any;
  public isEnabled: boolean;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;

  public stateDisable = true;
  public cityDisable = true;
  public stateActive: Array<any> = [];
  public cityActive: Array<any> = [];

  public socialModalAdd: BsModalRef;
  public mobadd: BsModalRef;
  public bankModalAdd: BsModalRef;
  public documentModalAdd: BsModalRef;
  public SLAaddModal: BsModalRef;

  public geoAddress: any;
  public openingTime: any;
  public closingTime: any;
  public mobNo: any;
  public whatNo: any;
  public files: any;
  public url: String;
  public documents: Array<any> = [];
  public activeShownValue: Array<string> = [];
  public Address: Array<any> = [];
  public phone: Array<any> = [];
  public bankDetails: Array<any> = [];
  public socialMedia: Array<any> = [];
  public zoomM = 15;
  public categoryPCObj: any;
  public catObj: any;


  public disdeliveryTime = false;
  public disSpecialOffer = false;
  public disRadius = false;
  public disRadiusMeasure = false;
  public disPaymentType = false;
  public disOrderPlacement = false;
  public disMinimumOrder = false;
  public disSLA = true;
  public disShownValue = false;

  // country Management
  public countryIDData: any;
  public stateIDData: any;
  public countryId: any;
  public currencies: any;
  public code = '₹';
  public stateId: any;
  public countryData: Array<any> = [];
  public stateData: Array<any> = [];
  public cityData: Array<any> = [];
  public countryObj: any;
  public stateObj: any;
  public cityObj: any;
  public callingCodes: string;
  public defRadiusMeasure: string;


  public slaObj: any;
  public tmpexampleData: Array<any> = [];
  public a = [];
  public shopschedule: Array<any> = [];
  public storebanner: Array<any> = [];
  public tags: Array<string> = [];
  public subcategoryNameObj: any;
  public tc: BsModalRef;
  public pp: BsModalRef;
  public rep: BsModalRef;
  public rp: BsModalRef;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };
  public daysList: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'];
  public showSelected1 = true;
  public showSelected2 = false;


  public pass: any;
  public config1: ICarouselConfig = {
    verifyBeforeLoad: true,
    log: false,
    animation: true,
    animationType: AnimationConfig.SLIDE,
    autoplay: true,
    autoplayDelay: 2000,
    stopAutoplayMinWidth: 768
  };
  public validImg = false;
  public addedNumber: Array<any> = [];

  public enablemob = true;

  // policy data
  terms_of_service: any;
  privacy_policy: any;
  refund_policy: any;
  return_policy: any;

  public locaaal: any;
  public addedSLA: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public SLADropdownValue: Array<any> = ['Delivery Time', 'Special Offer', 'Radius', 'Payment Type', 'Order Placement', 'Minimum order value'];
  public enableButton = true;
  public slaValue: Array<any> = [];
  public chain: any;
  public addedEmail: Array<any> = [];
  public enablemail = true;
  public mailAdd: BsModalRef;
  public defSocialURL: string;
  public loadingtext = 'Please Wait... Uploading Image';

  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private _geoLoacation: GeoLocation,
              private _categoryService: CategoryServices,
              private spinner: NgxSpinnerService,
              private _countryService: CountryService,
              private router: Router,
              private sanitizer: DomSanitizer) {
    this.lat = 19.199821;
    this.lng = 72.842594;

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

  };

  // OnInit
  ngOnInit() {
    // this.SLADropdownValue = this.tmpexampleData1;
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'MerchantManagement') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }
          }

        });
    this.callingCodes = '+91';
    this.defRadiusMeasure = 'KM';
    this.defSocialURL = 'https://';
    this.getckeditorcontent();
    this.getGeoAddress(this.lat, this.lng);
    this._categoryService.getCategoryName()
      .subscribe(
        categoryObj => {
          this.catObj = categoryObj;
          for (let i = 0; i < this.catObj.length; i++) {
            this.tmpexampleData.push({'id': this.catObj[i]._id, 'text': this.catObj[i].name});
          }
          this.catObj = this.tmpexampleData;
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

  getUser() {
    return sessionStorage.getItem('_id');
  }

  TagsExample() {
    swal("Merchant Tags Example", "<table datatable class='display table table-striped table-bordered table-hover dataTables-example'>" +
      "<thead>" +
      "<th>Sr No.</th>" +
      "<th>Category</th>" +
      "<th>Example</th>" +
      "</thead>" +
      "<tbody>" +
      "<tr>" +
      "<td>1</td>" +
      "<td>Grocery</td>" +
      "<td>Grain Store, General Store, Oil Depot, Departmental Shop</td>" +
      "</tr>" +
      "<tr>" +
      "<td>2</td>" +
      "<td>Beauty and health</td>" +
      "<td>SPA, Salon, Fitness Trainer,Physiotherapy, Yoga trainer</td>" +
      "</tr>" +
      "<tr>" +
      "<td>3</td>" +
      "<td>Eateries</td>" +
      "<td>Non Veg Restaurants, Café & Fast Food Centre, Resto Bar, Pure Veg Restaurants, Jain Restaurants</td>" +
      "</tr>" +
      "<tr>" +
      "<td>4</td>" +
      "<td>Fruits & Vegetables</td>" +
      "<td>Fresh Vegetable, Fruit, Seasonal Fruits</td>" +
      "</tr>" +
      "<tr>" +
      "<td>5</td>" +
      "<td>Women Fashion</td>" +
      "<td>Desginer Clothes, Traditional Designer, Clothing accessories, Fashion accessories</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>");
  }
  // Country Management

  getCountryId(value) {
    this.stateDisable = true;
    this.cityDisable = true;
    this.stateObj = null;
    this.cityObj = null;
    this.stateActive = [];
    this.cityActive = [];

    this.countryId = value.id;
    this._countryService.getCountryByID(this.countryId)
      .subscribe(
        countryIDObj => {
          this.countryIDData = countryIDObj;
          // console.log(this.countryIDData);
          this.callingCodes = '+' + this.countryIDData.callingCodes;
          // console.log(this.callingCodes);
          this.code = this.countryIDData.currencies[0].symbol;
          this.currencies = this.countryIDData.currencies[0].symbol + this.countryIDData.currencies[0].code +
            '(' + this.countryIDData.currencies[0].name + ')';
        });
    this._countryService.getStatesByCountryId(this.countryId)
      .subscribe(
        stateObj => {
          // console.log(stateObj);
          this.stateObj = stateObj.states;
          if (this.stateObj.length > 0) {
            this.stateDisable = false;
          }
          this.stateData = [];
          for (let i = 0; i < this.stateObj.length; i++) {
            this.stateData.push({'id': this.stateObj[i]._id, 'text': this.stateObj[i].name});
          }
          this.stateObj = this.stateData;
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


  getStateId(value) {
    this.cityObj = null;
    this.cityActive = [];
    // this.Id = value.id;
    this._countryService.getCitiesByStateId(this.countryId, value.id)
      .subscribe(
        citiesObj => {
          // this.cityData = [];
          this.cityObj = citiesObj.cities;
          if (this.cityObj.length > 0) {
            this.cityDisable = false;
          }
          // for (let i = 0; i < this.stateObj.length; i++) {
          //   this.cityData.push({'id': this.cityObj[i]._id, 'text': this.cityObj[i].name});
          // }
          // this.cityObj = this.cityData;
        });
  }


  // GSTIN Example

  gstEx() {
    swal({
      title: 'GSTIN Example',
      // imageUrl: 'https://cdn.hrblock.in/uploads/sites/7/2017/11/gstin-structure1.jpg'
      imageUrl: 'https://www.basunivesh.com/wp-content/uploads/2017/07/Format-or-Structure-of-15-digit-GSTIN-Goods-and-Service-Tax-Identification-Number.jpg'
    });
  }

  // Ckeditor for privacy-policy & terms condition
  getckeditorcontent() {
    this._merchantService.getSLA()
      .subscribe(
        dataObj => {
          if (dataObj !== null) {
            this.slaObj = dataObj;
            for (let i = 0; i < this.slaObj.length; i++) {
              if (this.slaObj[i].key === 'privacy-policy') {
                this.privacy_policy = this.slaObj[i].data;
              }
              if (this.slaObj[i].key === 'toc') {
                this.terms_of_service = this.slaObj[i].data;
              }
            }
          }
        });
  }


  // Shop Schedule

  ShowButton() {
    this.showSelected = true;
    const AM = new Date();
    AM.setHours(10);
    AM.setMinutes(0);
    const PM = new Date();
    PM.setHours(22);
    PM.setMinutes(0);
    this.openTime = AM;
    this.closeTime = PM;
    this.isEnabled = false;
  }

  HideButton() {
    this.showSelected = false;
    const d = new Date();
    d.setHours(10);
    d.setMinutes(0);
    this.openTime = d;
    this.closeTime = d;
    this.isEnabled = true;
  }

  HideButton2() {
    this.showSelected = false;
    const AM = new Date();
    AM.setHours(10);
    AM.setMinutes(0);
    const PM = new Date();
    PM.setHours(22);
    PM.setMinutes(0);
    this.openTime = AM;
    this.closeTime = PM;
    this.isEnabled = false;
  }

  ///SLA
  addSLA(data) {
    // var a;
    // a = '{' + JSON.stringify(data.key) + ':' + '"' + data.value + '"' + '}';
    // console.log(a);
    this.addedSLA.push({
      key: data.key,
      value: data.value,
      show: true
    });


    for (let i = 0; i < this.SLADropdownValue.length; i++) {
      this.tmpexampleData1[i] = this.SLADropdownValue[i];
    }

    this.tmpexampleData1.push(data.key);

    this.SLADropdownValue = this.tmpexampleData1;
    this.SLAaddModal.hide();

    // console.log(this.SLADropdownValue);
    // console.log(this.tmpexampleData1);
  }

  SLASelected(value) {
    if (value.text === 'Delivery Time') {
      this.disdeliveryTime = false;
    }
    if (value.text === 'Special Offer') {
      this.disSpecialOffer = false;
    }
    if (value.text === 'Radius') {
      this.disRadius = false;
      this.disRadiusMeasure = false;
    }
    // if (value.text === 'RadiusMeasure') {
    //   this.disRadiusMeasure = false;
    // }
    if (value.text === 'Payment Type') {
      this.disPaymentType = false;
    }
    if (value.text === 'Order Placement') {
      this.disOrderPlacement = false;
    }
    if (value.text === 'Minimum order value') {
      this.disMinimumOrder = false;
    }

    if (this.addedSLA.length > 0) {
      for (let i = 0; i < this.addedSLA.length; i++) {
        if (this.addedSLA[i].key === value.text) {
          this.addedSLA[i].show = false;
        }

      }
    }
  }

  SLARemoved(value) {
    if (value.text === 'Delivery Time') {
      this.disdeliveryTime = true;
    }
    if (value.text === 'Special Offer') {
      this.disSpecialOffer = true;
    }
    if (value.text === 'Radius') {
      this.disRadius = true;
      this.disRadiusMeasure = true;
    }
    // if (value.text === 'RadiusMeasure') {
    //   this.disRadiusMeasure = true;
    // }
    if (value.text === 'Payment Type') {
      this.disPaymentType = true;
    }
    if (value.text === 'Order Placement') {
      this.disOrderPlacement = true;
    }
    if (value.text === 'Minimum order value') {
      this.disMinimumOrder = true;
    }
    if (this.addedSLA.length > 0) {
      for (let i = 0; i < this.addedSLA.length; i++) {
        if (this.addedSLA[i].key === value.text) {
          this.addedSLA[i].show = true;
        }

      }
    }
  }

  SLAData(value) {
    this.slaValue = value;
    // console.log(this.slaValue);
    if (value.length >= 4) {
      this.enableButton = false;
      this.disShownValue = true;
    }
  }

  enableButtonClick(){
    this.disShownValue = false;
    this.activeShownValue = [];
    this.disdeliveryTime = true;
    this.disSpecialOffer = true;
    this.disRadius = true;
    this.disRadiusMeasure = true;
    this.disPaymentType = true;
    this.disOrderPlacement = true;
    this.disMinimumOrder = true;
  }

  ////Add multiple number

  pushNumber(value) {
    // console.log(value);
    this.addedNumber.push({
      'name': value.name,
      'value': value.value,
      'isPrimary': false,
      'isWhatapp': false,
      'isOtp': false,
    });
    // console.log(this.addedNumber);
  }
  pushEmail(value) {
    // console.log(value);
    this.addedEmail.push({
      'value': value.value,
      'isPrimary': false,
    });
    // console.log(this.addedEmail);
  }

  NumberAdd() {
    this.mobadd.hide();
    this.toastr.success('Number Added Successfully', 'Success');
  }

  whatappClick(j) {
    for (let i = 0; i < this.addedNumber.length; i++) {
      if (i !== j) {
        this.addedNumber[i].isWhatapp = false;
      } else {
        this.addedNumber[i].isWhatapp = true;
      }
    }
  }
  otpClick(j) {
    for (let i = 0; i < this.addedNumber.length; i++) {
      if (i !== j) {
        this.addedNumber[i].isOtp = false;
      } else {
        this.addedNumber[i].isOtp = true;
      }
    }
  }
  primaryEmailClick(j) {
    for (let i = 0; i < this.addedEmail.length; i++) {
      if (i !== j) {
        this.addedEmail[i].isPrimary = false;
      } else {
        this.addedEmail[i].isPrimary = true;
      }
    }
  }

  callOnClick(j) {
    for (let i = 0; i < this.addedNumber.length; i++) {
      if (i !== j) {
        this.addedNumber[i].isPrimary = false;
      } else {
        this.addedNumber[i].isPrimary = true;
      }
    }
  }

  removeNumber(row, index) {
    this.addedNumber.splice(index, 1);

  }
  removeEmail(index) {
    this.addedEmail.splice(index, 1);

  }

  // Store Image Upload S3

  removeBanner(row, index) {
    this.storebanner.splice(index, 1);

  }

  dim(evt) {
    this.spinner.show();
    var that = this;
    this.files = evt.target.files;
    this.file = this.files[0];
    var _URL = window.URL;
    var s = this;
    var file, img;
    if ((file = this.file)) {
      img = new Image();
      img.onload = function () {
        if (this.height < 600 && this.width <= 1600) {
          that.spinner.hide();
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Image resolution must be (1600px X 600px)',
          });
          $('#tt').val('');
        } else {
          // s.imgvalid = true;
          s.uploadfileStore(file);

        }

      };

      img.src = _URL.createObjectURL(file);
    }
  }

  storeclick(j) {
    for (let i = 0; i < this.storebanner.length; i++) {
      if (i !== j) {
        this.storebanner[i].isPrimary = false;
      } else {
        this.storebanner[i].isPrimary = true;
      }
    }
  }

  uploadfileStore(value) {
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'merchant/Store/' + value.name, Body: value}, (err, data) => {
      this.docStoreImg = data.Key;
      if (this.docStoreImg !== undefined) {
        this.spinner.hide();
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.docStoreImg
        };
        new Promise((resolve, reject) => {
          s3.getSignedUrl('getObject', urlParams, (err2, url) => {
            this.url = url;
            this.storebanner.push({
              'url': this.url,
              'key': this.docStoreImg,
              'uploadedOn': new Date(),
              'isPrimary': false,
            });
          });
        });
      }
    });
  }

  // add document

  addDoc(name, value: any) {
    if (value !== null && this.docImg !== null) {
      this.documents.push({
        'url': this.url,
        'name': value.docname,
        'key': this.docImg,
        'verified': false
      });
      name.form.reset();
    } else {
      swal(
        'Oops...',
        'Please choose the Photo for Upload',
        'error');
    }
    this.documentModalAdd.hide();
    this.docImg = '';
    this.url = '';
  }

  fileSelect(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    this.uploadfile();
  }

  uploadfile() {
    this.spinner.show();
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'merchant/documents/' + this.file.name, Body: this.file}, (err, data) => {
      this.docImg = data.Key;
      if (this.docImg !== null) {
        this.spinner.hide();
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

  remove(row, index) {
    this.documents.splice(index, 1);
  }

  // add Social Media Details

  addSocial(value: any) {
    var date = new Date().toLocaleDateString();
    moment(date).format('MM/DD/YYYY');
    this.socialMedia.push({
      'name': value.pgname,
      'url': value.pgurl,
    });

    this.socialModalAdd.hide();

  }

  removeSocial(row, index) {
    this.socialMedia.splice(index, 1);
  }

  // add Bank Details

  addBank(value: any) {
    var date = new Date().toLocaleDateString();
    moment(date).format('MM/DD/YYYY');
    this.bankDetails.push({
      'country': value.bcountry[0].text,
      'name': value.bname,
      'accNo': value.accNo,
      'UPI': value.UPI,
      'IFSC': value.IFSC,
    });

    this.bankModalAdd.hide();


  }

  removeBank(row, index) {
    this.bankDetails.splice(index, 1);
  }


  // Form required validation

  submitFormCheck() {
    if (!this.email.valid) {
      this.toastr.error('Email Required!', 'Error', {timeOut: 5000,});
    }

    if (!this.password.valid) {
      this.toastr.error('Password Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.confirmPassword.valid) {
      this.toastr.error('ConfirmPassword Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.mobileNumber.valid) {
      this.toastr.error('Mobile Number Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.firstName.valid) {
      this.toastr.error('First Name Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.lastName.valid) {
      this.toastr.error('Last Name Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.gender.valid) {
      this.toastr.error('Gender Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.dob.valid) {
      this.toastr.error('Date of Establishment Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.merType.valid) {
      this.toastr.error('Merchant Type Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.name.valid) {
      this.toastr.error('Shop Name Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.aadharCard.valid) {
      this.toastr.error('Invalid Aadhar Card Number!', 'Error', {timeOut: 5000,});
    }
    if (!this.gst.valid) {
      this.toastr.error('Invalid GSTIN Number format!', 'Error', {timeOut: 5000,});
    }
    if (!this.country.valid) {
      this.toastr.error('Country Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.State.valid) {
      this.toastr.error('State Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.City.valid) {
      this.toastr.error('City Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.Address1.valid) {
      this.toastr.error('Address Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.landmark.valid) {
      this.toastr.error('Landmark Required!', 'Error', {timeOut: 5000,});
    }
    if (!this.radio1.valid) {
      this.toastr.error('Shop Schedule Required!', 'Error', {timeOut: 5000,});
      // if (!this.days.valid) {
      //   this.toastr.error('Closed On Days Required!', 'Error', {timeOut: 5000,});
      // }
    }
    if (!this.postalCode.valid) {
      this.toastr.error('Pincode Required!', 'Error', {timeOut: 5000,});
    }
    // if (!this.deliveryTime.valid) {
    //   this.toastr.error('Delivery Time Required!', 'Error', {timeOut: 5000,});
    // }
    // if (!this.vrm.valid) {
    //   this.toastr.error('Radius Measure Required!', 'Error', {timeOut: 5000,});
    // }
    // if (!this.paymentType.valid) {
    //   this.toastr.error('Payment Type Required!', 'Error', {timeOut: 5000,});
    // }
    // if (!this.orderPlacement.valid) {
    //   this.toastr.error('Order Placement Required!', 'Error', {timeOut: 5000,});
    // }
    // if (!this.minimumOrder.valid) {
    //   this.toastr.error('Minimum Order Required!', 'Error', {timeOut: 5000,});
    // }

  }

  // get lat lng & geoAddress

  getGeoAddress(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this._geoLoacation.getAddress(this.lat, this.lng).subscribe(
      result => {
        if (result.status === 'OK') {
          this.geoAddress = result.results[0].formatted_address;
        }
      }
    );
  }

  getAdd(add) {
    this._geoLoacation.getAddress2(add).subscribe(
      result => {
        if (result.status === 'OK') {
          this.lat = result.results[0].geometry.location.lat;
          this.lng = result.results[0].geometry.location.lng;
          this.geoAddress = result.results[0].formatted_address;
        }
      }
    );
  }

  getLatLng(value) {
    this.lat = value.coords.lat;
    this.lng = value.coords.lng;
    this.getGeoAddress(this.lat, this.lng);
  }

  // Mobile number validation
  mobileCheck(mobNo) {
    if (mobNo !== '' && mobNo.length === 10) {
      this.addedNumber.splice(0, 1, {
        'name': 'Primary',
        'value': mobNo,
        'isPrimary': true,
        'isWhatapp': true,
        'isOtp': true
      });
      this._merchantService.getNumbers(mobNo)
        .subscribe(
          result => {
            if (result.length !== 0) {
              swal(
                'Oops...',
                'Mobile Number Is Exist!',
                'error');
            }
          }
        );
      this.mobNo = mobNo;
      this.whatNo = mobNo;
      this.showSelected1 = false;
      this.showSelected2 = true;
      this.enablemob = false;
    }
    else if (mobNo === '') {
      this.enablemob = true;
    }
  }

  // email check
  emailCheck(email) {
    if (email !== '' && this.email.valid) {
      this.addedEmail.splice(0, 1, {
        'value': email,
        'isPrimary': true,
      });
      this._merchantService.getEmails(email)
        .subscribe(
          result => {
            if (result.length !== 0) {
              swal(
                'Oops...',
                'User Name Is Exist!',
                'error');
            }
          }
        );
      this.enablemail = false;
    }
    else if (email === '') {
      this.enablemail = true;
    }
  }

  EmailAdding(value) {
    this.addedEmail.push({
      'value': value.email,
      'isPrimary': false,
    });
    // console.log(this.addedEmail);
  }

  // password 8 character validation

  passcheck(password) {
    if (password.length < 8 && password.length > 0) {
      swal(
        'Oops...',
        'Password must be atleast 8 Character!',
        'error');
    }
  }

  // gstCheck(gstNo) {
  // if(gstNo !== null) {
  //   var regex = new RegExp('/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}?$/');
  //   var test = gstNo.match(regex);
  //   console.log(test);
  //   if (test === null) {
  //     swal(
  //       'Oops...',
  //       'Valid No plz!',
  //       'error');
  //   } else {
  //     swal(
  //       'Hahaha...',
  //       'Valid No',
  //       'success');
  //   }
  // }
  // }

  abc(value) {
    // console.log(value);
    this.locaaal = value;
  }

  // Add new merchant

  addMerchant(value: any) {
    // console.log(value);
    // if(value.shownValue.length > 0 ){
    //   for(let i = 0; i < value.shownValue.length; i++ ){
    //     value.sla.shownValue = value.shownValue[i].text;
    //   }
    // }

    if(value.deliveryTime === undefined) {
      value.deliveryTime = 1;
    }
    if (this.locaaal !== undefined) {
      value.abc = this.locaaal
    } else {
      value.abc = 'Local';
    }
    value.userName = value.email;
    if (value.lat !== undefined && value.lng !== undefined) {
      value.loc = [value.lng, value.lat];
    }

    if (this.countryIDData.currencies.length !== 0) {
      this.a.push({
        'currencyCode': this.countryIDData.currencies[0].code,
        'currencyName': this.countryIDData.currencies[0].name,
        'currencySymbol': this.countryIDData.currencies[0].symbol
      });
      value.currency = this.a[0];
      if (this.a.length > 0) {
        delete this.a[0];
      }
      // if (value.countryCurrency === 'INR') {
      //   this.a.push({
      //     'currencyCode': 'INR',
      //     'currencyName': 'Indian Rupees',
      //     'currencySymbol': '₹'
      //   });
      // }
      // if (value.countryCurrency === 'GBP') {
      //   this.a.push({
      //     'currencyCode': 'GBP',
      //     'currencyName': 'Pound Sterling',
      //     'currencySymbol': '£'
      //   });
      // }
      // if (value.countryCurrency === 'USD') {
      //   this.a.push({
      //     'currencyCode': 'USD',
      //     'currencyName': 'US Dollar',
      //     'currencySymbol': '$'
      //   });
      // }
      // if (value.countryCurrency === 'CAD') {
      //   this.a.push({
      //     'currencyCode': 'CAD',
      //     'currencyName': 'Canadian Dollar',
      //     'currencySymbol': '$'
      //   });
      // }
      // if (value.countryCurrency === 'AUD') {
      //   this.a.push({
      //     'currencyCode': 'AUD',
      //     'currencyName': 'Australian Dollar',
      //     'currencySymbol': '$'
      //   });
      // }

    }

    if (this.countryIDData.timezones.length !== 0) {
      value.timezones = this.countryIDData.timezones;
    }


    if (value.dob === null) {
      delete value.dob;
    } else {
      value.dob = moment(value.dob).format('MM/DD/YYYY');
      value.dob = moment(value.dob).format('l LT');
    }
    if (value.category !== undefined) {
      // delete value.category[0].text;
      value.category = value.category[0].id;
    }
    if (value.country !== undefined) {
      delete value.country[0].id;
      value.country = value.country[0].text;
    }
    if (value.days !== undefined) {
      for (let i = 0; i < value.days.length; i++) {
        delete value.days[i].id;
        value.days[i] = value.days[i].text;
      }
    }
    if (value.bname !== undefined || value.bcountry !== undefined || value.accNo !== undefined || value.UPI !== undefined ||
      value.IFSC !== undefined) {
      this.bankDetails.push({
        'name': value.bname,
        'country': value.bcountry,
        'accNo': value.accNo,
        'UPI': value.UPI,
        'IFSC': value.IFSC,
      });
      delete value.bname;
      delete value.bcountry;
      delete value.accNo;
      delete value.UPI;
      delete value.IFSC;
    }
    if (value.address1 !== undefined || value.city !== undefined || value.state !== undefined || value.postalCode !== undefined) {
      this.Address.push({
        'address1': value.Address1,
        'city': value.City[0].text,
        'state': value.State[0].text,
        'postalCode': value.postalCode,
      });
      // console.log(this.Address[0]);
    }
    if (value.days !== undefined || value.openTime !== undefined || value.closeTime !== undefined) {
      moment(value.openTime).format('MM/DD/YYYY');
      moment(value.openTime).format('l LT');
      moment(value.closeTime).format('MM/DD/YYYY');
      moment(value.closeTime).format('l LT');
      if (value.radio1 !== '24x7') {
        if (value.radio1 === 'ClosedOn') {
          this.shopschedule.push({
            'days': value.days,
            'hrs24': false,
            'openingTime': value.openTime,
            'closingTime': value.closeTime
          });
        } else {
          this.shopschedule.push({
            'hrs24': false,
            'openingTime': value.openTime,
            'closingTime': value.closeTime
          });
        }
      } else {
        this.shopschedule.push({
          'hrs24': true,
        });
      }
      value.shopSchedule = this.shopschedule[0];
      delete value.openTime;
      delete value.closeTime;
      delete value.days;
      delete value.radio1;
    }


    value.sla = this.addedSLA;

    if(this.slaValue.length > 0){
      this.tmpexampleData = [];
      for(let i = 0; i< this.slaValue.length; i++){
        // console.log(this.slaValue[i]);
        this.tmpexampleData.push(this.slaValue[i].text);
      }
      value.slashow =  this.tmpexampleData;
    }



    value.address = this.Address[0];
    // Social Media
    value.social_media = this.socialMedia;
    value.documents = this.documents;
    value.bankDetails = this.bankDetails;
    // Store Image
    value.storeImage = this.storebanner;
    value.phone = this.addedNumber;
    value.secondaryEmail = this.addedEmail;
    value.registered_by = this.empId;
    value.type = 'Merchant';
    value.created_by = 'Web';
    // console.log(value);
    this._merchantService.postMerchant(value)
      .subscribe(
        result => {
          if (result.success === true) {
            this.toastr.success('Your Records are Save Successfully!', 'Good job!');
            this.router.navigate(['merchant/search']);
          }
        }
      );

  }

  // All Modal Opening function
  TC(template: any) {
    template.show();
    template.ignoreBackdropClick = !template.ignoreBackdropClick;
  }

  PP(template: any) {
    template.show();
    template.ignoreBackdropClick = !template.ignoreBackdropClick;
  }

  REP(template: any) {
    template.show();
    template.ignoreBackdropClick = !template.ignoreBackdropClick;
  }

  RP(template: any) {
    template.show();
    template.ignoreBackdropClick = !template.ignoreBackdropClick;
  }

  mobAdd(template: TemplateRef<any>) {
    this.mobadd = this.modalService.show(template);
  }
  emailAdd(template: TemplateRef<any>) {
    this.mailAdd = this.modalService.show(template);
  }

  mobaddhide() {
    this.mobadd.hide();
  }

  SMM(template: TemplateRef<any>) {
    this.socialModalAdd = this.modalService.show(template);
  }

  DMM(template: TemplateRef<any>) {
    this.documentModalAdd = this.modalService.show(template);
  }

  SLA(template: TemplateRef<any>) {
    this.SLAaddModal = this.modalService.show(template);
  }

  BDM(template: TemplateRef<any>) {
    this.bankModalAdd = this.modalService.show(template);
  }
}

