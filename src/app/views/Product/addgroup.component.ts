import { Component, TemplateRef, OnInit } from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {Router} from "@angular/router";
import {ProductService} from "../../Shared/services/product.service";

@Component({
  selector: 'addgroup',
  templateUrl: 'addgroup.template.html',
  providers: [ProductService, MerchantServices]
})

export class AddgroupComponent {
  public tmpexampleData1: Array<any> = [];
  public proCat: Array<any> = [];
  public proCatObj: Array<any> = [];
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  constructor(private toastr: ToastrService,
              private modalService: BsModalService,
              private _productService: ProductService,
              private router: Router,
              private _merchantService: MerchantServices) {
  }
  ngOnInit() {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          if (res[0].profile !== undefined) {
            this.empId = res[0]._id;
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'Category') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }
          }

        });
    this.getProductCategory();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }
  getProductCategory() {
    this._productService.getAllProductCategory()
      .subscribe(
        res => {
          this.proCatObj = res;
          for (let i = 0; i < this.proCatObj.length; i++) {
            this.tmpexampleData1.push({'id': this.proCatObj[i]._id, 'text': this.proCatObj[i].name});
          }
          this.proCat = this.tmpexampleData1;
        });
  }

  add_group(value) {
    // console.log(value);
}
}
