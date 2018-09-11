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

export class HomeScreenSliderService {
  handleError: any;
  headers: Headers;
  options: RequestOptions;
  private status: any;
  public _catUrl = environment.apiUrl + 'category/';
  public _sliderUrl = environment.apiUrl + 'images/';
  private extractData: any;
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }

  getAllImages(): Observable<any> {
    return this.http.get(this._sliderUrl + '?populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }

  getAllCategory(): Observable<any> {
    return this.http.get(this._catUrl + '?type=Merchant', this.options)
      .map((res: Response ) => res.json());
  }

  postSlider( param: any): Observable<any> {
    return this.http.post(this._sliderUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  getImageByID(param: String): Promise<Category> {
    const id = param;
    return this.http.get(this._sliderUrl + id + '/?populate=internal.merchant&&populate=internal.category', this.options)
      .map((res: Response) => <Category> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  updateSlider(id: any, param: any): Observable<any> {
    const body = param;

    return this.http.put(this._sliderUrl + id, body, this.options)
      .map((res: Response ) => res.json());
  }
  deleteSlider(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._sliderUrl + id, this.options)
      .map((res: Response ) => res.json());
  }

}
