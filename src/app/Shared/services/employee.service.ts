import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {environment} from '../../../environments/environment';


import 'rxjs/Rx';

@Injectable()

export class EmployeeService {
  headers: Headers;
  private status: any;
  options: RequestOptions;
  private _employeeUrl = environment.apiUrl + 'employee/';
  private _employeePC_Url = environment.apiUrl + 'employee/?select=parentEmployee';
  private _employeeNameUrl = environment.apiUrl + 'employee/?select=name';
  private _country = 'https://restcountries.eu/rest/v2/all';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  getEmployee() {
    return this.http.get(this._employeeUrl,  this.options);
  }

  getEmployeeName() {
    return this.http.get(this._employeeNameUrl,  this.options);
  }

  getParentCat() {
    return this.http.get(this._employeePC_Url,  this.options);
  }

  getEmployeeByID(param: String): Observable<any> {
    const id = param;
    return this.http.get(this._employeeUrl + id, this.options);
  }

  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'Pending') {
      return this.http.put(this._employeeUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response ) => res.json());
    } else {
      return this.http.put(this._employeeUrl + id, JSON.stringify({'status': 'Pending'}), this.options)
        .map((res: Response ) => res.json());
    }

  }


}
