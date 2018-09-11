import {Component, OnInit, ViewChildren, ViewChild, TemplateRef, AfterViewInit, QueryList} from '@angular/core';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {GeoLocation} from '../../Shared/services/geoLocation';
import {CategoryServices} from '../../Shared/services/category.services';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';

import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import {environment} from '../../../environments/environment';
import * as AWS from 'aws-sdk';
import {CountryService} from '../../Shared/services/country.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'managemerchant',
  templateUrl: 'managemerchant.template.html',
  styleUrls: ['merchant.component.css'],
  providers: [MerchantServices, GeoLocation, CategoryServices, CountryService]
})
export class ManagemerchantComponent implements OnInit, AfterViewInit {


  @ViewChild('myInput')
  myInputVariable: any;

  @ViewChild('Record')
  Record: any;

  @ViewChild('Closeddays')
  Closeddays: any;


  @ViewChild('Docname')
  myInputVariable2: any;

  @ViewChildren(DataTableDirective)
  _dtElements: QueryList<DataTableDirective>;

  public lat: any;
  public cat: any;
  public lng: any;
  public title: any;
  public addMobile = true;
  public updateMobile = false;
  public bankDetails: Array<any> = [];
  public merCat: Array<any> = [];
  public socialMedia: Array<any> = [];
  public tmpexampleData: Array<any> = [];
  public ngxQrcode2: any;
  public documents: Array<any> = [];
  public geoAddress: any;
  public selectedOption: number;
  dtOptions: any = {};
  _dtTrigger: any = new Subject();
  public zoomM = 15;
  public merchantObj: any;
  public slaObj: any;
  public remark: any;
  public catObj: any;
  public sub: any;
  public _id: String;
  public files: any;
  public file: any;
  public docImg: string;
  public maxDate: Date;
  public socialModalAdd: BsModalRef;
  public socialModalEdit: BsModalRef;
  public mobadd: BsModalRef;
  public TnC: BsModalRef;
  public PnP: BsModalRef;
  public RnE: BsModalRef;
  public RnP: BsModalRef;
  public EmailAdd: BsModalRef;
  public bankModalAdd: BsModalRef;
  public BankModalEdit: BsModalRef;
  public callingCodes: string;
  // country Management
  public countryIDData: any;
  public stateIDData: any;
  public countryId: any;
  public currencies: any;
  public timezone: any;
  public code = '₹';
  public stateId: any;
  public countryData: Array<any> = [];
  public stateData: Array<any> = [];
  public cityData: Array<any> = [];
  public Address: Array<any> = [];
  public countryShow: Array<any> = [];
  public stateShow: Array<any> = [];
  public cityShow: Array<any> = [];
  public countryObj: any;
  public stateObj: any;
  public cityObj: any;
  public stateDisable = false;
  public cityDisable = false;
  public defSocialURL: string;
  // Variation
  public VarattributeData: Array<string> = [];
  public VarattributeHeader: Array<string> = [];

  public documentModalAdd: BsModalRef;
  public SLAaddModal: BsModalRef;
  public documentModalEdit: BsModalRef;
  public currency: any;
  public terms_of_service: any;
  public privacy_policy: any;
  public refund_policy: any;
  public return_policy: any;
  public showSelected: any;
  public openTime: any;
  public closeTime: any;
  public isEnabled: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public mdEdit = true;
  public bdEdit = true;
  public sdEdit = true;
  public ssEdit = true;
  public smEdit = true;
  public bankdEdit = true;
  public dmEdit = true;
  public siEdit = true;
  public pEdit = true;
  public crmEdit = true;
  public utEdit = true;
  public verEdit = true;
  public appEdit = true;
  public geoEdit = true;
  public delete = true;
  public empId: any;
  public emp: any;

  public daysList: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'];
  public tags: Array<string>;
  public shopSchedule: Array<any> = [];
  public a = [];
  public app: Array<any> = [];
  public rej: Array<any> = [];
  public upShopSchedule: Array<any> = [];
  public selectedDays: Array<string> = [];
  public Otime: any;
  public Ctime: any;
  public mob = false;
  public verified = false;
  public plusmob = true;
  public minusmob = false;
  public firstshow = false;
  public secondshow = false;
  public days: Array<string> = [];
  public addedNumber: Array<any> = [];
  public addedEmail: Array<any> = [];
  public hidetime = true;
  public ohour: any;
  public omin: any;
  public chour: any;
  public cmin: any;
  public url: string;
  public phone: Array<any> = [];
  public storebanner: Array<any>;
  public docStoreImg: any;
  public abc: any;
  public socialEdit: any;
  public bankEdit: any;
  public documentEdit: any;
  public mobileEdit: any;
  public currentTime: any;
  public callRecord: any;
  public bankCountryActive: Array<string> = [];
  public visibilityRadius: any;
  public SLA: Array<any> = [];
  public addedSLA: Array<any> = [];
  public disdeliveryTime = false;
  public disSpecialOffer = false;
  public disRadius = false;
  public disRadiusMeasure = false;
  public disPaymentType = false;
  public disOrderPlacement = false;
  public disMinimumOrder = false;
  public tmpexampleData1: Array<any> = [];
  public activeShownValue: Array<string> = [];
  public SLADropdownValue: Array<any> = [];
  public slaValue: Array<any> = [];
  public enableButton = true;
  public disShownValue = false;
  public callRecordData: Array<any> = [];
  public CallKey: any;
  public emailEdit: any;
  public addEmail = true;
  public updateEmail = false;
  public viewMerchant: any;
  public loadingtext: any;
  public primaryEmail: any;


