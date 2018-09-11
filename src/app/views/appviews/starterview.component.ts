import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {CountryService} from "../../Shared/services/country.service";
import {CategoryServices} from "../../Shared/services/category.services";
import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {MerchantServices} from "../../Shared/services/merchant.services";
import {GeoLocation} from "../../Shared/services/geoLocation";
import {ActivatedRoute, Router} from '@angular/router';
import {StarterviewService} from "../../Shared/services/starterview.service";
import * as moment from 'moment';

@Component({
  selector: 'starter',
  templateUrl: 'starter.template.html',
  providers: [MerchantServices, GeoLocation, CategoryServices, CountryService, StarterviewService]
})
export class StarterViewComponent implements OnDestroy, OnInit  {

  public nav:any;
  public modalAdd: BsModalRef;
  public merlen: any;
  public custlen: any;
  public prolen: any;
  public catlen: any;
  public paylen: any;
  public orderlen = 0;
  public showcustom = false;
  public ShowFilter = false;
  public maxDate: any;
  public abc = [];




constructor( private modalService: BsModalService,
             private toastr: ToastrService,
             private router: Router,
             private _starterviewService: StarterviewService) {
  this.nav = document.querySelector('nav.navbar');
  this.abc.push({
    type : 'All'
  });
}




ngOnInit():any {
    this.countMerchant(this.abc[0]);
    this.countCustomer(this.abc[0]);
    this.countProduct(this.abc[0]);
    this.countCategory(this.abc[0]);
    this.countPayment(this.abc[0]);
    this.countOrder(this.abc[0]);
    this.nav.className += " white-bg";
    this.maxDate = new Date();
}


public ngOnDestroy():any {
  this.nav.classList.remove("white-bg");
}



countMerchant(value) {
  this._starterviewService.getMerchantCount(value)
    .subscribe(
      Obj => {
          this.merlen = Obj.len;
      });
}
countCustomer(value) {
  this._starterviewService.getCustomerCount(value)
    .subscribe(
      Obj => {
          this.custlen = Obj.len;
      });
}
countProduct(value) {
  this._starterviewService.getProductCount(value)
    .subscribe(
      Obj => {
          this.prolen = Obj.len;
      });
}
countCategory(value) {
  this._starterviewService.getCategoryCount(value)
    .subscribe(
      Obj => {
          this.catlen = Obj.len;
      });
}
countPayment(value) {
  this._starterviewService.getPaymentCount(value)
    .subscribe(
      Obj => {
          this.paylen = Obj.len;
      });
}
countOrder(value) {
  this._starterviewService.getOrderCount(value)
    .subscribe(
      Obj => {
          this.orderlen = Obj.count;
          console.log(this.orderlen);
      });
}

  filter(value) {
     var date = new Date();

    // console.log(date);
    if (value.filtValue === '7') {

      value.type = '';
      console.log(date);
      // 'YYYY-MM-DD'
      value.endDate = moment(date).format();
      console.log(value.endDate);
      value.startDate = moment(date.setDate(date.getDate() - 7)).format();
      this.countMerchant(value);
      this.countCustomer(value);
      this.countProduct(value);
      this.countCategory(value);
      this.countPayment(value);
      this.countOrder(value);
    }if (value.filtValue === '30') {
      value.type = '';
      value.endDate = moment(date).format();
      value.startDate = moment(date.setDate(date.getDate() - 30)).format();
      this.countMerchant(value);
      this.countCustomer(value);
      this.countProduct(value);
      this.countCategory(value);
      this.countPayment(value);
      this.countOrder(value);
    }if (value.filtValue === '365') {
      value.type = '';
      value.endDate = moment(date).format();
      value.startDate = moment(date.setDate(date.getDate() - 365)).format();
      this.countMerchant(value);
      this.countCustomer(value);
      this.countProduct(value);
      this.countCategory(value);
      this.countPayment(value);
      this.countOrder(value);
    }if (value.filtValue === 'custom') {
      value.type = '';
      value.endDate = moment(value.tofrom[1]).format();
      value.startDate = moment(value.tofrom[0]).format();
      delete  value.tofrom;
      this.countMerchant(value);
      this.countCustomer(value);
      this.countProduct(value);
      this.countCategory(value);
      this.countPayment(value);
      this.countOrder(value);
    }if (value.filtValue === '') {
      value.type = 'All';
      this.countMerchant(value);
      this.countCustomer(value);
      this.countProduct(value);
      this.countCategory(value);
      this.countPayment(value);
      this.countOrder(value);
    }
    delete value.filtValue;
}

  addCatModel() {
    if (this.ShowFilter === true) {
      this.ShowFilter = false;
    }
    else if (this.ShowFilter === false) {
      this.ShowFilter = true;
    }
    // this.modalAdd = this.modalService.show(template);
  }

  SelectedFilter(value) {
    // console.log(value);
    if (value === 'custom') {
      this.showcustom = true;
    } else {
      this.showcustom = false;
    }
  }

  closeFilter() {
    this.ShowFilter = false;
  }

}
