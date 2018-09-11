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
import {PolicyMasterServices} from '../../Shared/services/policyMaster.services';

@Component({
  selector: 'policyMaster',
  templateUrl: 'policyMaster.template.html',
  styleUrls: ['policyMaster.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, PolicyMasterServices]
})
export class PolicyMasterComponent implements OnInit, AfterViewInit  {
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
  public policyObj: Array<any> = [];
  public policyId: any;
  public policyById: Array<any> = [];
  constructor(private _merchantService: MerchantServices,
              private _policyServices: PolicyMasterServices,
              private toastr: ToastrService,
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
                if (this.empRights[i].name === 'Policy') {
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
    this.getPolicy();
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

  addPolicyModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  editPolicyModal(id, template: TemplateRef<any>) {
    // console.log(id);
    this.policyId = id;
    this.modalEdit = this.modalService.show(template);
    this._policyServices.getPolicyByID(this.policyId)
      .subscribe(
        result => {
          // console.log(result);
          this.policyById = result;
        }
      );
  }
  AddPolicy(value){
    value.createBy = this.empId;
    value.updateBy = this.empId;
    value.status = 'Active';
    // console.log(value);

    this._policyServices.postPolicy(value)
      .subscribe(
        result => {
          this.modalAdd.hide();
          if (result.length !== 0) {
            this.toastr.success(' Policy Added successfully!', 'Success');
            this.rerender();
            this.getPolicy();
          }
        }
      );
  }

  getPolicy(){
    this._policyServices.getAllPolicy()
      .subscribe(
        policyObj => {
          this.policyObj = policyObj;
          // console.log(policyObj);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });
  }

  EditPolicy(value){
    this.modalEdit.hide();
    // console.log(value);

    value.updateBy = this.empId;
    this._policyServices.updatePolicy(this.policyId, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            this.rerender();
            this.getPolicy();
            this.toastr.success(' Policy Updated successfully!', 'Success');

          }
        }
      );
  }
  deletePolicyById(value){
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
          this._policyServices.deletePolicy(value).subscribe(
            result => {
              // that.toastr.success(' Video Tutorial Deleted successfully!', 'Success');
              that.rerender();
              that.getPolicy();
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

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
        that._policyServices.updatestatus(param, param2).subscribe(
          data => {
            if (data !== undefined) {
              that.rerender();
              that.getPolicy();
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

}
