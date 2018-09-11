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

export class PaymentOptionService {
  handleError: any;
  headers: Headers;
  options: RequestOptions;
  private status: any;
  public _paymentOptionUrl = environment.apiUrl + 'payment/';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }

  postPaymentOption( param: any): Observable<any> {
    return this.http.post(this._paymentOptionUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }
  getAllPaymentOption(): Observable<any> {
    return this.http.get(this._paymentOptionUrl +'?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }

  getPaymenyOptionByID(id: any): Observable<any> {
    return this.http.get(this._paymentOptionUrl +id ,this.options)
      .map((res: Response ) => res.json());
  }
  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'Active') {
      return this.http.put(this._paymentOptionUrl + id, {'status': 'Active'}, this.options)
        .map((res: Response ) => <Category> res.json());
    } else {
      return this.http.put(this._paymentOptionUrl + id, {'status': 'De-active'}, this.options)
        .map((res: Response ) => <Category> res.json());
    }
  }
  updatePaymentOption(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._paymentOptionUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }
  deletePaymentOption(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._paymentOptionUrl + id, this.options)
      .map((res: Response ) => res.json());
  }

}
