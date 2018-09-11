import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VideotutorialsService} from "../../Shared/services/videotutorials.service";
import {identifierModuleUrl} from "@angular/compiler";
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'voucherReedem',
  templateUrl: 'voucherReedem.template.html',
  // styleUrls: ['voucherManagement.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService]
})
export class VoucherReedemComponent implements OnInit, AfterViewInit  {
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
  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
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
                if (this.empRights[i].name === 'VoucherManagement') {
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

  }

  getUser() {
    return sessionStorage.getItem('_id');
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

}
