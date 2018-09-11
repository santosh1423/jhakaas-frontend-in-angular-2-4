import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/Rx';
import {AuthenticationService} from './authentication.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

@Injectable()

export class CustomerlistService {
  headers: Headers;
  product = [];
  options: RequestOptions;

  private _orderUrl = environment.apiUrl + 'order/';
  public _customerlistUrl = environment.apiUrl + 'customer/';
  private OrderUrl = environment.apiUrl + 'order/';
  private extractData: any;
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }



  getAllCustomer(): Observable<any> {
    return this.http.get(this._customerlistUrl + '?sort=updatedAt', this.options)
      .map((res: Response ) => res.json());
  }

  getCustomerById(id): Observable<any> {
    return this.http.get(this._customerlistUrl + id, this.options)
      .map((res: Response ) => res.json());
  }

  getCustomerOrderCount(id): Observable<any> {
    return this.http.get(this.OrderUrl + '?customer=' + id, this.options)
      .map((res: Response ) => res.json());
  }

  getOrder(id: any, param: any): Observable<any> {
    var date = param;
    var todate = param.todate;
    var fromdate = param.fromdate;
    var status = param.status;
    if (param.hasOwnProperty('status')) {
      return this.http.get(this._orderUrl + '?customer=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
        + status + '&&orderDate__gte=' + fromdate + '&&orderDate__lte=' + todate, this.options)
        .map(res => {
          this.extractData = res;
          if (this.extractData._body !== '0') {
            return res.json();
          }
        });
    }
  }
  getOrder1(id: any, todate: any, fromdate): Observable<any> {
    return this.http.get(this._orderUrl + '?customer=' + id +
      '&&populate=customer&&populate=merchant&&populate=items.product&&orderDate__gte='
      + fromdate + '&&orderDate__lte=' + todate, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
  }
}
