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
import {ActivatedRoute} from '@angular/router';
import {CustomerlistService} from '../../Shared/services/customerlist.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'customerOrder',
  templateUrl: 'customerOrder.template.html',
  providers: [MerchantServices, HttpClient, AuthenticationService, CustomerlistService]
})
export class CustomerOrderComponent implements OnInit {
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
  private sub: any;
  public id: any;
  public firstName: any;
  public lastName: any;
  public orderObj: any;
  public todate: any;
  public fromdate: any;
  public tofrom: any;
  public defstatus= 'All';
  public maxDate: any;
  public loadingtext = 'Please Wait...';

  constructor( private _merchantService: MerchantServices,
               private route: ActivatedRoute,
               private spinner: NgxSpinnerService,
               private _custService: CustomerlistService) {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

  ngOnInit() {
    this.maxDate = new Date();
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
    this.dtOptions = {
      dom: 'l<"pull-right"B>frtip',
      // processing: true,
      // Configure the buttonslfrtiplfrtip
    };
    this.todate = new Date();
    this.tofrom = [new Date(), new Date()];

    var start = new Date();
    start.setHours(0,0,0,0);
    start.toUTCString();
    this.fromdate = start;
    this.fromdate = moment(this.fromdate).utc(this.fromdate).format('llll');


    var start1 = new Date();
    start1.setHours(23,59,59,999);
    start1.toUTCString();
    this.todate = start1;
    this.todate = moment(this.todate).utc(this.todate).format('llll');
    this._custService.getOrder1(this.id, this.todate,  this.fromdate)
      .subscribe(res1 => {
        this.orderObj = res1;
      });
    this._custService.getCustomerById(this.id)
      .subscribe(res1 => {
        this.firstName = res1.firstName;
        this.lastName = res1.lastName;
        // this.custName = res1.name;
      });
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  orderSearch(value: any) {
    this.spinner.show();
    // this.todate = new Date();
    // this.todate = moment(this.todate).format('YYYY/MM/DD')
    value.tofrom[1].setHours(23,59,59,999);
    value.tofrom[1].toUTCString();

    value.tofrom[0].setHours(0,0,0,0);
    value.tofrom[0].toUTCString();

    value.todate = moment(value.tofrom[1]).utc(value.tofrom[1]).format('llll');
    value.fromdate = moment(value.tofrom[0]).utc(value.tofrom[0]).format('llll');
    delete value.tofrom;
    if (value.status === 'All') {
      this._custService.getOrder1(this.id, value.todate, value.fromdate)
        .subscribe(res => {
          this.spinner.hide();
          this.orderObj = res;

        });
    }else {
      this._custService.getOrder(this.id, value)
        .subscribe(res => {
          this.spinner.hide();
          this.orderObj = res;
        });
    }


  }
}
