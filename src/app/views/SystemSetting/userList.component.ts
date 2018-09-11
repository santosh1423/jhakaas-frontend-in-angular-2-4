import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SystemsettingService} from '../../Shared/services/systemsetting.service';
import {DataTableDirective} from 'angular-datatables';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';

@Component({
  selector: 'userList',
  templateUrl: 'userList.template.html',
  providers: [SystemsettingService, MerchantServices]
})
export class UserListComponent implements OnInit, AfterViewInit {
  public resetpass: BsModalRef;
  public employeeObj;
  public user_ID: any;

  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  _dtTrigger: any = new Subject();
  dtOptions: any = {};
  get dtTrigger(): any {
    return this._dtTrigger;
  }
  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }
  value: any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  constructor( private _systemSettingService: SystemsettingService,
               private toastr: ToastrService,
               private modalService: BsModalService,
               private _merchantService: MerchantServices) { };
  ngOnInit(): void {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'User') {
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
      // ajax: 'data/data.json',
      // dom: '<"top"f>l<"pull-right"B>rtip',
      dom: 'l<"pull-right"B>frtip',
      'language': {
        'processing': 'DataTables is currently busy'
      },
      // Configure the buttonslfrtip
      buttons: [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ]
    };
    this.getAllEmployee();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  getAllEmployee() {
    this._systemSettingService.getemployee()
      .subscribe(
        employeeObj => {
          this.employeeObj = employeeObj;
          // console.log(this.employeeObj );
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
        });
  }

  getPasswordById(params: any, Updatetemplate: TemplateRef<any>) {
    this.resetpass = this.modalService.show(Updatetemplate);
    // console.log(params);
    this._systemSettingService.getempByID(params)
      .subscribe(
        (categoryData => {
          if (categoryData !== null) {
            this.user_ID = categoryData.user;
            // console.log(this.user_ID);
          }
        })
      );
  }

  resetpassword(value) {
// console.log(JSON.stringify(value));
this._systemSettingService.resetPassEmp(this.user_ID , value)
  .subscribe(
    (res => {
      if (res.success === true) {
        // console.log(res);
        this.toastr.success('Password update succsefully');
        this.resetpass.hide();
      }
    })
  );
  }

  resetpasshide(){
this.resetpass.hide();
  }

}


