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
import {ToastrService} from 'ngx-toastr';
import * as AWS from 'aws-sdk';
import {SubscriptionServices} from '../../Shared/services/subscription.services';
import {PaymentOptionService} from '../../Shared/services/paymentOption.service';

@Component({
  selector: 'subscriptionList',
  templateUrl: 'subscriptionList.template.html',
  styleUrls: ['subscription.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, SubscriptionServices]
})
export class SubscriptionListComponent implements OnInit, AfterViewInit {
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
  public SubsObj: Array<any> = [];
  public SubsID: any;
  public SubsByID: Array<any> = [];

  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private toastr: ToastrService,
              private _subscriptionServices: SubscriptionServices,
              private _authenticationservice: AuthenticationService) {}

  ngOnInit() {
    const eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'SubscriptionManagement') {
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
   this.getSubscription();
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
  addSubModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  AddSubscription(value){
    // console.log(value);
    value.createBy = this.empId;
    value.updateBy = this.empId;
    this._subscriptionServices.addSubscription(value)
      .subscribe(
        result => {
          this.modalAdd.hide();
          if (result.length !== 0) {
            this.toastr.success(' Payment Option Added successfully!', 'Success');
            this.rerender();
            this.getSubscription();
          }
        }
      );
  }

  getSubscription(){
    this._subscriptionServices.getAllSubscription()
      .subscribe(
        SubsObj => {
          this.SubsObj = SubsObj;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });
  }
  editSubsModal(id, template: TemplateRef<any>) {
    this.SubsID = id;
    this.modalEdit = this.modalService.show(template);
    this._subscriptionServices.getSubscriptionByID(this.SubsID)
      .subscribe(
        result => {
          // console.log(result);
          this.SubsByID = result;
          // console.log(this.SubsByID);
        }
      );
  }
  UpdateSubscription(value){
    this.modalEdit.hide();
    value.updateBy = this.empId;
    this._subscriptionServices.updateSubscription(this.SubsID, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            this.rerender();
            this.getSubscription();
            this.toastr.success(' Video Tutorial Updated successfully!', 'Success');
            // this.getVideo();
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
        that._subscriptionServices.updatestatus(param, param2).subscribe(
          data => {
            if (data !== undefined) {
              that.rerender();
              that.getSubscription();
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

  deleteSubsById(value){
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
          this._subscriptionServices.deleteSubscription(value).subscribe(
            result => {
              // this.toastr.success(' Video Tutorial Deleted successfully!', 'Success');
              that.rerender();
              that.getSubscription();
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }

}
