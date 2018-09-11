import {Component, OnInit} from '@angular/core';
import {SystemsettingService} from '../../Shared/services/systemsetting.service';
import {ToastrService} from 'ngx-toastr';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {CountryService} from "../../Shared/services/country.service";
import {Router} from '@angular/router';

@Component({
  selector: 'user-add',
  templateUrl: 'userAdd.template.html',
  providers: [SystemsettingService, MerchantServices,CountryService]
})
export class UserAddComponent implements OnInit {
  public address:  Array<any> = [];
  public maxDate: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public empId: any;

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

  constructor( private _systemSettingService: SystemsettingService,
               private toastr: ToastrService,
               private router: Router,
               private _merchantService: MerchantServices,
               private _countryService: CountryService, ) { };
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

  // Country Management

  getCountryId(value) {
    this.stateDisable = true;
    this.cityDisable = true;
    this.stateObj = null;
    this.cityObj = null;
    this.stateActive = [];
    this.cityActive = [];

    this.countryId = value.id;
    this._countryService.getCountryByID(this.countryId)
      .subscribe(
        countryIDObj => {
          this.countryIDData = countryIDObj;
          this.code = this.countryIDData.currencies[0].symbol;
          this.currencies = this.countryIDData.currencies[0].symbol +  this.countryIDData.currencies[0].code + '(' + this.countryIDData.currencies[0].name + ')';
        });
    this._countryService.getStatesByCountryId(this.countryId)
      .subscribe(
        stateObj => {
          // console.log(stateObj);
          this.stateObj = stateObj.states;
          if( this.stateObj.length > 0){
            this.stateDisable = false;
          }
          this.stateData = [];
          for (let i = 0; i < this.stateObj.length; i++) {
            this.stateData.push({'id': this.stateObj[i]._id, 'text': this.stateObj[i].name});
          }
          this.stateObj = this.stateData;
        });
  }


  getStateId(value) {
    this.cityObj = null;
    this.cityActive = [];
    // this.Id = value.id;
    this._countryService.getCitiesByStateId(this.countryId, value.id)
      .subscribe(
        citiesObj => {
          // this.cityData = [];
          this.cityObj = citiesObj.cities;
          if( this.cityObj.length > 0){
            this.cityDisable = false;
          }
          // for (let i = 0; i < this.stateObj.length; i++) {
          //   this.cityData.push({'id': this.cityObj[i]._id, 'text': this.cityObj[i].name});
          // }
          // this.cityObj = this.cityData;
        });
  }


  addUser (value) {
    // console.log(value);
    value.userName = value.email;
    value.country = value.country[0].text;
    // if (value.state !== undefined) {
    //   value.state = value.state[0].text;
    // }else {
    //   // value.state = null;
    //   this.address.push(
    //     {'name': value.name,
    //       'address1': value.address1,
    //       'landmarks': value.landmarks,
    //       'state': 'null',
    //       'city': value.city,
    //       'country': value.country,
    //       'postalCode': value.postalCode,
    //
    //     });
    // }


    if (value.state !== undefined && value.city !== undefined) {
      value.state = value.state[0].text;
      value.city = value.city[0].text;
      this.address.push(
        {'name': value.name,
          'address1': value.address1,
          'landmarks': value.landmarks,
          'city': value.city,
          'state': value.state,
          'country': value.country,
          'postalCode': value.postalCode,

        });
    }
    if (value.state === undefined && value.city === undefined){
      this.address.push(
      {'name': value.name,
        'address1': value.address1,
        'landmarks': value.landmarks,
        'city': 'null',
        'state': 'null',
        'country': value.country,
        'postalCode': value.postalCode,

      });
    }
    if (value.state !== undefined && value.city === undefined) {
        value.state = value.state[0].text;
        this.address.push(
            {'name': value.name,
              'address1': value.address1,
              'landmarks': value.landmarks,
              'state': value.state,
              'city': 'null',
              'country': value.country,
              'postalCode': value.postalCode,
            });
      }


    value.type = 'Employee';


    value.address = this.address;
    // console.log(value);
    this._systemSettingService.postUser(value)
      .subscribe(
        result => {
          // console.log(result);
          // if (result.success !== true) {
            this.toastr.success('Your Records are Save Successfully!', 'Good job!');
            this.router.navigate(['systemsettings/userList']);
          // }
        }
      );
  }
}
