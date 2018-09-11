import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {identifierModuleUrl} from "@angular/compiler";
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {SystemsettingService} from "../../Shared/services/systemsetting.service";

@Component({
  selector: 'sms',
  templateUrl: 'sms.template.html',
  styleUrls: ['systemsetting.component.css'],
  providers: [HttpClient, AuthenticationService, MerchantServices, SystemsettingService]
})
export class SmsComponent implements OnInit , AfterViewInit  {
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
  public smsObj: any;
  public SmsById: any;
  public SmsID: any;

  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private http: HttpClient,
              private _systemSettingService : SystemsettingService,
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
                if (this.empRights[i].name === 'UserRightsManagement') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    this.getSMS();

  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
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

  addSMSModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  AddSms(value){
    value.createBy = this.empId;
    value.updateBy = this.empId;
    // console.log(value);
    this._systemSettingService.postSMS(value)
      .subscribe(
        result => {
          this.modalAdd.hide();
          if (result.length !== 0) {
            this.toastr.success(' SMS API Added successfully!', 'Success');
            this.rerender();
            this.getSMS();
          }
        }
      );
  }

  getSMS(){
    this._systemSettingService.getAllSMS()
      .subscribe(
        smsObj => {
          this.smsObj = smsObj;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });
  }

  editSMSModal(id, template: TemplateRef<any>) {
    this.SmsID = id;
    this.modalEdit = this.modalService.show(template);
    this._systemSettingService.getSmsByID(this.SmsID)
      .subscribe(
        result => {
          this.SmsById = result;
        }
      );
  }
  EditSMS(value){
    this.modalEdit.hide();
    // console.log(value);

    value.updateBy = this.empId;
    this._systemSettingService.updateSMS(this.SmsID, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            this.rerender();
            this.getSMS();
            this.toastr.success(' SMS API Updated successfully!', 'Success');

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
        that._systemSettingService.updateSMSstatus(param, param2).subscribe(
          data => {
            if (data !== undefined) {
              that.rerender();
              that.getSMS();
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

  isDefaultchange(param: any, param2: any) {
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
        that._systemSettingService.updateisDefault(param, param2).subscribe(
          data => {
            if (data !== undefined) {
              that.rerender();
              that.getSMS();
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

  deleteSMSById(value){
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
          this._systemSettingService.deleteSMS(value).subscribe(
            result => {
              // that.toastr.success(' Video Tutorial Deleted successfully!', 'Success');
              that.rerender();
              that.getSMS();
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }

}
