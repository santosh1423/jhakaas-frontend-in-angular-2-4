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
import {CustomerModule} from "./customer.module";
import {CustomerlistService} from "../../Shared/services/customerlist.service";

@Component({
  selector: 'customerList',
  templateUrl: 'customerList.template.html',
  providers: [MerchantServices, HttpClient, AuthenticationService, CustomerlistService]
})
export class CustomerListComponent implements OnInit , AfterViewInit {
  public modalView: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public custObj:any;
  public custViewObj: any;
  public custId: any;
  public count: Array<any> = [];
  constructor(private _merchantService: MerchantServices,
              private _customerService : CustomerlistService,
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
                if (this.empRights[i].name === 'CustomerList') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    this.getCustomerList();
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
  viewCustModal(id,template: TemplateRef<any>) {
    // console.log(id);
    this.modalView = this.modalService.show(template);
    this._customerService.getCustomerById(id)
      .subscribe(
        custViewObj => {
          this.custViewObj = custViewObj;
          // console.log(this.custViewObj);
        });
  }


  getCustomerList(){
    this._customerService.getAllCustomer()
      .subscribe(
        custObj => {
          this.custObj = custObj;
          // console.log(this.custObj);
          this.custId = this.custObj;

          for (let i = 0; i < this.custObj.length; i++) {
            this._customerService.getCustomerOrderCount(this.custObj[i]._id)
              .subscribe(
                custObj1 => {
                  this.count[i] = custObj1;
                  // console.log(this.count[i].length);
                  this.custObj[i].count = this.count[i].length;
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

}
