import { Component, OnInit, TemplateRef } from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';

@Component({
  selector: 'orderview',
  templateUrl: 'orderview.template.html',
  providers: [MerchantServices]
})

export class OrderviewComponent implements OnInit {
  private sub: any;
  private _id: String;
  public orderIDObj: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public page: any;
  public merview =  false;
  public custview =  false;
  constructor( private _merchantService: MerchantServices, private route: ActivatedRoute) {  }

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

    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this.page = params['orderview'];
      // console.log(this.page);
      if (this.page === 'merview') {
        this.custview = true;
      }else if (this.page === 'custview') {
        this.merview = true;
      }
    });
    this.getOrderDetails();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }
  printinvoice() {
    var content = document.getElementById('printinvoice').innerHTML;
    var mywindow = window.open('', 'Invoice', 'height=600,width=800');

    mywindow.document.write('<html><head><title style="font-size: 18px">Invoice</title>');
    mywindow.document.write('</head><body>');
    // mywindow.document.write('<label>Invoice</label>');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus()
    mywindow.print();
    mywindow.close();
    return true;
  }

  getOrderDetails () {
    // console.log(this._id);
    this._merchantService.getByIdOrder(this._id)
      .subscribe(
        orderObj => {
          this.orderIDObj = orderObj;
          // console.log(this.orderIDObj);
          this.orderIDObj.orderDate = moment(this.orderIDObj.orderDate).utc(this.orderIDObj.orderDate).format('llll');
          // console.log(Object.getOwnPropertyNames(this.orderIDObj));
          // this.orderIDObj.items[0].price = '23.50' ;
          // console.log(orderObj.items[0].price);
        });
  }

}
