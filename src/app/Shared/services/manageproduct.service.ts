import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';
import {Category} from '../model/category';
import {Merchant} from '../model/merchant';
import {PapaParseService} from 'ngx-papaparse';


@Injectable()
export class ManageproductService {
  headers: Headers;
  options: RequestOptions;
  private status: any;
  checkMe: any;
  private _productImportUrl = environment.apiUrl + 'product/import';
  private _manageproductUrl = environment.apiUrl + 'company/';
  private _addroductUrl = environment.apiUrl + 'product/';
  private _companyNameUrl = environment.apiUrl + 'company/?select=name';
  private _categoryNameUrl = environment.apiUrl + 'category/?select=name';
  private extractData: any;
  private handleError: any;
  private impData: any;
  constructor(private http: Http, private _authenticationservice: AuthenticationService, private papa: PapaParseService) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }
  public getManageproduct() {
    // const _url = environment.apiUrl + 'customer/';
    return this.http.get(environment.apiUrl + 'company/', this.options)
      .map(res => {
        this.checkMe = res;
        if (this.checkMe._body !== '0') {
          return res.json( );
        }
      });
  }
  public getProductlistview() {
    // const _url = environment.apiUrl + 'customer/';
    return this.http.get(environment.apiUrl + 'product/?populate=category', this.options)
      .map(res => {
        this.checkMe = res;
        if (this.checkMe._body !== '0') {
          return res.json( );
        }
      });
  }
  getManageproductByID(param: String): Observable<any> {
    const id = param;
    return this.http.get(this._manageproductUrl + id, this.options);
  }
  getProductlistviewByID(param: String): Observable<any> {
    const id = param;
    return this.http.get(this._addroductUrl + id, this.options);
  }
  addManageproduct( param: any): Observable<any> {
    return this.http.post(this._manageproductUrl , JSON.stringify(param), this.options)
      .map((res: Response ) => res.json());
  }
  addProductlistview( param: any): Observable<any> {
    return this.http.post(this._addroductUrl , JSON.stringify(param), this.options)
      .map((res: Response ) => res.json());
  }

  updateManageproduct(url: string, param: any): Observable<any> {
    return this.http.put(url , param, this.options)
      .map((res: Response ) => res.json());
  }

  deleteManageproduct(param: String): Observable<any> {
    const id = param;
    return this.http.delete(this._manageproductUrl + id, this.options)
      .map((res: Response ) => res.json());
  }

  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'Pending') {
      return this.http.put(this._manageproductUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response ) => res.json());
    } else {
      return this.http.put(this._manageproductUrl + id, JSON.stringify({'status': 'Pending'}), this.options)
        .map((res: Response ) => res.json());
    }
  }
  public getProduct() {
    // const _url = environment.apiUrl + 'customer/';
    return this.http.get(environment.apiUrl + 'company/', this.options)
      .map(res => {
        this.checkMe = res;
        if (this.checkMe._body !== '0') {
          return res.json( );
        }
      });
  }
  public getCategory() {
    // const _url = environment.apiUrl + 'customer/';
    return this.http.get(environment.apiUrl + 'product?select=category', this.options)
      .map(res => {
        this.checkMe = res;
        if (this.checkMe._body !== '0') {
          return res.json( );
        }
      });
  }

  addProduct( param: String): Observable<any> {
    // const body = JSON.stringify({param});
    const body = param;
    console.log(body);
    return this.http.post(this._addroductUrl, body, this.options)
      .map((res: Response ) => res.json());
  }
  getCompanyName() {
    return this.http.get(this._companyNameUrl,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getProductlistByID(param: String): Promise<Category> {
    const id = param;
    return this.http.get(this._addroductUrl + id, this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getManageproductid(param: String): Promise<any> {
    const id = param;
    return this.http.get(this._addroductUrl + id, this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  updateManageproductid(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._addroductUrl + id, body, this.options)
      .map((res: Response ) => res.json());
  }
  getCategoryName() {
    return this.http.get(this._categoryNameUrl,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  getManufacturerName() {
    return this.http.get(this._companyNameUrl,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  postProduct(param: any): Observable<any> {
    console.log(param);
    this.papa.parse(param, {
      header: true,
      skipEmptyLines: true,
      complete: (results, file) => {
        console.log(results.data);
        this.impData = results.data;
        console.log(this.impData);
      }
    });
    return this.http.post(this._productImportUrl, JSON.stringify(this.impData) , this.options)
      .map((res: Response ) => res.json());
  }
}
