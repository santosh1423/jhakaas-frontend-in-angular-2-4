import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/Rx';
import {AuthenticationService} from './authentication.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

@Injectable()

export class VoucherService {
  headers: Headers;
  product = [];
  options: RequestOptions;

  private _orderUrl = environment.apiUrl + 'order/';
  public _customerlistUrl = environment.apiUrl + 'customer/';
  private _customerlistnameUrl = environment.apiUrl + 'order/';
  private _voucherUrl = environment.apiUrl + 'voucher/';
  private extractData: any;
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }



  getAllVoucher(): Observable<any> {
    return this.http.get(this._voucherUrl +'?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }

  getVoucherByID(id: any): Observable<any> {
    return this.http.get(this._voucherUrl +id ,this.options)
      .map((res: Response ) => res.json());
  }

  postVoucher( param: any): Observable<any> {
    return this.http.post(this._voucherUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  updateVoucher(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._voucherUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }

  deleteVoucher(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._voucherUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
}
