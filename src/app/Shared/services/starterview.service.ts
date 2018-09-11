import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';

import 'rxjs/Rx';

@Injectable()

export class StarterviewService {
  headers: Headers;
  private status: any;
  options: RequestOptions;
  private _categoryUrl = environment.apiUrl + 'category/';
  private _categoryPC_Url = environment.apiUrl + 'category/?select=parentCategory';
  private _categoryNameUrl = environment.apiUrl + 'category/?select=name';
  private _country = 'https://restcountries.eu/rest/v2/all';
  private _countUrl = environment.apiUrl + 'count/';
  private _totalorder = environment.apiUrl + 'total/';

  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  getMerchantCount( param: any): Observable<any> {
    return this.http.post(this._countUrl + 'merchant', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  getCustomerCount( param: any): Observable<any> {
    return this.http.post(this._countUrl + 'customer', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());

  }
  getProductCount(param: any): Observable<any> {
    return this.http.post(this._countUrl + 'product', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());

  }
  getCategoryCount(param: any): Observable<any> {
    return this.http.post(this._countUrl + 'category', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }
  getPaymentCount(param: any): Observable<any> {
    return this.http.post(this._countUrl + 'payment', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }
  getOrderCount(param: any): Observable<any> {
    return this.http.post(this._totalorder + 'order', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }


}
