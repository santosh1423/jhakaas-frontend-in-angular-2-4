import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {SystemsettingService} from '../../Shared/services/systemsetting.service';

@Component({
  selector: 'myprofile',
  templateUrl: 'myprofile.template.html',
  providers: [MerchantServices, SystemsettingService]
})
export class MyProfileComponent implements OnInit {
  public address:  Array<any> = [];
  public maxDate: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public employeeObj: any;
  public empId: any;

  constructor( private toastr: ToastrService,
               private _merchantService: MerchantServices,
               private _systemSettingService: SystemsettingService) { };

  ngOnInit() {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.employeeObj = res[0];
          // if (res[0].profile !== undefined) {
          //   this.empRights = res[0].profile.profile.screen;
          //   if (this.empRights !== undefined) {
          //     for (let i = 0; i < this.empRights.length; i++) {
          //       if (this.empRights[i].name === 'User') {
          //         this.view = this.empRights[i].view;
          //         this.add = this.empRights[i].add;
          //         this.edit = this.empRights[i].edit;
          //         this.delete = this.empRights[i].delete;
          //       }
          //     }
          //   }
          //   this.empId = res[0]._id;
          // }

        });
    this.maxDate = new Date();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  updateUser(value) {
    value.type = 'Employee';
    this.address.push(
      {'name': value.name,
        'address1': value.address1,
        'landmarks': value.landmarks,
        'city': value.city,
        'state': value.state,
        'country': value.country,
        'postalCode': value.postalCode,

      });
    value.address = this.address;
    const putdata = value;
    this._systemSettingService.updateUserService(this.employeeObj._id , JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success(name + ' Update successfully!', 'Success');
          }

        }
      );
  }

}
