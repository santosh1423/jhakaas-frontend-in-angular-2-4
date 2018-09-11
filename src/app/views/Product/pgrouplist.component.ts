import {Component, TemplateRef, OnInit, ViewChildren, QueryList} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs/Subject";
import {GeoLocation} from "../../Shared/services/geoLocation";
import {DomSanitizer} from "@angular/platform-browser";
import {CategoryServices} from "../../Shared/services/category.services";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'pgrouplist',
  templateUrl: 'pgrouplist.template.html',
  providers: [MerchantServices, CategoryServices]
})
export class PgrouplistComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  _dtElements: QueryList<DataTableDirective>;
  dtOptions: any = {};
  _dtTrigger: any = new Subject();
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  get dtTrigger(): any {
    return this._dtTrigger;
  }

  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }

  constructor(private toastr: ToastrService, private _merchantService: MerchantServices,
              private route: ActivatedRoute,
               private modalService: BsModalService,) {}
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
    this.dtOptions = {
      dom: 'l<"pull-right"B>frtip',
      // processing: true,
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

}
