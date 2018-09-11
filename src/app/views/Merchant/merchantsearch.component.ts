import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {DataTableDirective} from 'angular-datatables';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import * as moment from 'moment';


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
  selector: 'merchantsearch',
  templateUrl: 'merchantsearch.template.html',
  styleUrls: ['merchant.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService]
})


export class MerchantsearchComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  headers = new HttpHeaders();
  // merchant: Merchant[];
  public merchantObj: Merchant[];
  public notimodalAdd: BsModalRef;
  public Records: any;
  private _id: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public notiNo: any;


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }


  ngOnInit() {
    var eid = this.getUser();

    jQuery.extend(jQuery.fn.dataTable.ext.oSort, {
      'date-html-pre': function (a) {
        var year = a.substring(6, 10);
        var dd = a.substring(0, 2);
        var mm = a.substring(3, 5);
        var newDate = new Date(year + '-' + mm + '-' + dd);
        return newDate;
      },

      'date-html-desc': function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
      }
      // 'date-html-asc': function (a, b) {
      //   return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      // },


    });
    // jQuery.extend(jQuery.fn.dataTable.ext.oSort, {
    //   'date-weird-pre': function (date) {
    //     return moment(date, 'mm:ss MMM DD, YY');
    //   },
    //
    //   'date-weird-asc': function (a, b) {
    //     return (a.isBefore(b) ? -1 : (a.isAfter(b) ? 1 : 0));
    //   },
    //
    //   'date-weird-desc': function (a, b) {
    //     return (a.isBefore(b) ? 1 : (a.isAfter(b) ? -1 : 0));
    //   }
    // });
    // jQuery.extend(jQuery.fn.dataTable.ext.oSort, {
    //   'date-nl-pre': function (date) {
    //     return moment(date, 'ddd, MMMM Do, YYYY');
    //   },
    //
    //   'date-nl-asc': function (a, b) {
    //     return (a.isBefore(b) ? -1 : (a.isAfter(b) ? 1 : 0));
    //   },
    //
    //   'date-nl-desc': function (a, b) {
    //     return (a.isBefore(b) ? 1 : (a.isAfter(b) ? -1 : 0));
    //   }
    // });

    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
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
    const that = this;
    this.dtOptions = {
      pageLength: 10,
      // dom: 'l<'pull-right'B>frtip',
      dom: 'lfrtip',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.apiUrl + 'merchant/datatable',
            dataTablesParameters, {
              headers: this.headers
            }
          ).subscribe(resp => {
          that.merchantObj = resp.data;

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [
        {data: 'updatedAt', type: 'date-html'},
        {data: 'verified'},
        {data: 'name'},
        {data: 'firstName'},
        {data: 'lastName'},
        {data: 'email'},
        {data: 'mobileNumber'},
        {data: 'address'},
        {data: 'status'},
        {data: '', orderable: false},
        {data: '', orderable: false},
        {data: '', orderable: false}]
    };
  }

  addNotiModel(mno: any, template: TemplateRef<any>) {
    this.notiNo = mno;
    this.notimodalAdd = this.modalService.show(template);
  }

  sendNotification(value) {
    value.type = 'merchant';
    value.id = this.notiNo;
    if (value.via === 'sms') {
      this._merchantService.sendSms(value)
        .subscribe(
          res => {
               // console.log(res);
          });
    }
    if (value.via === 'noti') {
      this._merchantService.sendNotication(value)
        .subscribe(
          res => {
            // console.log(res);
          });
    }
    if (value.via === 'both') {
      this._merchantService.sendSms(value)
        .subscribe(
          res => {
            // console.log(res);
            this._merchantService.sendNotication(value)
              .subscribe(
                res2 => {
                  // console.log(res2);
                });
          });

    }
    this.notimodalAdd.hide();
  }

  // getMerchantDetails() {
  //   this._merchantService.getAllMerchant()
  //     .subscribe(
  //       res => {
  //         this.merchantObj = res;
  //         // console.log(this.merchantObj);
  //       });
  // }

  getUser() {
    return sessionStorage.getItem('_id');
  }

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

