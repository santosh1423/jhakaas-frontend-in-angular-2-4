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

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

class Merchant {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String
  };
  status: string;
}


@Component({
  selector: 'pendingmerchant',
  templateUrl: 'pendingmerchant.template.html',
  providers: [MerchantServices, HttpClient, AuthenticationService]
})
export class PendingmerchantComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  headers = new HttpHeaders();
  public merchantObj: Merchant[];
  public notimodalAdd: BsModalRef;
  private count: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;

  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }

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
                if (this.empRights[i].name === 'MerchantManagement') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    // this.getMerchantDetails();
    const that = this;
    this.dtOptions = {
      pageLength: 10,
      // dom: 'l<"pull-right"B>frtip',
      dom: 'lfrtip',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.apiUrl + 'merchant/pending',
            dataTablesParameters, {
              headers: this.headers
            }
          ).subscribe(resp => {
          that.merchantObj = resp.data;
          that.count = resp.recordsTotal;

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'name'},
        {data: 'firstName'},
        {data: 'email'},
        {data: 'mobileNumber'},
        {data: 'address'},
        {data: 'status'},
        {data: '', orderable: false},
        {data: '', orderable: false}]
    };
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  // getMerchantDetails() {
  //   this._merchantService.getPendingMerchant()
  //     .subscribe(
  //       res => {
  //         this.merchantObj = res;
  //         this.count = res.length;
  //         // console.log(this.merchantObj);
  //         this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //           // Destroy the table first
  //           dtInstance.destroy();
  //           // Call the dtTrigger to rerender again
  //           this._dtTrigger.next();
  //         });
  //       });
  // }
  // statuschange(param: any, param2: any) {
  //   const get = this;
  //   swal({
  //     title: 'Are you sure?',
  //     text: 'To change the status!',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Change it!'
  //   }).then(function () {
  //       get._merchantService.updatestatus(param, param2).subscribe(
  //         data => {
  //           get.getMerchantDetails();
  //         }
  //       );
  //       swal(
  //         'Updated!',
  //         'Your status has been updated.',
  //         'success'
  //       );
  //     }
  //   );
  // }
}

