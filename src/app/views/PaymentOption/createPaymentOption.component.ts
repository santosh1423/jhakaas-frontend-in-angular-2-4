import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {DataTableDirective} from 'angular-datatables';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {PaymentOptionService} from "../../Shared/services/paymentOption.service";
import {ToastrService} from "ngx-toastr";
import * as AWS from "aws-sdk";

@Component({
  selector: 'createPaymentOption',
  templateUrl: 'createPaymentOption.template.html',
  styleUrls: ['paymentOption.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, PaymentOptionService]
})
export class CreatePaymentOptionComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public modalAdd: BsModalRef;
  public modalEdit: BsModalRef;
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public files: any;
  public file: any;
  public payImg: string;
  public paymentObj: Array<any> = [];
  public url: string;
  public paymentOptionID: any;
  public paymentOptionByID: Array<any> = [];
  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private toastr: ToastrService,
              private _paymentOption: PaymentOptionService,
              private _authenticationservice: AuthenticationService) {}

  ngOnInit() {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'PaymentOption') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    this.getPaymentOption();
    this.dtOptions = {
      dom: 'l<"pull-right"B>frtip',
      // processing: true,
      // Configure the buttonslfrtiplfrtip

    };
  }

  getUser() {
    return sessionStorage.getItem('_id');
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
  addPayModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  editPayModal(id, template: TemplateRef<any>) {
    this.paymentOptionID = id;
    this.modalEdit = this.modalService.show(template);
    this._paymentOption.getPaymenyOptionByID(this.paymentOptionID)
      .subscribe(
        result => {
          // console.log(result);
          this.paymentOptionByID = result;
        }
      );
  }
  fileSelect(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    this.uploadfile();
  }

  uploadfile() {

    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'paymentoption/' + this.file.name, Body: this.file}, (err, data) => {
      this.payImg = data.Key;
      if (this.payImg !== null) {
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.payImg
        };

        // new Promise((resolve, reject) => {
        //   s3.getSignedUrl('getObject', urlParams, (err2, url) => {
        //     this.url = url;
        //     if (err2) reject(err)
        //     else resolve(url);
        //   });
        // });
      }
    });
  }
  Addpayment(value){
  // console.log(value);
  value.createBy = this.empId;
  value.updateBy = this.empId;
    if (this.payImg !== undefined)  {
      value.image = this.payImg;
    }
    else {
      value.image = 'category/No-image-available.jpg';
    }
    this._paymentOption.postPaymentOption(value)
      .subscribe(
        result => {
          this.modalAdd.hide();
          if (result.length !== 0) {
            this.rerender();
            this.getPaymentOption();
            this.toastr.success(' Payment Option Added successfully!', 'Success');

          }
        }
      );
  }

  getPaymentOption(){
    this._paymentOption.getAllPaymentOption()
      .subscribe(
        paymentObj => {
          this.paymentObj = paymentObj;
          // console.log(this.paymentObj);
          var awsConfig = new AWS.Config({
            accessKeyId: environment.awsAccessKey,
            secretAccessKey: environment.awsSecretKey,
            region: environment.awsRegion,
          });
          const s3 = new AWS.S3(awsConfig);
          for (let i = 0; i < this.paymentObj.length; i++) {
            const urlParams = {
              Bucket: 'jhakaas-docs',
              Key: this.paymentObj[i].image
            };
            new Promise((resolve, reject) => {
              s3.getSignedUrl('getObject', urlParams, (err, url) => {
                this.url = url;
                this.paymentObj[i].url = this.url;
                if (err) reject(err)
                else resolve(url);
              });
            });
          }
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });

    }

  Editpayment(value){
    value.createBy = this.empId;
    value.updateBy = this.empId;
    if (this.payImg !== undefined)  {
      value.image = this.payImg;
    }
    this._paymentOption.updatePaymentOption(this.paymentOptionID, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            this.rerender();
            this.getPaymentOption();
            this.toastr.success(' Payment Option Updated successfully!', 'Success');
            this.modalEdit.hide();

          }
        }
      );

  }
  statuschange(param: any, param2: any) {
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'To change the status!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then(function () {
        that._paymentOption.updatestatus(param, param2).subscribe(
          result => {
            if (result.length !== 0) {
              that.rerender();
              that.getPaymentOption();
              // that.rerender();
            }
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

  deletePaymentOptionById(value){
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    })
      .then((Delete) => {
        if (Delete) {
          swal(
            'Deleted!',
            'Your Record has been Deleted.',
            'success'
          );
          this._paymentOption.deletePaymentOption(value).subscribe(
            result => {
              that.rerender();
              that.getPaymentOption();
              // this.toastr.success(' Payment Option Deleted successfully!', 'Success');

            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }
}
