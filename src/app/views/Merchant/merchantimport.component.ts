import {Component, TemplateRef, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {PapaParseService} from 'ngx-papaparse';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
var _ = require('lodash');

@Component({
  selector: 'merchantimport',
  templateUrl: 'merchantimport.template.html',
  providers: [MerchantServices]
})
export class MerchantimportComponent implements OnInit {
  public modalAdd: BsModalRef;
  public csv: any;
  public data: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public impData: any;
  public impSecData: any;
  public empId: any;
  public procmodal: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  public count = 0;
  public userID: any;
  public loadingtext: any;


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private papa: PapaParseService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    var eid = this.getUser();
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
  }


  getUser() {
    return sessionStorage.getItem('_id');
  }

  addCatModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }

  changeListener(files: FileList) {
    this.loadingtext = 'Please Wait.... Rearranging your Data!';
    var a = null;
    var ss = [];
    var phone = [];
    var email = [];
    var address = [];
    if (files && files.length > 0) {
      this.spinner.show();
      const file: File = files.item(0);
      this.csv = files[0];
      this.papa.parse(this.csv, {
          header: true,
          skipEmptyLines: true,
          // worker: true,
          complete: (results, file2) => {
            this.impData = results.data;
            this.impData = _.uniqBy(this.impData, 'email');
            for (let i = 0; i < this.impData.length; i++) {
              ss = [];
              phone = [];
              email = [];
              address = [];
              var aa = [];

              this.impData[i].password = this.impData[i].mobileNumber;
              this.impData[i].type = 'Merchant';
              this.impData[i].userName = this.impData[i].email;
              this.impData[i].created_by = 'Import';
              this.impData[i].registered_by = this.empId;
              this.impData[i].loc = [this.impData[i].long, this.impData[i].lat];
              if (this.impData[i].mobileNumber !== undefined) {
                phone.push({
                  name: 'Primary',
                  value: this.impData[i].mobileNumber,
                  isPrimary: true,
                  isWhatapp: true
                });
                this.impData[i].phone = phone;
              }
              if (this.impData[i].hasOwnProperty('tags')){
                this.impData[i].tags.split(',').forEach(function (item) {
                  aa.push(item);
                });
                if (aa.length !== 0) {
                  this.impData[i].tags = aa;
                }
              }
              if (this.impData[i].email !== undefined) {
                email.push({
                  value: this.impData[i].email,
                  isPrimary: true
                });
                this.impData[i].secondaryEmail = email;
              }
              if (this.impData[i].address1 !== undefined) {
                if (this.impData[i].city !== undefined) {
                  address.push({
                    address1: this.impData[i].address1,
                    state: this.impData[i].state,
                    city: this.impData[i].city,
                    postalCode: this.impData[i].postalCode
                  });
                } else {
                  address.push({
                    address1: this.impData[i].address1,
                    state: this.impData[i].state,
                    postalCode: this.impData[i].postalCode
                  });
                }
                this.impData[i].address = address[0];
              }
              if (this.impData[i].openTime !== undefined && this.impData[i].closeTime !== undefined) {

                var  answer = this.impData[i].openTime.replace(/[^a-zA-Z]/g, '');
                var  answer1 = this.impData[i].closeTime.replace(/[^a-zA-Z]/g, '');
                this.impData[i].openTime =  moment(this.impData[i].openTime, 'HH:mm').format('llll');
                this.impData[i].closeTime =  moment(this.impData[i].closeTime, 'HH:mm').format('llll');
                // console.log(this.impData[i].openTime);
                // console.log(this.impData[i].closeTime);
                if (answer === 'PM') {
                  this.impData[i].openTime =  moment(this.impData[i].openTime).add(12, 'hours');
                  this.impData[i].openTime =  this.impData[i].openTime._d;
                  // console.log(this.impData[i].openTime);
                }
                if (answer1 === 'PM') {
                  this.impData[i].closeTime =  moment(this.impData[i].closeTime).add(12, 'hours');
                  this.impData[i].closeTime =  this.impData[i].closeTime._d;
                  // console.log(this.impData[i].closeTime);
                }
                if (answer === 'AM') {
                  this.impData[i].openTime =  moment(this.impData[i].openTime).add(0, 'hours');
                  this.impData[i].openTime =  this.impData[i].openTime._d;
                  // console.log(this.impData[i].openTime);
                }
                if (answer1 === 'AM') {
                  this.impData[i].closeTime =  moment(this.impData[i].closeTime).add(0, 'hours');
                  this.impData[i].closeTime =  this.impData[i].closeTime._d;
                  // console.log(this.impData[i].closeTime);
                }
                ss.push({
                  openingTime: this.impData[i].openTime,
                  closingTime: this.impData[i].closeTime,
                  days: this.impData[i].closeOn
                });
                // console.log(this.impData[i].openTime);
                // console.log(this.impData[i].closeTime);
                this.impData[i].shopSchedule = ss[0];
              }
              this._merchantService.getEmailUsers(this.impData[i].email)
                .then(
                  result => {
                    if (result.length !== 0) {
                      this._merchantService.getEmails(this.impData[i].email)
                        .subscribe(
                          result2 => {
                            if (result2.length !== 0) {
                              this.impData[i] = null;
                            } else {
                              this.impData[i].user = result[0]._id;
                            }
                          });
                    }
                  }).then(res => {
                    if ( i === this.impData.length - 1){
                      this.spinner.hide();
                      // console.log('ghjfgj');
                    }
              });
            }
          }
        }
      );
    }
  }




  import(template: TemplateRef < any >) {
    if (this.csv !== undefined) {
      this.loadingtext = 'Please Wait.... Import in Progress!';
      this.spinner.show();
      this.impData = this.impData.filter(Boolean);
      // console.log(this.impData.length);
      if (this.impData.length !== 0) {
        // this.procmodal = this.modalService.show(template, this.config);
        // for (let i = 0; i < this.impSecData.length; i++) {
        this._merchantService.postMerchant2(this.impData)
          .subscribe(
            res => {
              var data = res;
              console.log(data);
              // this.count = this.count + 1;
              // if (this.count === this.impSecData.length) {
              if (data.success === true) {
                // this.procmodal.hide();
                this.toastr.success('Merchant Import successfully!', 'Success');
                this.spinner.hide();
              } else {
                this.spinner.hide();
                // this.procmodal.hide();
              }
              // console.log(data);

              // }
              // console.log(data);
              // if (data.success === true) {
              //   this.procmodal.hide();
              //   this.toastr.success('Merchant Import successfully!', 'Success');
              // }
              // if (data.error !== undefined) {
              //   console.log(data.error);
              // }
            }
          );
      } else {
        swal({
          type: 'warning',
          title: 'Error',
          text: 'The Data is Already exist!',
        });
      }

      // }

    } else {
      swal({
        type: 'warning',
        title: 'Error',
        text: 'Please select file to upload',
      });
    }
  }
}
