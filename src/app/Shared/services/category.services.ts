import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Category} from '../model/category';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';

import 'rxjs/Rx';

@Injectable()

export class CategoryServices {
  headers: Headers;
  options: RequestOptions;
  private status: any;
  extractData: any;
  handleError: any;
  public _categoryUrl = environment.apiUrl + 'category/';
  public _importcategoryUrl = environment.apiUrl + 'category/import';
  public _categoryPC_Url = environment.apiUrl + 'category/parent';
  public _categoryPPC_Url = environment.apiUrl + 'category/pParent';
  public _categoryNameUrl = environment.apiUrl + 'category/?select=name&&type=Merchant';
  public _categoryParentNameUrl = environment.apiUrl + 'category/parent/?select=name&&type=Merchant';
  public _categoryProNameUrl = environment.apiUrl + 'category/?select=name&&type=Product&&sort=name';
  public _categorySubUrl = environment.apiUrl + 'category/?parentCategory=';
  public _country = 'https://restcountries.eu/rest/v2/all';


  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  getCategory() {
    return this.http.get(this._categoryUrl,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getCategoryName() {
    return this.http.get(this._categoryNameUrl + '&&sort=name',  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  getParentCategoryName() {
    return this.http.get(this._categoryParentNameUrl + '&&sort=name',  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }


  getProCategoryName() {
    return this.http.get(this._categoryProNameUrl,  this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getParentCat() {
    return this.http.get(this._categoryPC_Url,  this.options)
      .map(res => {
      this.extractData = res;
      if (this.extractData._body !== '0') {
        return res.json( );
      }
    });
  }
  getProParentCat() {
    return this.http.get(this._categoryPPC_Url,  this.options)
      .map(res => {
      this.extractData = res;
      if (this.extractData._body !== '0') {
        return res.json( );
      }
    });
  }
  getSubCategory(name: any) {
    return this.http.get(this._categoryUrl + '/?parentCategory=' + encodeURIComponent(name) + '&&type=Merchant&&select=name',  this.options)
      .map(res => {
      this.extractData = res;
      if (this.extractData._body !== '0') {
        return res.json( );
      }
    });
  }
  getMerIndex() {
    return this.http.get(this._categoryUrl + '?type=Merchant&&select=index&&limit=1&&sort=-index',  this.options)
      .map(res => {
      this.extractData = res;
      if (this.extractData._body !== '0') {
        return res.json( );
      }
    });
  }
  getProIndex() {
    return this.http.get(this._categoryUrl + '?type=Product&&select=index&&limit=1&&sort=-index',  this.options)
      .map(res => {
      this.extractData = res;
      if (this.extractData._body !== '0') {
        return res.json( );
      }
    });
  }

  getCategoryByID(param: String): Promise<any> {
    const id = param;
    return this.http.get(this._categoryUrl + id , this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getCategoryBySub(param: any, data: any): Promise<any> {
    const name = param;
    return this.http.get(this._categorySubUrl + encodeURIComponent(name)  + '&&type=' + data + '&&sort=index&&populate=createBy&&populate=updateBy', this.options)
      .map((res: Response) => <Category> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getCountry() {
    return this.http.get(this._country);
  }

  addCategory( category: any): Observable<any> {
    // console.log(category);
    return this.http.post(this._categoryUrl , JSON.stringify(category), this.options)
      .map((res: Response ) => res.json());
  }

  addCategory2( category: any): Promise<any> {
    // console.log(category);
    return this.http.post(this._categoryUrl , JSON.stringify(category), this.options)
      .map((res: Response) => <Category> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  importCategory(param: any): Observable<any> {
    return this.http.post(this._importcategoryUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  updateCategory(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._categoryUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }

  updateCategoryIndex(id: any, param: any): Observable<any> {
    return this.http.put(this._categoryUrl + id , JSON.stringify({index: param}), this.options)
      .map((res: Response ) => res.json());
  }

  addSubCategory(category: Category): Observable<any> {
    return this.http.post(this._categoryUrl , JSON.stringify(category), this.options)
      .map((res: Response ) => res.json());
  }
  addAttr(category: Category, catId: any): Observable<any> {
    console.log(category);
    console.log(catId);
    return this.http.post(this._categoryUrl + catId + '/attribute' , JSON.stringify(category), this.options)
      .map((res: Response ) => res.json());
  }

  getAttributeById(catId: any,  rowId:any) {
    return this.http.get(this._categoryUrl + catId + '/attribute/' + rowId, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  deleteAttributeById(catId: any,  rowId:any) {
    return this.http.delete(this._categoryUrl + catId + '/attribute/' + rowId, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getAllAttributeById(catId: any) {
    return this.http.get(this._categoryUrl + catId + '/attribute/', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  updateAttribute(cid: any, aid:any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._categoryUrl + cid + '/attribute/'+ aid , body, this.options)
      .map((res: Response ) => res.json());
  }
  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'Active') {
      return this.http.put(this._categoryUrl + id, {'status': 'Active'}, this.options)
        .map((res: Response ) => <Category> res.json());
        // .toPromise()
        // .then(this.extractData)
        // .catch(this.handleError);
    } else {
      return this.http.put(this._categoryUrl + id, {'status': 'De-active'}, this.options)
        .map((res: Response ) => <Category> res.json());
        // .toPromise()
        // .then(this.extractData)
        // .catch(this.handleError);
    }

  }

}
