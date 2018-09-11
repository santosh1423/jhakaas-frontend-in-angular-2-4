import {Component, OnInit, TemplateRef} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import swal from 'sweetalert2';
import {ScreenList} from '../../Shared/model/ScreenList';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {RightsmanagementService} from '../../Shared/services/rightsmanagement.service';
import {MerchantServices} from '../../Shared/services/merchant.services';


@Component({
  selector: 'rightmanagement',
  templateUrl: 'rightmanagement.template.html',
  styleUrls: ['systemsetting.component.css'],
  providers: [RightsmanagementService, MerchantServices]
})
export class RightmanagementComponent implements OnInit {
  public modalAdd: BsModalRef;
  public modalUpdate: BsModalRef;
  public profileName: Array<any> = [];
  public profileObj: Array<any> = [];
  public profileAllObj: any;
  public nameList: any;
  public tmpexampleData: Array<any> = [];
  public employeeObj: Array<any> = [];
  public empName: Array<any> = [];
  public showuser = false;
  public allemployeeObj: Array<any> = [];
  public userName: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  private tmpexampleData2: Array<any> = [];
  public profileid: any;
  public pName: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  // public profileactive:  Array<any> = [''];
  public refresehedemp: Array<any> = [];

  constructor(private modalService: BsModalService, private _merchantService: MerchantServices,
              private _rightsmanagementService: RightsmanagementService,
              private toastr: ToastrService) {
  }

  public openModal(Addtemplate: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(Addtemplate);
  }

  ngOnInit() {
    this.getAllprofile();
    this.showlist();
  }

  getAllprofile() {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          if (res[0].profile !== undefined) {
            this.empId = res[0]._id;
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'UserRightsManagement') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    this._rightsmanagementService.getAllprofileName()
      .subscribe(
        employeeObj => {
          this.profileObj = employeeObj;
          this.tmpexampleData = [];
          this.profileName = [];
          for (let i = 0; i < this.profileObj.length; i++) {
            var name = this.profileObj[i].profile.name;
            this.tmpexampleData.push({'id': this.profileObj[i]._id, 'text': name});
            name = '';
          }
          this.profileName = this.tmpexampleData;
        });
  }

  showlist() {
    this._rightsmanagementService.getProfileMasterName()
      .subscribe(
        listObj => {
          this.nameList = listObj;
          this.tmpexampleData2 = [];
          for (let i = 0; i < this.nameList.length; i++) {
            this.tmpexampleData2.push({
              name: this.nameList[i].name,
              view: false,
              add: false,
              edit: false,
              delete: false
            });
          }
          this.profileAllObj = this.tmpexampleData2;
        });
  }

  getSelectedProfileData(value) {
    this._rightsmanagementService.getSelectedProfileData(value)
      .subscribe(
        employeeObj => {
          this.profileAllObj = [];
          if (employeeObj[0].profile.screen.length > 0) {
            this.profileAllObj = employeeObj[0].profile.screen;
          } else {
            this.profileAllObj = [];
            this.showlist();
          }
        });
  }

  rights() {
    if (this.refresehedemp !== null || this.refresehedemp !== undefined) {
      this.empName = this.refresehedemp;
    } else {
      this.empName = this.empName;
    }

    for (let i = 0; i < this.empName.length; i++) {
      this._rightsmanagementService.putEmployee(this.empName[i].id, this.profileid)
        .subscribe(
          employeeObj => {
            this.toastr.success('Profile Saved Successfully!', 'Good job!');
          });
    }
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  onClick(id: any, name: any, evt: any) {
    if ( id !== undefined && name !== undefined && evt !== undefined) {
      this._rightsmanagementService.updateScreenEvent(this.profileid, id, name, evt)
        .subscribe(
          result => {
          }
        );
    }

  }

  add_profile(value) {
    var name = value.pname;
    var a = [];
    // this.profileAllObj = [];
    this.showlist();
    a.push({
      profile: {
        name: name,
        screen: this.profileAllObj
      }
    })
    this._rightsmanagementService.postProfile(a[0])
      .subscribe(
        result => {
          if (result.profile.name !== null) {
            this.modalAdd.hide();
            this.toastr.success('Added Successfully!', 'Good job!');
            this.getAllprofile();
          }
        }
      );
  }

  refreshValue1(value) {
    this.refresehedemp = value;
  }

  refreshValue(value) {
    this.profileid = value.id;
    this.getSelectedProfileData(value.text);
    this._rightsmanagementService.getSelectedprofile(value.id)
      .subscribe(
        employeeObj => {
          this.employeeObj = employeeObj;

          for (let i = 0; i < this.employeeObj.length; i++) {
            this.tmpexampleData1.push({'id': this.employeeObj[i]._id, 'text': this.employeeObj[i].firstName});
          }
          this.empName = this.tmpexampleData1;
          this.tmpexampleData1 = [];

          this._rightsmanagementService.getRemprofile()
            .subscribe(
              allemployeeObj => {
                this.allemployeeObj = allemployeeObj;

                for (let i = 0; i < this.allemployeeObj.length; i++) {
                  this.tmpexampleData2.push({'id': this.allemployeeObj[i]._id, 'text': this.allemployeeObj[i].firstName});
                }
                this.userName = this.tmpexampleData2;
              });
        });

  }

  deleteProfile() {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    })
      .then((Delete) => {
        if (Delete) {
          swal(
            'Deleted!',
            'Your Record has been Deleted.',
            'success'
          );
          if (this.profileid !== undefined) {
            this._rightsmanagementService.deleteProfileService(this.profileid)
              .subscribe(
                employeeObj => {
                  if (employeeObj === null) {
                    this.profileName = [''];
                    this.toastr.success('Profile Deleted Successfully', 'Success!')
                    this.getAllprofile();
                  }
                });
          }
        } else {
          swal('Your record is safe!');
        }
      });
  }

}
