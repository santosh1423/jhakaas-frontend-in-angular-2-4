import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {AuthenticationService} from './authentication.service';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operator/map';
import {environment} from '../../../environments/environment';
import {Merchant} from '../model/merchant';
import {Category} from "../model/category";


@Injectable()

export class SystemsettingService {
  handleError: any;
  headers: Headers;
  options: RequestOptions;
  private status: any;
  private _smsUrl = environment.apiUrl + 'sms/';
  private _smtpUrl = environment.apiUrl + 'smtp/';
  private _smtpserverUrl = environment.apiUrl + 'smtpserver/';
  private _userUrl = environment.apiUrl + 'employee/';
  private _empUrl = environment.apiUrl + 'employee/';
  private _resetUrl = environment.apiUrl + 'user/';
  private _passwordUrl = environment.apiUrl + 'employee/';
  private _employeeUrl = environment.apiUrl + 'employee/?populate=user';
  private _currencyUrl = environment.apiUrl + 'currency/';
  private _sendnotificationUrl = environment.apiUrl + 'sendnotification/';
  private _rightmanagementUrl = environment.apiUrl + 'rightmanagement/';
  private checkMe: any;
  private _employeeNameUrl = environment.apiUrl + 'employee/?select=user';
  private extractData: any;
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }
  // Post Data
  postUser( param: any): Observable<any> {
    // console.log(JSON.stringify(param));
    return this.http.post(this._empUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => {
        res.json();
        // console.log(res.json());
      });
  }


  getemployee() {
    // return this.http.get(this._empUrl + '?empType__ne=Admin',  this.options)
    return this.http.get(this._empUrl,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  updateUserService(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._empUrl + id, body, this.options)
      .map((res: Response ) => res.json());
  }

  getempByID(param: any) {
    return this.http.get(this._empUrl + param,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  resetPassEmp(id: any, param: any): Observable<any> {
    return this.http.post(this._resetUrl + id + '/resetpassword', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }


  // public getSms() {
  //   return this.http.get(this._smsUrl, this.options)
  //     .map(res => {
  //       this.checkMe = res;
  //       if (this.checkMe._body !== '0') {
  //         return res.json( );
  //       }
  //     });
  // }

  postSMS( param: any): Observable<any> {
    return this.http.post(this._smsUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }


  getAllSMS(): Observable<any> {
    return this.http.get(this._smsUrl +'?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }

  getSmsByID(id: any): Observable<any> {
    return this.http.get(this._smsUrl +id ,this.options)
      .map((res: Response ) => res.json());
  }
  updateSMS(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._smsUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }

  updateSMSstatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'Active') {
      return this.http.put(this._smsUrl + id, {'status': 'Active'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    } else {
      return this.http.put(this._smsUrl + id, {'status': 'De-active'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    }

  }

  updateisDefault(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'True') {
      return this.http.put(this._smsUrl + id, {'isDefault': 'True'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    } else {
      return this.http.put(this._smsUrl + id, {'isDefault': 'False'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    }

  }
  deleteSMS(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._smsUrl + id, this.options)
      .map((res: Response ) => res.json());
  }


  postSMTP( param: any): Observable<any> {
    return this.http.post(this._smtpUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }


  getAllSMTP(): Observable<any> {
    return this.http.get(this._smtpUrl +'?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }

  getSmtpByID(id: any): Observable<any> {
    return this.http.get(this._smtpUrl +id ,this.options)
      .map((res: Response ) => res.json());
  }
  updateSMTP(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._smtpUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }

  updateSMTPstatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'Active') {
      return this.http.put(this._smtpUrl + id, {'status': 'Active'}, this.options)
        .map((res: Response ) => <Category> res.json());
    } else {
      return this.http.put(this._smtpUrl + id, {'status': 'De-active'}, this.options)
        .map((res: Response ) => <Category> res.json());
    }

  }

  updateisDefaultSMTP(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'True') {
      return this.http.put(this._smtpUrl + id, {'isDefault': 'True'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    } else {
      return this.http.put(this._smtpUrl + id, {'isDefault': 'False'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    }

  }
  deleteSMTP(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._smtpUrl + id, this.options)
      .map((res: Response ) => res.json());
  }



  getUser(param: String): Promise<any> {
    const id = param;
    return this.http.get(this._userUrl + id + '/', this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getUserByID(param: String): Observable<any> {
    const id = param;
    return this.http.get(this._userUrl + id, this.options);
  }


  addUser(param: String): Observable<any> {
    const body = param;
    return this.http.post(this._employeeUrl, body, this.options)
      .map((res: Response) => res.json());
  }

  updateUser(url: string, param: String): Observable<any> {
    const body = param;
    return this.http.put(url, body, this.options)
      .map((res: Response) => res.json());
  }

  deleteUser(param: String): Observable<any> {
    const id = param;
    return this.http.delete(this._userUrl + id, this.options)
      .map((res: Response) => res.json());
  }

  updatestatusUSER(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'Pending') {
      return this.http.put(this._userUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response) => res.json());
    } else {
      return this.http.put(this._userUrl + id, JSON.stringify({'status': 'Pending'}), this.options)
        .map((res: Response) => res.json());
    }
  }
  getCurrency() {
    return this.http.get(this._userUrl, this.options);
  }

  getCurrencyByID(param: String): Observable<any> {
    const id = param;
    return this.http.get(this._currencyUrl + id, this.options);
  }


  addCurrency(param: String): Observable<any> {
    const body = param;
    return this.http.post(this._currencyUrl, body, this.options)
      .map((res: Response) => res.json());
  }

  updateCurrency(url: string, param: String): Observable<any> {
    const body = param;
    return this.http.put(url, body, this.options)
      .map((res: Response) => res.json());
  }

  deleteCurrency(param: String): Observable<any> {
    const id = param;
    return this.http.delete(this._currencyUrl + id, this.options)
      .map((res: Response) => res.json());
  }

  updatestatusCURRENCY(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'Pending') {
      return this.http.put(this._currencyUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response) => res.json());
    } else {
      return this.http.put(this._currencyUrl + id, JSON.stringify({'status': 'Pending'}), this.options)
        .map((res: Response) => res.json());
    }
  }
  postSendnotification(url: string, param: String): Observable<any> {
    const body = param;
    return this.http.post(url, body, this.options)
      .map((res: Response ) => res.json());
  }
  postRightmanagement(url: string, param: String): Observable<any> {
    const body = param;
    return this.http.post(url, body, this.options)
      .map((res: Response ) => res.json());
  }
  // getemployee() {
  //   return this.http.get(this._employeeUrl, this.options)
  //     .map(res => {
  //       this.checkMe = res;
  //       if (this.checkMe._body !== '0') {
  //         return res.json( );
  //       }
  //     });
  // }
  // getEmployeeByID(param: String): Observable<any> {
  //   const id = param;
  //   return this.http.get(this._userUrl + id, this.options);
  // }
  getPasswordByID(param: String): Promise<any> {
    const id = param;
    return this.http.get(this._passwordUrl + id, this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  updateEmployee(url: string, param: any): Observable<any> {
    return this.http.put(url , param, this.options)
      .map((res: Response ) => res.json());
  }

}
