import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs/Observable';


@Injectable()

export class RightsmanagementService {
  private extractData: any;
  headers: Headers;
  options: RequestOptions;
  private _profileUrl = environment.apiUrl + 'profile/';
  private _empUrl = environment.apiUrl + 'employee/';
  private _masterNameUrl = environment.apiUrl + 'masterlist/';

  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }

  getAllprofileName() {
    return this.http.get(this._profileUrl, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }

  updateScreenEvent (pid: any, sid: any, key: any, evt: any) {
    // var data = JSON.parse(JSON.stringify('{' + key + ':' + evt + '}' ));
    var data = '{' + JSON.stringify(key) + ':' + evt + '}';
    return this.http.put(this._profileUrl + pid + '/screen/' + sid, data, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }

  getProfileMasterName() {
    return this.http.get(this._masterNameUrl + '?select=name', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }

  getSelectedProfileData(name: any) {
    return this.http.get(this._profileUrl + '?profile.name=' + name, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }

  postProfile(param: any): Observable<any> {
    return this.http.post(this._profileUrl, JSON.stringify(param), this.options)
      .map((res: Response) => res.json());
  }

  putRights(id: any, param: any): Observable<any> {
    return this.http.put(this._profileUrl + id, JSON.stringify(param), this.options)
      .map((res: Response) => res.json());
  }
  putEmployee(empid: any, pid: any): Observable<any> {
    return this.http.put(this._empUrl + empid, JSON.stringify({profile: pid}) , this.options)
      .map((res: Response ) => res.json());
  }
  getSelectedprofile(value) {
    return this.http.get(this._empUrl + '?profile=' + value, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }

  getRemprofile() {
    return this.http.get(this._empUrl + '?empType__ne=Admin', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }

  deleteProfileService(id): Observable<any> {
    return this.http.delete(this._profileUrl + id , this.options)
      .map((res: Response ) => res.json());
  }
}