  constructor(private _merchantService: MerchantServices,
              private _countryService: CountryService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private _categoryService: CategoryServices,
              private route: ActivatedRoute, private sanitizer: DomSanitizer,
              private _geoLoacation: GeoLocation, private modalService: BsModalService) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

  }

  get dtTrigger(): any {
    return this._dtTrigger;
  }

  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  ngOnInit() {
    // console.log(moment().format());
    window.scrollTo(0, 0);
    this.currentTime = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
    this.defSocialURL = 'https://';
    const eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          this.emp = res[0];
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
                if (this.empRights[i].name === 'MerchantDetails') {
                  this.mdEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'BusinessDetails') {
                  this.bdEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'ServiceDetails') {
                  this.sdEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'ShopSchedule') {
                  this.ssEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'SocialMedia') {
                  this.smEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'BankDetails') {
                  this.bankdEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'DocumentManagement') {
                  this.dmEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'StoreImage') {
                  this.siEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'GeoLocation') {
                  this.geoEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'Policy') {
                  this.pEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'CRM') {
                  this.crmEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'Utility') {
                  this.utEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'Verification') {
                  this.verEdit = this.empRights[i].edit;
                }
                if (this.empRights[i].name === 'ApprovedManagement') {
                  this.appEdit = this.empRights[i].edit;
                }


              }
            }
          }


        });

    // this.tags = ['abc', 'xyz', 'pqr'];
    this.dtOptions = {
      dom: 'l<"pull-right"B>frtip',
      // processing: true,
      // Configure the buttonslfrtiplfrtip
      buttons: [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ]
    };

    this._countryService.getCountry()
      .subscribe(
        countryObj => {
          this.countryObj = countryObj;
          // console.log(this.countryObj);
          this.countryData = [];
          for (let i = 0; i < this.countryObj.length; i++) {
            this.countryData.push({'id': this.countryObj[i]._id, 'text': this.countryObj[i].name});
          }
          this.countryObj = this.countryData;
        });

    this.docImg = null;
    this._categoryService.getCategoryName()
      .subscribe(
        categoryObj => {
          this.catObj = categoryObj;
          for (let i = 0; i < this.catObj.length; i++) {
            this.tmpexampleData.push({'id': this.catObj[i]._id, 'text': this.catObj[i].name});
          }
          this.catObj = this.tmpexampleData;
        });
    this.getMerchantById();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
  } // ngOnInt Closed here.


  // get merchant data with ID

  getMerchantById() {
    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this.viewMerchant = params['edit'];
      // console.log(this.viewMerchant);
      if (this.viewMerchant === 'view') {
        this.edit = false;
      }
      this._merchantService.getMerchant(this._id)
        .then(
          (merchantData => {
            if (merchantData !== null) {
              this.merchantObj = merchantData;
              // console.log(this.merchantObj);
              if (this.merchantObj.sla !== undefined) {
                this.SLA = this.merchantObj.sla;
                // console.log(this.SLA);
                this.SLADropdownValue =
                  ['Delivery Time', 'Special Offer', 'Radius', 'Payment Type', 'Order Placement', 'Minimum order value'];
                for (let i = 0; i < this.SLA.length; i++) {
                  this.SLADropdownValue.push(this.SLA[i].key);
                }
              }

              for (let i = 0; i < this.merchantObj.sla; i++) {
                this.SLA[i].show = true;
              }
              if (this.merchantObj.slashow !== undefined) {
                this.activeShownValue = this.merchantObj.slashow;
                // console.log(this.activeShownValue);
                if (this.activeShownValue.length >= 4) {
                  this.disShownValue = true;
                  this.enableButton = false;
                }

                for (let i = 0; i < this.activeShownValue.length; i++) {
                  if (this.activeShownValue[i] === 'Delivery Time') {
                    this.disdeliveryTime = false;
                  }
                  if (this.activeShownValue[i] === 'Special Offer') {
                    this.disSpecialOffer = false;
                  }
                  if (this.activeShownValue[i] === 'Radius') {
                    this.disRadius = false;
                    this.disRadiusMeasure = false;
                  }
                  // if (this.activeShownValue[i] === 'RadiusMeasure') {
                  //   this.disRadiusMeasure = false;
                  // }
                  if (this.activeShownValue[i] === 'Payment Type') {
                    this.disPaymentType = false;
                  }
                  if (this.activeShownValue[i] === 'Order Placement') {
                    this.disOrderPlacement = false;
                  }
                  if (this.activeShownValue[i] === 'Minimum order value') {
                    this.disMinimumOrder = false;
                  }

                  for (let j = 0; j < this.SLA.length; j++) {
                    if (this.activeShownValue[i] === this.SLA[j].key) {
                      this.SLA[j].show = false;
                    }
                  }
                }

              }
              if (this.merchantObj.tags !== undefined) {
                this.tags = this.merchantObj.tags;
              }
              // console.log(this.merchantObj.approvedBy);
              // if (this.merchantObj.approvedBy !== undefined) {
              //   this.tags = this.merchantObj.tags;
              // }
              if (this.merchantObj.visibilityRadius === null) {
                this.merchantObj.visibilityRadius = 1;
              }
              if (this.merchantObj.callRecord !== undefined) {
                const awsConfig = new AWS.Config({
                  accessKeyId: environment.awsAccessKey,
                  secretAccessKey: environment.awsSecretKey,
                  region: environment.awsRegion,
                });
                const s3 = new AWS.S3(awsConfig);
                for (let i = 0; i < this.merchantObj.callRecord.length; i++) {
                  // console.log(this.merchantObj.callRecord[i].key);
                  if (this.merchantObj.callRecord[i].key !== null) {
                    // console.log('as');
                    const urlParams = {
                      Bucket: 'jhakaas-docs',
                      Key: this.merchantObj.callRecord[i].key
                    };
                    new Promise((resolve, reject) => {
                      s3.getSignedUrl('getObject', urlParams, (err, url) => {
                        this.url = url;
                        this.merchantObj.callRecord[i].key = this.url;
                        if (err) reject(err);
                        else resolve(url);
                      });
                    });
                  }

                }
                this.callRecordData = this.merchantObj.callRecord;
              }
              if (this.merchantObj.loc !== undefined) {
                this.lat = this.merchantObj.loc[1];
                this.lng = this.merchantObj.loc[0];
                // this.getGeoAddress(this.lat, this.lng);
              }
              if (this.merchantObj.landmark !== undefined) {
                this.geoAddress = this.merchantObj.landmark;
                // this.getGeoAddress(this.lat, this.lng);
              }
              if (this.merchantObj.dob !== undefined) {
                // console.log(this.merchantObj.dob);
                this.merchantObj.dob = moment(this.merchantObj.dob).utc(this.merchantObj.dob).format('llll');
                // console.log(this.merchantObj.dob);
              }
              // console.log(this.SLA);
              // this.ngxQrcode2 = JSON.stringify(this.merchantObj.mobileNumber);
              this.ngxQrcode2 = this.merchantObj.mobileNumber;
              this.title = this.merchantObj.name;
              this.merCat = [];
              if (this.merchantObj.category !== undefined) {
                this.merCat.push({'id': this.merchantObj.category._id, 'text': this.merchantObj.category.name});
              } else {
                this.merCat.push({'id': '', 'text': ''});
              }

              // Country Management In ngOnInit
              // console.log(this.merchantObj);
              this.currencies = this.merchantObj.currency.currencySymbol +
                this.merchantObj.currency.currencyCode + '(' + this.merchantObj.currency.currencyName + ')';
              // console.log(this.currencies);
              this.timezone = this.merchantObj.timezones;
              this.code = this.merchantObj.currency.currencySymbol;
              // if (this.merchantObj.country !== undefined) {
              //   this.countryShow.push({'id': this.merchantObj.country, 'text': this.merchantObj.country});
              // } else {
              //   this.countryShow.push({'id': '', 'text': ''});
              // }
              this.countryShow = this.merchantObj.country;
              this._countryService.getCountryByName(this.countryShow)
                .subscribe(
                  countryoIDObj => {
                    this.countryId = countryoIDObj;
                    this.countryId = this.countryId[0]._id;
                    this._countryService.getCountryByID(this.countryId)
                      .subscribe(
                        countryIDObj => {
                          this.countryIDData = countryIDObj;
                          this.callingCodes = '+' + this.countryIDData.callingCodes;
                        });

                    this._countryService.getStatesByCountryId(this.countryId)
                      .subscribe(
                        stateObj => {
                          this.stateObj = stateObj.states;
                          this.stateData = [];
                          for (let i = 0; i < this.stateObj.length; i++) {
                            this.stateData.push({'id': this.stateObj[i]._id, 'text': this.stateObj[i].name});
                          }
                          this.stateObj = this.stateData;
                          if (this.stateObj.length !== 0) {
                            for (let i = 0; i < this.stateObj.length; i++) {
                              if (this.merchantObj.hasOwnProperty('address')) {
                                if (this.merchantObj.address.hasOwnProperty('state')) {
                                  if (this.stateObj[i].text === this.merchantObj.address.state) {
                                    this._countryService.getCitiesByStateId(this.countryId, this.stateObj[i].id)
                                      .subscribe(
                                        citiesObj => {
                                          this.cityObj = citiesObj.cities;
                                        });
                                  }
                                }
                              }
                            }
                          }
                        });
                  });

              if (this.merchantObj.hasOwnProperty('address')) {
                if (this.merchantObj.address.hasOwnProperty('state')){
                  this.stateShow = this.merchantObj.address.state;
                }
                if (this.merchantObj.address.hasOwnProperty('city')){
                  this.cityShow = this.merchantObj.address.city;
                }
              }

              if (this.merchantObj.return_policy !== null ||
                this.merchantObj.refund_policy !== null ||
                this.merchantObj.privacy_policy !== null ||
                this.merchantObj.terms_of_service !== null) {
                this.return_policy = this.merchantObj.return_policy;
                this.refund_policy = this.merchantObj.refund_policy;
                this.privacy_policy = this.merchantObj.privacy_policy;
                this.terms_of_service = this.merchantObj.terms_of_service;
              } else {
                this.getckeditorcontent();
              }
              this.socialMedia = this.merchantObj.social_media;
              this.documents = this.merchantObj.documents;
              this.storebanner = this.merchantObj.storeImage;
              this.bankDetails = this.merchantObj.bankDetails;
              this.shopSchedule = this.merchantObj.shopSchedule;

              if (this.merchantObj.phone.length > 0) {
                this.addedNumber = this.merchantObj.phone;
                console.log(this.merchantObj.phone);
                for ( let p = 0; p < this.merchantObj.phone.length; p++) {
                  if (this.merchantObj.phone[p].isPrimary === true) {
                    this.merchantObj.primaryMobile = this.merchantObj.phone[p].value;
                  }
                }
                // console.log(this.addedNumber);
              } else {
                this.addedNumber = [];
                this.addedNumber.push({
                  'name': 'Primary',
                  'value': this.merchantObj.mobileNumber,
                  'isPrimary': true,
                  'isWhatapp': true,
                  'isOtp': true,
                });
                this._merchantService.addMobileNumber(this._id, JSON.stringify(this.addedNumber[0]))
                  .subscribe(
                    data => {
                      if (data.length !== 0) {
                        // this.getMerchantById();
                        // this.toastr.success('Mobile Number Added Successfully');
                      }
                    }
                  );
              }

              // console.log(this.merchantObj.phone);
              if (this.merchantObj.secondaryEmail.length > 0) {
                for ( let em = 0; em < this.merchantObj.secondaryEmail.length; em++) {
                  if (this.merchantObj.secondaryEmail[em].isPrimary === true) {
                    this.primaryEmail = this.merchantObj.secondaryEmail[em].value;
                  }
                }
                this.addedEmail = this.merchantObj.secondaryEmail;
              } else {
                this.addedEmail = [];
                this.addedEmail.push({
                  'value': this.merchantObj.email,
                  'isPrimary': true
                });
                this._merchantService.addEmailID(this._id, JSON.stringify(this.addedEmail[0]))
                  .subscribe(
                    data => {
                      if (data.length !== 0) {
                        // this.getMerchantById();
                        // this.toastr.success('Email Added Successfully');
                      }
                    }
                  );
              }
              this.merCat = this.merCat[0];
              this.timing(this.shopSchedule);
              this.status(this.merchantObj.status);
              // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              //   // Destroy the table first
              //   dtInstance.destroy();
              //   // Call the dtTrigger to rerender again
              //   this._dtTrigger.next();
              // });
            }

            if (this.storebanner !== null) {
              var awsConfig = new AWS.Config({
                accessKeyId: environment.awsAccessKey,
                secretAccessKey: environment.awsSecretKey,
                region: environment.awsRegion,
              });
              const s3 = new AWS.S3(awsConfig);
              for (let i = 0; i < this.storebanner.length; i++) {
                const urlParams = {
                  Bucket: 'jhakaas-docs',
                  Key: this.storebanner[i].key
                };
                new Promise((resolve, reject) => {
                  s3.getSignedUrl('getObject', urlParams, (err, url) => {
                    this.url = url;
                    this.storebanner[i].url = this.url;
                    if (err) reject(err);
                    else resolve(url);
                  });
                });
              }

            }
            if (this.documents !== null) {
              const s3 = new AWS.S3(awsConfig);
              for (let i = 0; i < this.documents.length; i++) {
                const urlParams = {
                  Bucket: 'jhakaas-docs',
                  Key: this.documents[i].key
                };
                new Promise((resolve, reject) => {
                  s3.getSignedUrl('getObject', urlParams, (err, url) => {
                    this.url = url;
                    this.documents[i].url = this.url;
                    if (err) reject(err);
                    else resolve(url);
                  });
                });
              }
            }
          })
        )
        .catch(error => console.log(error));
    });
  }


  // to get country data
  getCountryId(value) {
    this.stateObj = null;
    this.cityObj = null;
    this.countryId = value.id;
    this._countryService.getCountryByID(this.countryId)
      .subscribe(
        countryIDObj => {
          this.countryIDData = countryIDObj;
          this.code = this.countryIDData.currencies[0].symbol;
          this.timezone = this.countryIDData.timezones;
          this.callingCodes = '+' + this.countryIDData.callingCodes;
          this.currencies = this.countryIDData.currencies[0].symbol +
            this.countryIDData.currencies[0].code + '(' + this.countryIDData.currencies[0].name + ')';
        });
    this._countryService.getStatesByCountryId(this.countryId)
      .subscribe(
        stateObj => {
          this.stateObj = stateObj.states;
          if (this.stateObj.length === 0) {
            this.stateDisable = true;
          }else {
            this.stateData = [];
            for (let i = 0; i < this.stateObj.length; i++) {
              this.stateData.push({'id': this.stateObj[i]._id, 'text': this.stateObj[i].name});
            }
            this.stateObj = this.stateData;
          }

        });
  }

  // to get state data
  getStateId(value) {
    // this.Id = value.id;
    this._countryService.getCitiesByStateId(this.countryId, value.id)
      .subscribe(
        citiesObj => {
          this.cityObj = citiesObj.cities;
          // console.log(this.cityObj);
          if (this.cityObj.length === 0) {
            this.cityShow = value.text;
            this.cityDisable = true;
          } else {
            this.cityDisable = false;
            swal('Warning', 'Please Update City also.', 'warning');

          }
          // for (let i = 0; i < this.stateObj.length; i++) {
          //   this.cityData.push({'id': this.cityObj[i]._id, 'text': this.cityObj[i].name});
          // }
          // this.cityObj = this.cityData;
        });
  }


  // reRender(): void {
  //   this._dtElements.forEach((dtElement: DataTableDirective) => {
  //     dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       // Destroy the table first
  //       dtInstance.destroy();
  //       // Call the dtTrigger to rerender again
  //       this._dtTrigger.next();
  //     });
  //   });
  // }

  // Banner Image
  // fileSelectStore(evt) {
  //   this.files = evt.target.files;
  //   this.file = this.files[0];
  //   this.uploadfileStore();
  // }


  // privacy policay & terms conditions data
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

  // print QR Code
  printqr() {
    const content = document.getElementById('printqr').innerHTML;
    const mywindow = window.open('', 'Print', 'height=600,width=800');

    mywindow.document.write('<html><head><title>Print</title>');
    mywindow.document.write('</head><body>');
    mywindow.document.write('<label>QR Code:</label>');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
    return true;
  }


  // number input disable funtion
  preventNumberInput(e) {
    const keyCode = (e.keyCode ? e.keyCode : e.which);
    if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107) {
      e.preventDefault();
    }
  }

  // Store Image upoload function
  dim(evt) {
    const that = this;
    this.files = evt.target.files;
    this.file = this.files[0];
    this.loadingtext = 'Please Wait... Uploading Image!';
    this.spinner.show();
    const _URL = window.URL;
    const s = this;
    let file, img;
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

  uploadfileStore(value) {
    const awsConfig = new AWS.Config({
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

  storeclick(j) {
    for (let i = 0; i < this.storebanner.length; i++) {
      if (i !== j) {
        this.storebanner[i].isPrimary = false;
      } else {
        this.storebanner[i].isPrimary = true;
      }
    }
  }

  saveStore() {
    const store = [];
    store.push({
      storeImage: this.storebanner
    });
    const name = 'StoreImage';
    this.update_Merchant(name, store[0]);
  }

  removestore(row, index) {

    const that = this;
    const that1 = this;
    swal({
      title: 'Are you sure?',
      text: 'To Delete the Store Image!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      that.storebanner.splice(index, 1);
      that.saveStore();
      swal(
        'Deleted!',
        'Your Store Image.',
        'success'
      );
      that.documents.splice(index, 1);
    }).catch(function () {
      swal(
        'Safe!',
        'Your Store Image is Safe!',
        'success'
      );
    });
    ;

  }

  // phone number add function
  pushNumber(value) {
    // console.log(value);
    // if (that.m.hasOwnProperty('key')) {}
    // this.addedNumber.push({
    //   'name': value.name,
    //   'value': value.value,
    //   'isPrimary': false,
    //   'isWhatapp': false,
    //   'isOtp': false,
    // });
    // console.log(this.addedNumber);
    value.isPrimary = false;
    value.Otp = false;
    value.isWhatapp = false;
    const putdata = value;
    this._merchantService.addMobileNumber(this._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.getMerchantById();
            this.toastr.success('Mobile Number Added Successfully');
          }
        }
      );
  }

  pushEmail(value) {
    // console.log(value);
    value.value = value.email;
    value.isPrimary = false;
    const putdata = value;
    this._merchantService.addEmailID(this._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.getMerchantById();
            this.toastr.success('Email Added Successfully');
          }
        }
      );
  }

  NumberAdd(value) {
    // console.log(this.mobileEdit);
    // console.log(value);
    this.mobadd.hide();
    const putdata = value;
    this._merchantService.updateMobileNumber(this._id, this.mobileEdit._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.getMerchantById();
            this.toastr.success('Mobile Number Edited Successfully');
          }
        }
      );
  }

  callOnClick(j) {
    for (let i = 0; i < this.addedNumber.length; i++) {
      if (i !== j) {
        this.addedNumber[i].isPrimary = false;
      } else {
        this.merchantObj.primaryMobile = this.addedNumber[i].value;
        this.addedNumber[i].isPrimary = true;
      }
    }
    // console.log(this.addedNumber);
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

  updateMobileClick() {
    this._merchantService.updatemobile(this._id, this.addedNumber)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success('Updated Successfully');
            this.mobaddhide();
          }
        }
      );
  }

  updateEmailClick() {
    this._merchantService.updateemail(this._id, this.addedEmail)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success('Updated Successfully');
            this.EmailAdd.hide();
          }
        }
      );
  }

  removeNumber(row, index) {
    this._merchantService.removephone(this._id, row)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success('Number Deleted Successfully');
          }
        }
      );
    this.addedNumber.splice(index, 1);
  }

  removeEmail(row, index) {
    this._merchantService.removeEmail(this._id, row)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.addedEmail.splice(index, 1);
            // this.update_Merchant('Merchant Details', );
            this.toastr.success('Email Deleted Successfully');
          }
        }
      );
    //
  }

  getMobile(params: any) {
    this.addMobile = false;
    this.updateMobile = true;
    this._merchantService.getMobileById(params, this._id)
      .subscribe(
        res => {
          this.mobileEdit = res;
          // console.log(this.mobileEdit);
        });
  }

  getEmail(params: any) {
    this.addEmail = false;
    this.updateEmail = true;
    this._merchantService.getEmailById(params, this._id)
      .subscribe(
        res => {
          this.emailEdit = res;
          // console.log(this.emailEdit);
        });
  }

  EmailAdding(value) {
    // console.log(this.mobileEdit);
    // console.log(value);
    value.value = value.email;
    value.isPrimary = false;
    const putdata = value;
    // this.merchantObj.primaryEmail = value.email;
    this._merchantService.updateEmailID(this._id, this.emailEdit._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.getMerchantById();
            this.toastr.success('Email Edited Successfully');
          }
        }
      );
  }

  primaryEmailClick(j) {
    for (let i = 0; i < this.addedEmail.length; i++) {
      if (i !== j) {
        this.addedEmail[i].isPrimary = false;
      } else {
        this.primaryEmail = this.addedEmail[i].value;
        this.addedEmail[i].isPrimary = true;
      }
    }
  }

  addNewMobile() {
    this.addMobile = true;
    this.updateMobile = false;
  }

  addNewEmail() {
    this.addEmail = true;
    this.updateEmail = false;
  }

  //shop schedule data
  timing(value) {
    if (value.hrs24 === false) {
      if (value.days.length !== 0) {
        this.selectedOption = 1;
        this.showSelected = true;

        for (let i = 0; i < value.days.length; i++) {
          this.selectedDays.push(value.days[i]);
        }
        this.openTime = moment(value.openingTime).utc(value.openingTime).format('llll');
        this.closeTime = moment(value.closingTime).utc(value.closingTime).format('llll');
      } else {
        this.selectedOption = 3;
        this.openTime = moment(value.openingTime).utc(value.openingTime).format('llll');
        this.closeTime = moment(value.closingTime).utc(value.closingTime).format('llll');
      }
    } else {
      this.selectedOption = 2;
      this.isEnabled = true;
    }

  }

  refreshValue(value)
  {
    this.days = [];
    for (let i = 0; i < value.length; i++) {
      delete value[i].id;
      this.days[i] = value[i].text;
    }
  }

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
    this.hidetime = true;
  }

  HideButton() {
    this.showSelected = false;
    this.isEnabled = true;
    this.hidetime = false;
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
    this.hidetime = true;
  }

  // merchant approval function
  status(value) {
    if (value === 'Pending') {
      this.firstshow = true;
      this.secondshow = true;
    } else if (value === 'Approved') {
      this.secondshow = true;
      this.firstshow = false;
    } else if (value === 'Rejected') {
      this.secondshow = false;
      this.firstshow = true;
    }
  }

  // Call record upload
  CallDataUpload(value) {
    const date = new Date();
    moment(date).format('MM/DD/YYYY');
    moment(date).format('l LT');
    // console.log(date);
    if (this.callRecord !== undefined) {
      const awsConfig = new AWS.Config({
        accessKeyId: environment.awsAccessKey,
        secretAccessKey: environment.awsSecretKey,
        region: environment.awsRegion,
      });
      const s3 = new AWS.S3(awsConfig);
      const urlParams = {
        Bucket: 'jhakaas-docs',
        Key: this.callRecord
      };
      new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', urlParams, (err, url) => {
          this.url = url;
          this.CallKey = this.url;
          if (err) reject(err);
          else resolve(url);
        });
      });
      this.callRecordData.push({
        'comments': value.comments,
        'posted_by': {
          'firstName': 'admin',
          'lastName': 'itrator'
        },
        'postOn': date,
        'key': this.CallKey
      });
    } else {
      this.callRecordData.push({
        'comments': value.comments,
        'posted_by': {
          'firstName': 'admin',
          'lastName': 'itrator'
        },
        'postOn': date,
        'key': null
      });
    }

    value.comments = value.comments;

    if (this.callRecord !== undefined) {
      value.key = this.callRecord;
    } else {
      value.key = null;
    }

    value.postOn = date;
    // console.log(value.postOn);
    value.posted_by = this.empId;
    this._merchantService.callRecordService(this._id, value)
      .subscribe(
        data => {
          // console.log(data);
          // console.log(this.callRecordData);
          if (data.length !== 0) {
            this.toastr.success(' Call Record Added successfully!', 'Success');
            this.callRecord = undefined;
            this.Record.reset();
            this.getMerchantById();
          }

        }
      );
  }

  callupload(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    this.uploadCallfile();
  }

  uploadCallfile() {
    this.loadingtext = 'Please Wait... Uploading Call Record!';
    this.spinner.show();
    const awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'merchant/call/' + this.file.name, Body: this.file}, (err, data) => {
      this.callRecord = data.Key;
      // console.log(this.callRecord);
      if (this.callRecord !== undefined) {
        this.spinner.hide();
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.callRecord
        };

        new Promise((resolve, reject) => {
          s3.getSignedUrl('getObject', urlParams, (err2, url) => {
            this.url = url;
            // console.log(this.url);
            if (err2) reject(err);
            else resolve(url);
          });
        });
      }
    });
  }

  // Document Uploading
  fileSelect(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    this.loadingtext = 'Please Wait... Uploading Image!';
    this.spinner.show();
    this.uploadfile();
  }

  uploadfile() {

    const awsConfig = new AWS.Config({
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
            if (err2) reject(err);
            else resolve(url);
          });
        });
      }
    });
  }

  addDoc(name, value: any) {
    if (value !== null && this.docImg !== null) {
      // this.documents.push({
      //   'url': this.url,
      //   'name': value.docname,
      //   'key': this.docImg,
      //   'verified': false
      // });

      value.url = this.url;
      value.name = value.docname;
      if (this.docImg !== null){
        value.key = this.docImg;
      }
      value.verified = false;
      const putdata = value;
      this._merchantService.addDocumentDetails(this._id, JSON.stringify(putdata))
        .subscribe(
          data => {
            if (data.length !== 0) {
              this.getMerchantById();
              this.toastr.success('Documents Added Successfully');
              this.documentModalAdd.hide();
            }
          }
        );
      name.form.reset();

    } else {
      swal(
        'Oops...',
        'Please choose the Photo for Upload',
        'error');
    }
    this.docImg = null;
    this.url = null;
    // value.documents = this.documents;
    delete value.docname;
    // var name2 = 'Documents';
    // this.update_Merchant(name2, value);
    this.documentModalAdd.hide();
  }

  remove(row, index) {
    const that = this;
    const that1 = this;
    swal({
      title: 'Are you sure?',
      text: 'To Delete the Document Image!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      that._merchantService.removeDoc(that._id, row)
        .subscribe(
          data => {
            if (data.length !== 0) {
              // that.toastr.success('Documents Deleted Successfully');
            }
          }
        );
      swal(
        'Deleted!',
        'Your Document Image.',
        'success'
      );
      that.documents.splice(index, 1);
    }).catch(function () {
      swal(
        'Safe!',
        'Your Document Image is Safe!',
        'success'
      );
    });
    ;

  }

  //add bank details
  addBank(value: any) {
    // var name = 'Bank Details';
    // var date = new Date().toLocaleDateString();
    // moment(date).format('MM/DD/YYYY');
    // this.bankDetails.push({
    //   'country': value.bcountry[0].text,
    //   'name': value.bname,
    //   'accNo': value.accNo,
    //   'UPI': value.UPI,
    //   'IFSC': value.IFSC,
    // });
    value.country = value.bcountry[0].text;
    value.name = value.bname;
    // value.accNo = value.accNo;
    // value.UPI = value.UPI;
    // value.IFSC = value.IFSC;
    // value.bankDetails = this.bankDetails;
    delete value.bcountry;
    delete value.bname;
    // delete value.accNo;
    // delete value.IFSC;
    // delete value.UPI;

    const putdata = value;
    this._merchantService.addBankDetails(this._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.getMerchantById();
            this.toastr.success('Bank Details Added Successfully');
            this.bankModalAdd.hide();
          }
        }
      );


    // this.update_Merchant(name, value);
    // this.bankModalAdd.hide();


  }

  removeBank(row, index) {
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'To Delete the Bank Details!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      that._merchantService.removeBank(that._id, row)
        .subscribe(
          data => {
            if (data.length !== 0) {
              // that.toastr.success('Bank Details Deleted Successfully');
            }
          }
        );
      that.bankDetails.splice(index, 1);
      swal(
        'Deleted!',
        'Your Bank Details.',
        'success'
      );
    }).catch(function () {
      swal(
        'Safe!',
        'Your Bank Details is Safe!',
        'success'
      );
    });
    ;

  }

  // add social media details
  addSocial(value: any) {
    // var name = 'Social Media';
    // var date = new Date().toLocaleDateString();
    // moment(date).format('MM/DD/YYYY');
    // this.socialMedia.push({
    //   'name': value.pgname,
    //   'url': value.pgurl,
    // });
    // value.social_media = this.socialMedia;
    value.name = value.pgname;
    value.url = value.pgurl;
    delete value.pgname;
    delete value.pgurl;
    // this.update_Merchant(name, value);


    const putdata = value;
    this._merchantService.addSocialMedia(this._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.getMerchantById();
            this.toastr.success('Social Media Added Successfully');
          }
        }
      );
    // this.getMerchantById();
    this.socialModalAdd.hide();
    this.docImg = null;
  }

  removeSocial(row, index) {

    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'To Delete the Social Media Details!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      that._merchantService.removeSocial(that._id, row)
        .subscribe(
          data => {
            if (data.length !== 0) {
              // this.toastr.success('Social Media Deleted Successfully');
            }
          }
        );
      that.socialMedia.splice(index, 1);
      swal(
        'Deleted!',
        'Your Social Media Details.',
        'success'
      );
    }).catch(function () {
      swal(
        'Safe!',
        'Your Social Media Details is Safe!',
        'success'
      );
    });
    ;
  }


  // GET & Edit social media details
  getSocial(params: String, Updatetemplate: TemplateRef<any>) {
    this.socialModalEdit = this.modalService.show(Updatetemplate);
    this._merchantService.getSocialById(params, this._id)
      .subscribe(
        res => {
          this.socialEdit = res;
          // console.log(this.socialEdit);
        });
  }

  EditSocial(value) {
    const putdata = value;
    this._merchantService.updateSocial(this._id, this.socialEdit._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.socialModalEdit.hide();
            this.getMerchantById();
            this.toastr.success('Social Media Edited Successfully');
          }
        }
      );
  }

  // GET & Edit Bank Details

  getBank(params: any, Updatetemplate: TemplateRef<any>) {
    // console.log(params);
    this.BankModalEdit = this.modalService.show(Updatetemplate);
    this._merchantService.getBankById(params, this._id)
      .subscribe(
        res => {
          this.bankEdit = res;
          // console.log(this.bankEdit);
          this.bankCountryActive = this.bankEdit.country;
          // this.bankCountryActive.push({'id': this.bankEdit.country, 'text': this.bankEdit.country});
          // console.log(this.bankCountryActive);
        });
  }

  EditBank(value) {
    // console.log(value);
    if (value.country[0] !== undefined) {
      value.country = value.country[0].text;
    } else {
      delete value.country;
    }
    const putdata = value;
    this._merchantService.updateBank(this._id, this.bankEdit._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.BankModalEdit.hide();
            this.toastr.success('Bank Details Edited Successfully');
            this.getMerchantById();
          }
        }
      );
  }

  // GET & Edit doucment details
  getDocument(params: String, Updatetemplate: TemplateRef<any>) {
    this.documentModalEdit = this.modalService.show(Updatetemplate);
    this._merchantService.getDocumentById(params, this._id)
      .subscribe(
        res => {
          this.documentEdit = res;
          // console.log(this.documentEdit);
        });
  }

  EditDoc(value) {
    if (this.docImg !== null) {
      value.key = this.docImg;
    } else {
      value.key = this.documentEdit.key;
    }
    const putdata = value;
    this._merchantService.updateDoc(this._id, this.documentEdit._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.documentModalEdit.hide();
            this.getMerchantById();
            this.toastr.success('Documents Edited Successfully');
          }
        }
      );
  }

  // Get Lat & logn Details
  getLatLng(value) {
    this.lat = value.coords.lat;
    this.lng = value.coords.lng;
    this.getGeoAddress(this.lat, this.lng);
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

  getGeoAddress(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this._geoLoacation.getAddress(this.lat, this.lng).subscribe(
      result => {
        if (result !== undefined) {
          if (result.status === 'OK') {
            this.geoAddress = result.results[0].formatted_address;
          } else {
            this.geoAddress = this.merchantObj.landmark;
          }
        } else {
          this.geoAddress = this.merchantObj.landmark;
        }
      }
    );
  }

// merchant verification function
  onChange(evt) {
    this.verified = evt;
  }

  verify() {
    this._merchantService.updateStatus(this._id, JSON.stringify({'verified': this.verified}))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success(' Verified successfully!', 'Success');
          }

        }
      );
  }

  // approved By & rejected By function of merchant
  approved() {
    this.app = [];
    // console.log(this.remark);
    const date = new Date();
    moment(date).format('MM/DD/YYYY');
    moment(date).format('llll');
    // console.log(date);
    this.app.push({
      'approve': true,
      'approved_by': this.empId,
      'approved_date': date,
      'remark': this.remark,
      'status': 'Approved',
    });
    // console.log(this.app);
    this.update_status('Utility', this.app);
  }

  rejectby() {
    this.rej = [];
    // console.log(this.remark);
    const date = new Date();
    moment(date).format('MM/DD/YYYY');
    moment(date).format('llll');
    // console.log(date);
    this.rej.push({
      'approve': false,
      'approved_by': this.empId,
      'approved_date': date,
      'remark': this.remark,
      'status': 'Rejected',
    });
    // console.log(this.rej);
    this.update_status('Utility', this.rej);
  }

  update_status(name, value: any) {
    const body = value[0];
    // console.log(body);
    this._merchantService.addApproved(this._id, body)
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success(name + ' Update successfully!', 'Success');
            this.getMerchantById();
          }
        }
      );
  }

  public selected(value: any): void {
    this.cat = value.id;
  }

