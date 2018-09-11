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

export class HsnmasterService {
  handleError: any;
  headers: Headers;
  options: RequestOptions;
  private status: any;
  public _videoUrl = environment.apiUrl + 'videotutorials/';
  public _hsnUrl = environment.apiUrl + 'hsn/';
  public _importhsnUrl = environment.apiUrl + 'hsn/import';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }


  postHSN( param: any): Observable<any> {
    return this.http.post(this._hsnUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  importHSN(param: any): Observable<any> {
    return this.http.post(this._importhsnUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  getAllHsn(): Observable<any> {
    return this.http.get(this._hsnUrl + '?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }

  getHSNByID(id: any): Observable<any> {
    return this.http.get(this._hsnUrl + id , this.options)
      .map((res: Response ) => res.json());
  }
  updateHSN(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._hsnUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }

  deleteVideo(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._videoUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'Active') {
      return this.http.put(this._hsnUrl + id, {'status': 'Active'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    } else {
      return this.http.put(this._hsnUrl + id, {'status': 'De-active'}, this.options)
        .map((res: Response ) => <Category> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    }

  }
}
