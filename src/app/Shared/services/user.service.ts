import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';



@Injectable()
export class UserService {
  private _userUrl = environment.apiUrl + 'user/';
  headers: Headers;
  options: RequestOptions;
  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.options = new RequestOptions({ headers: this.headers });
  }

  getAllUser() {
    return this.http.get(this._userUrl);
  }

  postUser(param: String): Observable<any> {
    const body = param;
    return this.http.post(this._userUrl, body, this.options)
      .map((res: Response ) => res.json());
  }
}
