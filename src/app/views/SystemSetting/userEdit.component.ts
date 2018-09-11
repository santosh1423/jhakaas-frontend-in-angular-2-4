import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import * as AWS from 'aws-sdk';
import {SystemsettingService} from '../../Shared/services/systemsetting.service';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {CountryService} from "../../Shared/services/country.service";


@Component({
  selector: 'userEdit',
  templateUrl: 'userEdit.template.html',
  providers: [SystemsettingService, MerchantServices,CountryService]
})
export class UserEditComponent implements OnInit {
  public sub: any;
  public _id: any;
  public employeeObj: any;
  public title: any;
  public address:  Array<any> = [];
  public maxDate: any;

  public countryShow: Array<any> = [];
  public stateShow: Array<string> = [];
  public cityShow: Array<any> = [];
  public countryIDData: any;
  public stateIDData: any;
  public countryId: any;
  public currencies: any;
  public code = '₹';
  public stateId: any;
  public countryData: Array<any> = [];
  public stateData: Array<any> = [];
  public cityData: Array<any> = [];
  public countryObj: any;
  public stateObj: any;
  public cityObj: any;
  public stateDisable = true;
  public cityDisable = true;
  public stateActive: Array<any> = [];
  public cityActive: Array<any> = [];

  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;
  public disCountry = true;
  public disState = true;
  public disCity = true;

  constructor(private _systemSettingService: SystemsettingService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private _merchantService: MerchantServices,
              private _countryService: CountryService) {};

  ngOnInit() {
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
    this.maxDate = new Date();
    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this._systemSettingService.getUser(this._id).then(
        (employeeObj => {
          if (employeeObj !== null) {
            this.employeeObj = employeeObj;
            // console.log(this.employeeObj);
            this.title = this.employeeObj.firstName;
            this.countryShow = employeeObj.address[0].country;
            if (employeeObj.address[0].state === 'null'){
              this.stateShow = [];
              this.disState = true;
             }else {
              this.stateShow = employeeObj.address[0].state;
            }
            if (employeeObj.address[0].city === 'null'){
              this.cityShow = [];
              this.disCity = true;
            }else {
              this.cityShow = employeeObj.address[0].city;
            }

          }
        })
      )
        .catch(error => console.log(error));
    });
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
  getCountryId(value) {
    this.countryId = value.id;
    this._countryService.getCountryByID(this.countryId)
      .subscribe(
        countryIDObj => {
          this.countryIDData = countryIDObj;
        });
    this._countryService.getStatesByCountryId(this.countryId)
      .subscribe(
        stateObj => {
          this.stateObj = stateObj.states;
          this.stateData = [];
          for (let i = 0; i < this.stateObj.length; i++) {
            this.stateData.push({'id': this.stateObj[i]._id, 'text': this.stateObj[i].name});
          }
          this.stateObj = this.stateData;
          if (this.stateObj.length > 0) {
            this.disState = false;
          }
        });
  }

  getStateId(value) {
    // this.Id = value.id;
    this._countryService.getCitiesByStateId(this.countryId, value.id)
      .subscribe(
        citiesObj => {
          // this.cityData = [];
          this.cityObj = citiesObj.cities;
          // for (let i = 0; i < this.stateObj.length; i++) {
          //   this.cityData.push({'id': this.cityObj[i]._id, 'text': this.cityObj[i].name});
          // }
          // this.cityObj = this.cityData;
          if (this.cityObj.length > 0) {
            this.disCity = false;
          }
        });
  }
  updateUser(value) {
    // console.log(value);
    // if (value.country !== null) {
    //   value.country = value.country[0].text;
    // }
    // else{
    //   delete value.country;
    // }
    // if(value.state !== null){
    //   value.state = value.state[0].text;
    // }
    // else{
    //   delete value.state;
    // }
    // if(value.city !== null){
    //   value.city = value.city[0].text;
    // }
    // else{
    //   delete value.city;
    // }
    // value.city = value.city[0].text;
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
    // console.log(value);
    const putdata = value;
    this._systemSettingService.updateUserService(this._id , JSON.stringify(putdata))
      .subscribe(
        data => {
          if (data.length !== 0) {
            this.toastr.success(name + ' Update successfully!', 'Success');
            this.router.navigate(['systemsettings/userList']);
          }

        }
      );
}
}
