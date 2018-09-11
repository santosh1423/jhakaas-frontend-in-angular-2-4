import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {CountryService} from '../../Shared/services/country.service';
import {HsnmasterService} from '../../Shared/services/hsnmaster.service';


var _ = require('lodash');

@Component({
  selector: 'addHSN',
  templateUrl: 'addHSN.template.html',
  styleUrls: ['hsnmaster.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, CountryService, HsnmasterService]
})
export class AddHSNComponent implements OnInit, AfterViewInit {
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
  public hsnObj: Array<any> = [];
  public hsnById: any;
  public countryData: Array<any> = [];
  public countryObj: any;
  public hsnID: any;
  public temp = [];
  public activeCountry: any[];
  public countryU: any;
  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private http: HttpClient,
              private _countryService: CountryService,
              private _hsnmasterService: HsnmasterService,
              private _authenticationservice: AuthenticationService) {}

  ngOnInit() {
    this.getHSN();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'HSNMaster') {
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
    this._countryService.getCountry()
      .subscribe(
        countryObj => {
          this.countryObj = countryObj;
          this.countryData = [];
          for (let i = 0; i < this.countryObj.length; i++) {
            this.countryData.push({'id': this.countryObj[i]._id, 'text': this.countryObj[i].name});
          }
          this.countryObj = this.countryData;
        });

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

  addHSNModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  editHSNModal(id, template: TemplateRef<any>) {
    this.activeCountry = [];
    this.temp.length = 0;
    this.hsnID = id;
    this.modalEdit = this.modalService.show(template);
    this._hsnmasterService.getHSNByID(id)
      .subscribe(
        result => {
          console.log(result);
          this.hsnById = result;
          if (this.hsnById.country !== undefined) {
            // this.activeCountry = this.hsnById.country;

            this._countryService.getCountryByName2(this.hsnById.country).subscribe( res => {
              var a = res[0];
              if (res !== undefined) {
                this.temp.push({'id': a._id, 'text': a.name});
                this.activeCountry = this.temp[0];
              }
            });
          }
        }
      );
  }
  getHSN() {
    this._hsnmasterService.getAllHsn()
      .subscribe(
        hsnObj => {
          this.hsnObj = hsnObj;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });
  }

  AddHSN(value) {
    value.country = value.country[0].text;
    // this.modalAdd.hide();
    console.log(value);
    value.createBy = this.empId;
    value.updateBy = this.empId;
    this._hsnmasterService.postHSN(value)
      .subscribe(
        result => {
          this.modalAdd.hide();
          if (result.length !== 0) {
            this.toastr.success(' HSN Code Added successfully!', 'Success');
            this.rerender();
            this.getHSN();
          }
        }
      );
  }
  // to get country data
  getCountryId(value) {
    console.log(value);
    this.countryU = value.text;
  }


  EditHSN(value) {
    this.modalEdit.hide();
    if (this.countryU !== undefined) {
      value.country = this.countryU.text;
      console.log(this.countryU);
    }

    value.updateBy = this.empId;
    console.log(value);
    this._hsnmasterService.updateHSN(this.hsnID, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            // this.rerender();
            this.getHSN();
            this.modalEdit.hide();
            this.toastr.success('HSN Code Updated successfully!', 'Success');

          }
        }
      );
  }

  statuschange(param: any, param2: any) {
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'To change the status!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then(function () {
        that._hsnmasterService.updatestatus(param, param2).subscribe(
          data => {
            if (data !== undefined) {
              // that.rerender();
              that.getHSN();
            }
          }
        );
        swal(
          'Updated!',
          'Your status has been updated.',
          'success'
        );
      }
    );
  }

}
