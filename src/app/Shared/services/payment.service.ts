import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';

import 'rxjs/Rx';

@Injectable()

export class PaymentService {
  headers: Headers;
  private status: any;
  options: RequestOptions;
  private _categoryUrl = environment.apiUrl + 'category/';
  private _categoryPC_Url = environment.apiUrl + 'category/?select=parentCategory';
  private _categoryNameUrl = environment.apiUrl + 'category/?select=name';
  private _country = 'https://restcountries.eu/rest/v2/all';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  getCategory() {
    return this.http.get(this._categoryUrl,  this.options);
  }

  getCategoryName() {
    return this.http.get(this._categoryNameUrl,  this.options);
  }

  getParentCat() {
    return this.http.get(this._categoryPC_Url,  this.options);
  }

  getCategoryByID(param: String): Observable<any> {
    const id = param;
    return this.http.get(this._categoryUrl + id, this.options);
  }

  getCountry() {
    return this.http.get(this._country);
  }

  addPayment( param: String): Observable<any> {
    const body = param;
    return this.http.post(this._categoryUrl , body, this.options)
      .map((res: Response ) => res.json());
  }

  updateCategory(url: string, param: String): Observable<any> {
    const body = param;
    return this.http.put(url , body, this.options)
      .map((res: Response ) => res.json());
  }

  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'Pending') {
      return this.http.put(this._categoryUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response ) => res.json());
    } else {
      return this.http.put(this._categoryUrl + id, JSON.stringify({'status': 'Pending'}), this.options)
        .map((res: Response ) => res.json());
    }

  }

}
