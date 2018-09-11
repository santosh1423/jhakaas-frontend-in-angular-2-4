import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from './authentication.service';
import {PapaParseService} from 'ngx-papaparse';
import * as moment from 'moment';
import {escapeIdentifier} from '@angular/compiler/src/output/abstract_emitter';
// import AWS = require('aws-sdk');

@Injectable()

export class CountryService {
  public countryName: string ;
  headers: Headers;
  options: RequestOptions;
  private _countryUrl = environment.apiUrl + 'country/';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }
  getCountry() {
    return this.http.get(this._countryUrl + '?select=name', this.options)
      .map((res: Response ) => res.json());
  }
  getCountryByName(name) {
    return this.http.get(this._countryUrl + '?name=' + name + '&&select=_id', this.options)
      .map((res: Response ) => res.json());
  }
  getCountryByName2(name) {
    return this.http.get(this._countryUrl + '?name=' + name + '&&select=name', this.options)
      .map((res: Response ) => res.json());
  }
  getCountryByNameD(name) {
    return this.http.get(this._countryUrl + '?name=' + name , this.options)
      .map((res: Response ) => res.json());
  }
  getCountryByID(id) {
    return this.http.get(this._countryUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
  getCountrySymbol(id) {
    return this.http.get(this._countryUrl + id + '/?select=name%20currencies', this.options)
      .map((res: Response ) => res.json());
  }
  getStatesByCountryId(id) {
    return this.http.get(this._countryUrl + id + '/states', this.options)
      .map((res: Response ) => res.json());
  }
  getCitiesByStateId(cid, sid) {
    return this.http.get(this._countryUrl + cid + '/states/' + sid + '/cities', this.options)
      .map((res: Response ) => res.json());
  }
  postCounrty( param: any): Observable<any> {
    return this.http.post(this._countryUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }
}
