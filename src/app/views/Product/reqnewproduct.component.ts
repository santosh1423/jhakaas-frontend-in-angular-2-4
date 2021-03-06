import {Component, TemplateRef, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";
import {DataTableDirective} from "angular-datatables";
import {CategoryServices} from "../../Shared/services/category.services";
import {ProductService} from '../../Shared/services/product.service';

@Component({
  selector: 'pricechange',
  templateUrl: 'reqnewproduct.template.html',
  providers: [MerchantServices, ProductService]
})
export class ReqnewproductComponent implements OnInit , AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  public reqProObj: any;
  public modalUpdate: BsModalRef;
  public modalList: BsModalRef;
  public prodbaseId: any;
  public prodIDs: any;

  constructor(private toastr: ToastrService, private _merchantService: MerchantServices,
              private route: ActivatedRoute, private _productService: ProductService,
              private modalService: BsModalService) {}

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
                if (this.empRights[i].name === 'ProductDataManagement') {
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
      dom: 'lfrtip'
      // processing: true,
      // Configure the buttonslfrtiplfrtip

    };
    this.getUnderEnquiryProduct();
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
  getUnderEnquiryProduct() {
    this._productService.getReqUnderEnquiry()
      .subscribe(
        res => {
          this.reqProObj = res;
          // console.log(this.reqProObj);
          this.rerender();
          // if (this.reqProObj !== undefined) {
          //   for (let i = 0; i < this.reqProObj.length; i++) {
          //     this.reqProObj[i].mid = this.
          //   }
          // }
        });
  }

  getChangePriceModal(proid, Updatetemplate: TemplateRef<any>) {
    // console.log(proid);
    this._productService.getproProBy(proid)
      .subscribe(
        res => {
          this.prodbaseId = res.proprietary.mid;
          // console.log(this.prodbaseId);
        });
    this.modalUpdate = this.modalService.show(Updatetemplate);
  }
  getMerchantListModal(Updatetemplate: TemplateRef<any>) {
    this.modalList = this.modalService.show(Updatetemplate);
  }
  UpdatePrice(value) {
    value.status = 'Active';
    this.modalUpdate.hide();
    // console.log(this.prodIDs);
    for (let i = 0; i < this.prodIDs.length; i++) {
      this._productService.updateProductPrice(this.prodIDs[i]._id, JSON.stringify(value))
        .subscribe(
          data => {
            // if (data.length !== 0) {
            this.toastr.success(name + ' Update successfully!', 'Success');
            // }
          }
        );
    }
    // console.log(value);
  }
}
