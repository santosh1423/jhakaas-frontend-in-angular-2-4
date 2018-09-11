import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {AuthenticationService} from './authentication.service';
import {Subscription} from '../model/subscription';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs/Subject';


@Injectable()

export class SubscriptionServices {
  headers: Headers;
  options: RequestOptions;
  private status: any;
  private _subscriptionUrl = environment.apiUrl + 'subscription/';
  private _merSubscriptionUrl = environment.apiUrl + 'merchant/subslist';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  getAllSubscription() {
    return this.http.get(this._subscriptionUrl +'?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }




  addSubscription( subscription: Subscription): Observable<any> {
    return this.http.post(this._subscriptionUrl , JSON.stringify(subscription), this.options)
      .map((res: Response ) => res.json());
  }

  updateSubscription(id: any, subscription: any): Observable<any> {
    return this.http.put(this._subscriptionUrl + id , subscription, this.options)
      .map((res: Response ) => res.json());
  }
  getSubscriptionByID(id: any): Observable<any> {
    return this.http.get(this._subscriptionUrl +id ,this.options)
      .map((res: Response ) => res.json());
  }

  deleteSubscription(param: String): Observable<any> {
    const id = param;
    return this.http.delete(this._subscriptionUrl + id, this.options)
      .map((res: Response ) => res.json());
  }

  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'De-active') {
      return this.http.put(this._subscriptionUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response ) => res.json());
    } else {
      return this.http.put(this._subscriptionUrl + id, JSON.stringify({'status': 'De-active'}), this.options)
        .map((res: Response ) => res.json());
    }

  }

  getMerSubscription(value: any): Observable<any> {
    console.log(JSON.stringify(value));
    return this.http.post(this._merSubscriptionUrl , JSON.stringify(value), this.options)
      .map((res: Response ) => res.json());
  }

}
