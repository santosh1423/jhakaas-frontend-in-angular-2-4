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
import {SubscriptionServices} from '../../Shared/services/subscription.services';
import {ToastrService} from 'ngx-toastr';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'subscriptionManagement',
  templateUrl: 'subscriptionManagement.template.html',
  styleUrls: ['subscription.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, SubscriptionServices]
})
export class SubscriptionManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public tofrom: any;
  public merSubcription: any;
  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private http: HttpClient,
              private toastr: ToastrService,
              private _subscriptionServices: SubscriptionServices,
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
                if (this.empRights[i].name === 'SubscriptionManagement') {
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
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  filter(value) {
    console.log(JSON.stringify(value));
    if (value.number === '') {
      delete value.number;
    }
    this._subscriptionServices.getMerSubscription(value)
      .subscribe(
        result => {
          console.log(result);
          if (result.length !== 0) {
            this.merSubcription = result;
            // this.toastr.success(' Payment Option Added successfully!', 'Success');
            // this.rerender();
            // this.getSubscription();
          }
        }
      );
  }
}
