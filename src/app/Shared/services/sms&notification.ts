import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';

import 'rxjs/Rx';

@Injectable()

export class SmsAndNotificationService {
  headers: Headers;
  private status: any;
  options: RequestOptions;
  private _smsUrl = environment.apiUrl + 'sms/pincode';
  private _notificationUrl = environment.apiUrl + 'notification/pincode';

  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  sendSMS( value: any): Observable<any> {
    return this.http.post(this._smsUrl , JSON.stringify(value), this.options)
      .map((res: Response ) => res.json());
  }

  sendNOTI( value: any): Observable<any> {
    return this.http.post(this._notificationUrl , JSON.stringify(value), this.options)
      .map((res: Response ) => res.json());
  }



}
