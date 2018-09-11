import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VideotutorialsService} from "../../Shared/services/videotutorials.service";
import {identifierModuleUrl} from "@angular/compiler";
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import * as AWS from "aws-sdk";
import {VoucherService} from "../../Shared/services/voucher.service";

@Component({
  selector: 'voucherManagement',
  templateUrl: 'voucherManagement.template.html',
  // styleUrls: ['voucherManagement.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, VoucherService]
})
export class VouchermanagementComponent implements OnInit, AfterViewInit  {
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
  public voucherImg: string;
  public voucherByID: any;
  public voucherID: any;
  public voucherObj: any;
  public url: any;
  constructor(private _merchantService: MerchantServices,
              private _voucherService: VoucherService,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {}

  ngOnInit() {
    this.getVoucher();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'VoucherManagement') {
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
      dom: 'l<"pull-right"B>frtip',
      // processing: true,
      // Configure the buttonslfrtiplfrtip

    };

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
    s3.upload({Bucket: 'jhakaas-docs', Key: 'voucher/' + this.file.name, Body: this.file}, (err, data) => {
      this.voucherImg = data.Key;
      if (this.voucherImg !== null) {
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.voucherImg
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

  addVoucherModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }

  editVoucherModal(id, template: TemplateRef<any>) {
    this.voucherID = id;
    this.modalEdit = this.modalService.show(template);
    this._voucherService.getVoucherByID(this.voucherID)
      .subscribe(
        result => {
          // console.log(result);
          this.voucherByID = result;
        }
      );
  }

  EditVoucher(value){
    this.modalEdit.hide();
    // console.log(value);
    if (this.voucherImg !== undefined)  {
      value.key = this.voucherImg;
    }
    value.updateBy = this.empId;
    this._voucherService.updateVoucher(this.voucherID, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            this.rerender();
            this.getVoucher();
            this.toastr.success(' Voucher Updated successfully!', 'Success');
            // this.getVideo();
            // this.rerender();

          }
        }
      );
  }

  AddVoucher(value){
    value.createBy = this.empId;
    value.updateBy = this.empId;
    if (this.voucherImg !== undefined)  {
      value.key = this.voucherImg;
    }
    else {
      value.key = 'category/No-image-available.jpg';
    }

    // console.log(value);
    this._voucherService.postVoucher(value)
      .subscribe(
        result => {
          this.modalAdd.hide();
          this.rerender();
          this.getVoucher();
          if (result.length !== 0) {

            this.toastr.success('Voucher Added successfully!', 'Success');

          }
        }
      );
  }

  getVoucher(){
    this._voucherService.getAllVoucher()
      .subscribe(
        voucherObj => {
          this.voucherObj = voucherObj;

          var awsConfig = new AWS.Config({
            accessKeyId: environment.awsAccessKey,
            secretAccessKey: environment.awsSecretKey,
            region: environment.awsRegion,
          });
          const s3 = new AWS.S3(awsConfig);
          for (let i = 0; i < this.voucherObj.length; i++) {
            const urlParams = {
              Bucket: 'jhakaas-docs',
              Key: this.voucherObj[i].key
            };
            new Promise((resolve, reject) => {
              s3.getSignedUrl('getObject', urlParams, (err, url) => {
                this.url = url;
                this.voucherObj[i].url = this.url;
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

  deleteVoucherById(value){
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
          this._voucherService.deleteVoucher(value).subscribe(
            result => {
              this.rerender();
              this.getVoucher();
              this.toastr.success(' Voucher Deleted successfully!', 'Success');
              // this.getVideo();
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }

}
