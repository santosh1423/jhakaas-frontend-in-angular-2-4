import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {AuthenticationService} from './authentication.service';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operator/map';
import {environment} from '../../../environments/environment';

@Injectable()

export class VirtualStoreService {
  handleError: any;
  headers: Headers;
  options: RequestOptions;
  private status: any;
  public _videoUrl = environment.apiUrl + 'videotutorials/';
  public _catUrl = environment.apiUrl + 'category/';
  public _proUrl = environment.apiUrl + 'product/';
  public _merUrl = environment.apiUrl + 'merchant/';
  public _searchUrl = environment.apiUrl + 'searchVSproduct/';
  public _vsUrl = environment.apiUrl + 'virtualStore/';
  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({headers: this.headers});
  }

  getAllCategory(): Observable<any> {
    return this.http.get(this._catUrl + '?type=Merchant', this.options)
      .map((res: Response ) => res.json());
  }
  getProCategory(): Observable<any> {
    return this.http.get(this._catUrl + '?type=Product', this.options)
      .map((res: Response ) => res.json());
  }
  getCategoryById(name: any): Observable<any> {
    return this.http.get(this._catUrl + '?name=' + name + '&&select=_id', this.options)
      .map((res: Response ) => res.json());
  }
  getSelectedCatPro(id: any): Observable<any> {
    return this.http.get(this._proUrl + '?category=' + id, this.options)
      .map((res: Response ) => res.json());
  }
  getAllVirtualStore(): Observable<any> {
    return this.http.get(this._vsUrl, this.options)
      .map((res: Response ) => res.json());
  }
  getVirtualStore(id): Observable<any> {
    return this.http.get(this._vsUrl + id + '/?populate=name&&populate=pid', this.options)
      .map((res: Response ) => res.json());
  }
  getActiveCategory(id): Observable<any> {
    return this.http.get(this._vsUrl + id + '/?populate=name', this.options)
      .map((res: Response ) => res.json());
  }
  getAllStore(): Observable<any> {
    return this.http.get(this._vsUrl + '/?sort=-updatedAt&&populate=name&&populate=createBy&&populate=updateBy', this.options)
      .map((res: Response ) => res.json());
  }
  deleteStore(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._vsUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
  getOneMerchant(): Observable<any> {
    return this.http.get(this._merUrl , this.options)
      .map((res: Response ) => res.json());
  }
  // getStoreById(id): Observable<any> {
  //   return this.http.get(this._vsUrl + id + '?populate=name&&populate=products&&populate=createBy&&populate=updateBy', this.options)
  //     .map((res: Response ) => res.json());
  // }
  getSearchProd ( data: any): Observable<any> {
    console.log(JSON.stringify(data));
    return this.http.post(this._searchUrl, JSON.stringify(data) , this.options)
      .map((res: Response ) => res.json());
  }

  getStoreById(id, limit): Observable<any> {
    return this.http.get(this._vsUrl + 'admin/cat=' + id + '/skip=0/limit=' + limit, this.options)
      .map((res: Response ) => res.json());
  }
  getTotalStore(id): Observable<any> {
    return this.http.get(this._vsUrl + 'admin/cat=' + id + '/skip=0/limit=0', this.options)
      .map((res: Response ) => res.json());
  }
  getProductsById(id): Observable<any> {
    return this.http.get(this._proUrl + id + '?populate=manufacturer', this.options)
      .map((res: Response ) => res.json());
  }
  getBaseProdIdById(proid): Observable<any> {
    return this.http.get(this._proUrl + proid + '/?select=baseProductId', this.options)
      .map((res: Response ) => res.json());
  }
  getAllProdByBaseProdId(baseProductId): Observable<any> {
    return this.http.get(this._proUrl + '?baseProductId=' + baseProductId + '&&select=baseProductId', this.options)
      .map((res: Response ) => res.json());
  }

}
