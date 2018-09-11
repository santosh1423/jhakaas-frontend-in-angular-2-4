import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {SmsAndNotificationService} from '../../Shared/services/sms&notification';
import {identifierModuleUrl} from '@angular/compiler';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'sendNotification',
  templateUrl: 'sendNotification.template.html',
  providers: [HttpClient, AuthenticationService, MerchantServices, SmsAndNotificationService]
})
export class SendNotificationComponent implements OnInit  {
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
  public videoObj: Array<any> = [];
  public videoById: Array<any> = [];
  public videoID: any;
  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
              private smsnoti: SmsAndNotificationService,
              private modalService: BsModalService,
              private http: HttpClient,
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

  }

  getUser() {
    return sessionStorage.getItem('_id');
  }
  sendNotifications(value) {
    if (value.Via === 'SMS') {
      this.smsnoti.sendSMS(value)
        .subscribe(
          result => {
            if (result.success === true) {
              this.toastr.success('Your SMS are Send Successfully!', 'Good job!');
            }
          }
        );
    } else {
      this.smsnoti.sendNOTI(value)
        .subscribe(
          result => {
            if (result.success === true) {
              this.toastr.success('Your Notification are Send Successfully!', 'Good job!');
            }
          }
        );
    }
  }
}