///SLA
  addSLA(data) {
    // var a;
    // a = '{' + JSON.stringify(data.key) + ':' + '"' + data.value + '"' + '}';
    // console.log(a);
    this.SLA.push({
      key: data.key,
      value: data.value,
      // show: true
    });
    this.SLAaddModal.hide();

    for (let i = 0; i < this.SLADropdownValue.length; i++) {
      this.tmpexampleData1[i] = this.SLADropdownValue[i];
    }

    this.tmpexampleData1.push(data.key);

    this.SLADropdownValue = this.tmpexampleData1;
    this.SLAaddModal.hide();

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

    if (this.SLA.length > 0) {
      for (let i = 0; i < this.SLA.length; i++) {
        if (this.SLA[i].key === value.text) {
          this.SLA[i].show = false;
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
    if (this.SLA.length > 0) {
      for (let i = 0; i < this.SLA.length; i++) {
        if (this.SLA[i].key === value.text) {
          this.SLA[i].show = true;
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

  SlaButton() {
    this.enableButton = true;
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

  // GSTIN Example
  gstEx() {
    swal({
      title: 'GSTIN Example',
      // imageUrl: 'https://cdn.hrblock.in/uploads/sites/7/2017/11/gstin-structure1.jpg'
      imageUrl: 'https://www.basunivesh.com/wp-content/uploads/2017/07/Format-or-Structure-of-15-' +
      'digit-GSTIN-Goods-and-Service-Tax-Identification-Number.jpg'
    });
  }

  // Update Merchant function
  update_Merchant(name, value: any) {

    if (name === 'Terms Condition') {
      this.TnC.hide();
    }
    if (name === 'Privacy Policy') {
      this.PnP.hide();
    }
    if (name === 'Refund Exchange Policy') {
      this.RnE.hide();
    }
    if (name === 'Return Policy') {
      this.RnP.hide();
    }

    if (name === 'Documents') {
      value.documents = this.documents;
    }
    if (name === 'Bank Details') {
      value.bankDetails = this.bankDetails;
    }
    if (name === 'Social Media') {
      value.social_media = this.socialMedia;
    }
    if (name === 'Service Details') {
      value.sla = this.SLA;

      if (this.slaValue.length > 0) {
        this.tmpexampleData = [];
        for (let i = 0; i < this.slaValue.length; i++) {
          // console.log(this.slaValue[i]);
          this.tmpexampleData.push(this.slaValue[i].text);
        }
        value.slashow = this.tmpexampleData;
      }
    }
    if (value.lat !== undefined && value.lng !== undefined) {
      value.loc = [value.lng, value.lat];
    }

    if (this.geoAddress !== undefined) {
      value.landmark = this.geoAddress;
    }

    if (name === 'Business Details') {
      // console.log(value);
      if (value.state !== null && value.city !== null) {
        // if (value.country !== null) {
        //   delete value.country[0].id;
        //   value.country = value.country[0].text;
        // } else {
        //   value.country = this.countryShow;
        // }
        this.Address = [];
        this.Address.push({
          'address1': value.address1,
          'city': value.city[0].text,
          'state': value.state[0].text,
          'postalCode': value.postalCode
        });
        delete value.address1;
        delete value.state;
        delete value.city;
        delete value.postalCode;
      } else {
        this.Address = [];
        this.Address.push({
          'address1': value.address1,
          'city': this.merchantObj.address.city,
          'state': this.merchantObj.address.state,
          'postalCode': value.postalCode
        });
        delete value.state;
        delete value.city;
        delete value.country;
      }
      value.address = this.Address[0];
      // if (this.countryIDData !== undefined) {
      //   this.a.push({
      //     'currencyCode': this.countryIDData.currencies[0].code,
      //     'currencyName': this.countryIDData.currencies[0].name,
      //     'currencySymbol': this.countryIDData.currencies[0].symbol
      //   });
      //   value.currency = this.a[0];
      //   if (this.a.length > 0) {
      //     delete this.a[0];
      //   }
      // }
      // if (this.timezone !== 0) {
      //   value.timezones = this.timezone;
      // }
    }


    if (name === 'Shop Schedule') {
      moment(value.openTime).format('MM/DD/YYYY');
      moment(value.openTime).format('l LT');
      moment(value.closeTime).format('MM/DD/YYYY');
      moment(value.closeTime).format('l LT');
      // value.openTime = moment(value.openTime).format('LT');
      // value.closeTime = moment(value.closeTime).format('LT');

      if (value.radio1 !== 2) {
        if (value.radio1 === 1) {
          if (this.days.length > 0) {
            this.upShopSchedule.push({
              'days': this.days,
              'hrs24': false,
              'openingTime': value.openTime,
              'closingTime': value.closeTime
            });
          } else {
            this.upShopSchedule.push({
              'days': this.selectedDays,
              'hrs24': false,
              'openingTime': value.openTime,
              'closingTime': value.closeTime
            });
          }
        } else {
          this.upShopSchedule.push({
            'hrs24': false,
            'openingTime': value.openTime,
            'closingTime': value.closeTime
          });
        }
      } else {
        this.upShopSchedule.push({
          'hrs24': true,
        });
      }

      value.shopSchedule = this.upShopSchedule[0];
      if (this.upShopSchedule.length > 0) {
        delete this.upShopSchedule[0];
      }

    }

    if (name === 'Merchant Details' && value.dob !== null) {
      value.dob = moment(value.dob).format('MM/DD/YYYY');
    } else {
      delete value.dob;
    }
    if (name === 'Merchant Details' && this.cat !== '') {
      value.category = this.cat;
    } else {
      delete value.cate;
    }

    // country Updation Code

    // if (name === 'Merchant Details' && value.country !== null) {
    //   // delete value.country[0].id;
    //   //     value.country = value.country[0].text;
    //   if (this.countryIDData !== undefined) {
    //     this.a.push({
    //       'currencyCode': this.countryIDData.currencies[0].code,
    //       'currencyName': this.countryIDData.currencies[0].name,
    //       'currencySymbol': this.countryIDData.currencies[0].symbol
    //     });
    //     value.currency = this.a[0];
    //     if (this.a.length > 0) {
    //       delete this.a[0];
    //     }
    //   }
    //   if (this.timezone !== 0) {
    //     value.timezones = this.timezone;
    //   }
    //   // this.currencies = this.countryIDData.currencies[0].symbol;
    //
    // } else {
    //   value.country = this.countryShow;
    // }

    value.phone = this.addedNumber;
    value.secondaryEmail = this.addedEmail;
    const putdata = value;
    console.log(putdata);
    this._merchantService.updateMerchant(this._id, JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success(name + ' Update successfully!', 'Success');
          }
        }
      );
  }

  // All modal opening Function
  mobAdd(template: TemplateRef<any>) {
    this.mobadd = this.modalService.show(template);
  }

  emailAdd(template: TemplateRef<any>) {
    this.EmailAdd = this.modalService.show(template);
  }

  mobaddhide() {
    this.mobadd.hide();
  }

  TC(template: TemplateRef<any>) {
    this.TnC = this.modalService.show(template);
  }

  PP(template: TemplateRef<any>) {
    this.PnP = this.modalService.show(template);
  }

  REP(template: TemplateRef<any>) {
    this.RnE = this.modalService.show(template);
  }

  RP(template: TemplateRef<any>) {
    this.RnP = this.modalService.show(template);
  }

  SMM(template: TemplateRef<any>) {
    this.socialModalAdd = this.modalService.show(template);
  }

  DMM(template: TemplateRef<any>) {
    this.documentModalAdd = this.modalService.show(template);
  }

  SLAmodal(template: TemplateRef<any>) {
    this.SLAaddModal = this.modalService.show(template);
  }

  BDM(template: TemplateRef<any>) {
    this.bankModalAdd = this.modalService.show(template);
  }
}
