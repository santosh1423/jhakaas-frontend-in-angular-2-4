import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {DataTableDirective} from 'angular-datatables';
import * as moment from 'moment';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {del} from 'selenium-webdriver/http';
import { NgxSpinnerService } from 'ngx-spinner';

declare var require: any;
var _ = require('lodash');

@Component({
  selector: 'merchantexport',
  templateUrl: 'merchantexport.template.html',
  providers: [MerchantServices]
})
export class MerchantexportComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  public merchantObj: any;
  @ViewChild('merchantExport')
  myForm: any;
  @ViewChild('tofrom')
  tofrom: any;
  public modalAdd: BsModalRef;
  _dtTrigger: any = new Subject();
  public Records: any;
  public _id: any;
  public abc = 'Today';
  public showcustom = false;
  public approveby: any;
  public tmpexampleData: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public approvedby: Array<any> = [];
  public all: Array<any> = [];
  public registerby: any;
  public registeredby: any;
  public query = false;
  public mydate: Date;
  public fromdate: any;
  public ratings: Array<any> = [];
  public days2: Array<any> = [];
  public phone: Array<any> = [];
  public selected_value: any;
  public maxDate: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public loadingtext = 'Please Wait....';


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private spinner: NgxSpinnerService) {

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

  ngOnInit() {
    var a = moment(new Date()).format('DD-MM-YYYY');
    // console.log(a);
    this.getMerchantDetails();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'Export') {
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
      // ajax: 'data/data.json',
      // dom: 'lfrtip',
      dom: 'l<"pull-right">frtip',
      processing: true,
      // Configure the buttonslfrtiplfrtip
    };
    this.getApprovedBy();
    this.getRegisterBy();
    this.tofrom = [new Date(), new Date()];
    this.maxDate = new Date();
  }

  days() {
    this.selected_value = $('#selecteddays').val();
    if (this.selected_value === 'Custom') {
      this.showcustom = true;
    } else {
      this.showcustom = false;
    }
  }
  getUser() {
    return sessionStorage.getItem('_id');
  }

  // feching Dropdown List
  getApprovedBy() {
    this._merchantService.getAllApprovedBy()
      .subscribe(approvedObj => {
        this.approveby = approvedObj;
        this.tmpexampleData = [];
        this.tmpexampleData.push({'id': 'ALL', 'text': 'ALL'});
        for (let i = 0; i < this.approveby.length; i++) {
          this.tmpexampleData.push({'id': this.approveby[i]._id, 'text': this.approveby[i].firstName});
        }
        this.approvedby = this.tmpexampleData;
        // this.all.push({'id': this.approveby[2]._id, 'text': this.approveby[2].firstName});
        this.all.push({'id': 'ALL', 'text': 'ALL'});
        // console.log(this.approvedby.length);
        this.all = this.all[0];
        // console.log(this.approvedby);
        // console.log(this.all);
      });
  }

  getRegisterBy() {
    this._merchantService.getAllRegisterBy()
      .subscribe(registeredObj => {
        // console.log(registeredObj);
        this.registerby = registeredObj;
        this.tmpexampleData1 = [];
        this.tmpexampleData1.push({'id': 'ALL', 'text': 'ALL'});
        for (let i = 0; i < this.registerby.length; i++) {
          this.tmpexampleData1.push({'id': this.registerby[i]._id, 'text': this.registerby[i].firstName});
        }
        this.registeredby = this.tmpexampleData1;
      });
  }

  // getting Onload Data Of Current Date
  getMerchantDetails() {
    var d = new Date();

    this.fromdate = moment(d).format('YYYY-MM-DD');
    this._merchantService.getAllExportMerchant(this.fromdate)
      .subscribe(
        res => {
          this.merchantObj = res;
          for ( let i = 0; i < this.merchantObj.length; i++) {
            if (this.merchantObj[i].dob !== undefined) {
              this.merchantObj[i].dob = moment(this.merchantObj[i].dob).utc(this.merchantObj[i].dob).format('llll');
            }
            if (this.merchantObj[i].createdAt !== undefined) {
              this.merchantObj[i].createdAt = moment(this.merchantObj[i].createdAt).utc(this.merchantObj[i].createdAt).format('llll');
            }
            if (this.merchantObj[i].updatedAt !== undefined) {
              this.merchantObj[i].updatedAt = moment(this.merchantObj[i].updatedAt).utc(this.merchantObj[i].updatedAt).format('llll');
            }
            if (this.merchantObj[i].storeImage.uploadedOn !== undefined) {
              this.merchantObj[i].storeImage.uploadedOn = moment(this.merchantObj[i].storeImage.uploadedOn).utc(this.merchantObj[i].storeImage.uploadedOn).format('llll');
            }
            if (this.merchantObj[i].shopSchedule.openingTime !== undefined) {
              this.merchantObj[i].shopSchedule.openingTime = moment(this.merchantObj[i].shopSchedule.openingTime).utc(this.merchantObj[i].shopSchedule.openingTime).format('LT');
            }
            if (this.merchantObj[i].shopSchedule.closingTime !== undefined) {
              this.merchantObj[i].shopSchedule.closingTime = moment(this.merchantObj[i].shopSchedule.closingTime).utc(this.merchantObj[i].shopSchedule.closingTime).format('LT');
            }
          }
          this.manageArrayValue(this.merchantObj);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to re-render again
            this._dtTrigger.next();
          });
        });

  }

  manageArrayValue(merchantObj) {
    if (merchantObj !== null) {
      for (let i = 0; i < merchantObj.length; i++) {
        var ratings = merchantObj[i].ratings;
        var day = merchantObj[i].shopSchedule.days;
        var phone = merchantObj[i].phone;
        var approvedBy = merchantObj[i].approvedBy;
        if (ratings !== null) {
          for (let j = 0; j < ratings.length; j++) {
            this.ratings[j] = ratings[j].score;
          }
        }
        if (approvedBy.length !== 0) {
          console.log(approvedBy);
          var a = _.reverse(approvedBy);
          console.log(a);
          merchantObj[i].approvedBy = a[0];
          this.merchantObj[i].approvedBy.approved_date = moment(this.merchantObj[i].approvedBy.approved_date).format('DD/MM/YYYY');
        }
        // console.log(this.ratings);

        if (day !== null) {
          for (let j = 0; j < day.length; j++) {
            this.days2[j] = day[j];
          }
        }
        if (phone !== null) {
          for (let j = 0; j < phone.length; j++) {
            this.phone[j] = phone[j].value;
          }
        }
        this.merchantObj[i].phone = this.phone;
        this.merchantObj[i].updatedAt = moment(this.merchantObj[i].updatedAt).format('DD/MM/YYYY hh:mm:ss');
        this.merchantObj[i].createdAt = moment(this.merchantObj[i].createdAt).format('DD/MM/YYYY hh:mm:ss');
        this.merchantObj[i].dob = moment(this.merchantObj[i].dob).format('DD/MM/YYYY');
        this.merchantObj[i].phone.splice(0, 1);
        this.merchantObj[i].closedon = this.days2;
        this.merchantObj[i].ratings = this.ratings;
        this.phone = [];
        this.days2 = [];
        this.ratings = [];
      }
    }

  }

  download() {
    var json2csv = require('json2csv');
    const fields = ['_id', 'category.name', 'tags', 'name', 'firstName',
      'lastName', 'dob', 'email', 'mobileNumber', 'phone', 'address.address1', 'postalCode', 'loc[1]', 'loc[0]',
      'aadharCard', 'visibilityRadius', 'visibilityRadiusMeasure',
      'closedon', 'shopSchedule.openingTime', 'shopSchedule.closingTime', 'shopSchedule.hrs24',
      'deliveryTime', 'minimumOrder', 'specialOffer', 'paymentTypes',
      'orderPlacement', 'ratings', 'currency.currencyCode',
      'status', 'updatedAt', 'createdAt', 'created_by',
      'registered_by.firstName', 'registered_by.lastName',
      'approvedBy.approved_by._id', 'approvedBy.approved_by.firstName',
      'approvedBy.approved_by.lastName', 'approvedBy.approved_date', 'approvedBy.remark'
    ];
    const fieldsName = ['id', 'Category Name', 'Tags', 'ShopName', 'FirstName',
      'LastName', 'DateOfEstablishment', 'Email', 'MobileNumber', 'Phone', 'Address', 'Pincode', 'Latitude', 'Langitude',
      'AadharCard', 'VisibilityRadius', 'VisibilityRadiusMeasure', 'ClosedOn', 'OpeningTime',
      'ClosingTime', 'is24', 'DeliveryTime', 'MinimumOrder', 'SpecialOffer', 'PaymentTypes',
      'OrderPlacement', 'Ratings', 'CurrencyCode',
      'Status', 'updatedAt', 'createdAt', 'Created_By',
      'Registered_by_FirstName', 'Registered_by_LastName',
      'Approved_by_ID', 'Approved_by_FirstName', 'Approved_by_LastName', 'Approved_Date', 'Approved_Remark'
    ];
    json2csv({data: this.merchantObj, fields: fields, fieldNames: fieldsName}, function (err, csv) {
      if (err) {

      }
      if (csv !== undefined) {
        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL = window.URL.createObjectURL(csvData);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'MerchantDetails.csv');
        tempLink.click();
      }
    });
  }

  filterMerchant(value: any) {
    this.spinner.show();
    // console.log(value);
    this.mydate = new Date();
    if (value.tofrom !== undefined) {
      // console.log(value.tofrom);
      // value.todate = moment(value.tofrom[1]).format('YYYY-MM-DD');
      // value.fromdate = moment(value.tofrom[0]).format('YYYY-MM-DD');

      value.todate = value.tofrom[1];
      value.todate.setHours(23,59,59,999);
      value.todate.toUTCString();
      value.todate = moment(value.todate).utc(value.todate).format('llll');


      value.fromdate = value.tofrom[0];
      value.fromdate.setHours(0,0,0,0);
      value.fromdate.toUTCString();
      value.fromdate = moment(value.fromdate).utc(value.fromdate).format('llll');
      // console.log(value.fromdate);
      // console.log(value.fromdate);
      // console.log(value.todate);

    } else {
      value.todate = '';
      value.fromdate = '';
    }
    if (value.date === 'Today') {

      var start1 = new Date();
      start1.setHours(23,59,59,999);
      start1.toUTCString();
      // this.mydate = start;
      value.todate = start1;
      // value.fromdate = moment(start).format('YYYY-MM-DD');
      value.todate = moment(value.todate).utc(value.todate).format('llll');
      // console.log(value.todate);


      var start = new Date();
      start.setHours(0,0,0,0);
      start.toUTCString();
      // this.mydate = start;
      value.fromdate = start;
      // value.fromdate = moment(start).format('YYYY-MM-DD');
      value.fromdate = moment(value.fromdate).utc(value.fromdate).format('llll');
      // console.log(value.fromdate);

    }
    else if (value.date === 'Yesterday') {

      var start1 = new Date();
      start1.setHours(23,59,59,999);
      start1.toUTCString();
      // this.mydate = start;
      value.todate = start1;
      // value.fromdate = moment(start).format('YYYY-MM-DD');
      value.todate = moment(value.todate).utc(value.todate).format('llll');
      // console.log(value.todate);


      var start = new Date();
      start.setHours(0,0,0,0);
      start.toUTCString();
      // this.mydate = start;
      value.fromdate = start;
      // value.fromdate = moment(start).format('YYYY-MM-DD');
      value.fromdate = moment(value.fromdate.setDate(value.fromdate.getDate() - 1)).utc(value.fromdate).format('llll');
      // console.log(value.fromdate);

      // value.todate = moment(this.mydate).format('YYYY-MM-DD');
      // value.fromdate = moment(this.mydate.setDate(this.mydate.getDate() - 1)).format('YYYY-MM-DD');
    }
    else if (value.date === '7') {

      var start1 = new Date();
      start1.setHours(23,59,59,999);
      start1.toUTCString();
      // this.mydate = start;
      value.todate = start1;
      // value.fromdate = moment(start).format('YYYY-MM-DD');
      value.todate = moment(value.todate).utc(value.todate).format('llll');
      // console.log(value.todate);

      var start = new Date();
      start.setHours(0,0,0,0);
      start.toUTCString();
      // this.mydate = start;
      value.fromdate = start;
      // value.fromdate = moment(start).format('YYYY-MM-DD');
      value.fromdate = moment(value.fromdate.setDate(value.fromdate.getDate() - 7)).utc(value.fromdate).format('llll');
      // console.log(value.fromdate);

      // value.todate = moment(this.mydate).format('YYYY-MM-DD');
      // value.fromdate = moment(this.mydate.setDate(this.mydate.getDate() - 7)).format('YYYY-MM-DD');
    }
    if (value.approvedBy !== '') {
      value.approvedBy = value.approvedBy[0].id;
    }
    if (value.registerBy !== '') {
      value.registerBy = value.registerBy[0].id;
    }
    delete value.date;
    // console.log(value);
    var dt1 = new Date(value.fromdate);
    var dt2 = new Date(value.todate);
    var diff = Math.abs(dt1.getTime() - dt2.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays > 8) {
      swal({
        title: 'Maximun 7 Days',
        text: 'Date Range must be 7 Days',
        type: 'warning',
      });
      this.tofrom = [new Date(), new Date()];
    } else {
      this._merchantService.getExportFilterMerchant(value)
        .subscribe(res => {
          this.spinner.hide();
          // console.log(res);
          this.merchantObj = res;
          for ( let i = 0; i < this.merchantObj.length; i++) {
            // if(this.merchantObj[i].approved.approved_date !== undefined){
            //   this.merchantObj[i].approved.approved_date = moment(this.merchantObj[i].approved.approved_date).utc(this.merchantObj[i].approved.approved_date).format('llll');
            // }
            if (this.merchantObj[i].dob !== undefined) {
              this.merchantObj[i].dob = moment(this.merchantObj[i].dob).utc(this.merchantObj[i].dob).format('llll');
            }
            if (this.merchantObj[i].createdAt !== undefined) {
              this.merchantObj[i].createdAt = moment(this.merchantObj[i].createdAt).utc(this.merchantObj[i].createdAt).format('llll');
            }
            if (this.merchantObj[i].updatedAt !== undefined) {
              this.merchantObj[i].updatedAt = moment(this.merchantObj[i].updatedAt).utc(this.merchantObj[i].updatedAt).format('llll');
            }
            if (this.merchantObj[i].storeImage.uploadedOn !== undefined) {
              this.merchantObj[i].storeImage.uploadedOn = moment(this.merchantObj[i].storeImage.uploadedOn).utc(this.merchantObj[i].storeImage.uploadedOn).format('llll');
            }
            if (this.merchantObj[i].shopSchedule.openingTime !== undefined) {
              this.merchantObj[i].shopSchedule.openingTime = moment(this.merchantObj[i].shopSchedule.openingTime).utc(this.merchantObj[i].shopSchedule.openingTime).format('LT');
            }
            if (this.merchantObj[i].shopSchedule.closingTime !== undefined) {
              this.merchantObj[i].shopSchedule.closingTime = moment(this.merchantObj[i].shopSchedule.closingTime).utc(this.merchantObj[i].shopSchedule.closingTime).format('LT');
            }
          }
          this.manageArrayValue(this.merchantObj);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
            if (this.selected_value === 'Custom') {
              this.myForm.setValue({'status': value.status, 'registerBy': value.registerBy, 'approvedBy': value.approvedBy, 'date': this.selected_value , 'pincode': value.pincode, 'tofrom': [value.tofrom[0], value.tofrom[1]] });
              // delete value.tofrom;
            }else {
              this.myForm.setValue({'status': value.status, 'registerBy': value.registerBy, 'approvedBy': value.approvedBy, 'date': this.selected_value , 'pincode': value.pincode});

            }
          });
        });
    }

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
        get._merchantService.updatestatus(param, param2).subscribe(
          data => {
            get.getMerchantDetails();
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

  addCatModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }

}
