import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { ActivatedRoute } from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from "angular-datatables";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'merchantOrder',
  templateUrl: 'merchantOrder.template.html',
  providers: [MerchantServices]
})

export class MerchantOrderComponent implements OnInit, AfterViewInit {
  dtOptions: any;
  // @ViewChild('tofrom')
  // tofrom: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private sub: any;
  public id: any;
  public orderObj: any;
  _dtTrigger: any = new Subject();
  public todate: any;
  public fromdate: any;
  public tofrom: any;
  public defstatus= 'All';

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public shopName: any;
  public page: any;
  public maxDate: any;
  public loadingtext = 'Please Wait....';

  get dtTrigger(): any {
    return this._dtTrigger;
  }
  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }
  constructor( private _merchantService: MerchantServices, private route: ActivatedRoute, private spinner: NgxSpinnerService
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
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

    this._merchantService.getMerDetails(this.id)
      .subscribe(res1 => {
        this.shopName = res1.name;
        // this.shopName = res1.name;
      });
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
    this._merchantService.getOrder1(this.id, this.todate,  this.fromdate)
      .subscribe(res1 => {
        this.orderObj = res1;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this._dtTrigger.next();
        });
      });
    this.dtOptions = {
      // ajax: 'data/data.json',
      // dom: 'lfrtip',
      dom: 'l<"pull-right"B>frtip',
      processing: true,
      // Configure the buttonslfrtiplfrtip
      buttons: [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ]
    };
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  orderSearch(value: any) {
    this.spinner.show();
    // console.log( value.tofrom );
    // this.todate = new Date();
    // this.todate = moment(this.todate).format('YYYY/MM/DD')
    value.tofrom[1].setHours(23,59,59,999);
    value.tofrom[1].toUTCString();

    value.tofrom[0].setHours(0,0,0,0);
    value.tofrom[0].toUTCString();

    value.todate = moment(value.tofrom[1]).utc(value.tofrom[1]).format('llll');
    value.fromdate = moment(value.tofrom[0]).utc(value.tofrom[0]).format('llll');
    console.log( value.todate );
    console.log( value.fromdate );
    // delete value.tofrom;

    if(value.status === 'All'){
      this._merchantService.getOrder1(this.id, value.todate, value.fromdate)
        .subscribe(res => {
          this.spinner.hide();
          this.orderObj = res;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
        });
    }else {
      this._merchantService.getOrder(this.id, value)
        .subscribe(res => {
          this.spinner.hide();
          this.orderObj = res;
          // console.log(this.orderObj);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
        });
    }


  }
}
