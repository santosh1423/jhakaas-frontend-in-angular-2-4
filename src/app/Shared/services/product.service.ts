import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';

import 'rxjs/Rx';
import * as AWS from 'aws-sdk';
import {toPromise} from 'rxjs/operator/toPromise';

@Injectable()

export class ProductService {
  headers: Headers;
  options: RequestOptions;
  private status: any;
  extractData: any;
  handleError: any;

  public _compUrl = environment.apiUrl + 'company/';
  public _notiUrl = environment.apiUrl + 'notification/allmerchant/';
  public _compUrl1 = environment.apiUrl + 'company';
  public _catUrl = environment.apiUrl + 'category/';
  public _proUrl = environment.apiUrl + 'product/';
  public _hsnUrl = environment.apiUrl + 'hsn/';
  public _countryUrl = environment.apiUrl + 'country/';

  constructor(private http: Http, private _authenticationservice: AuthenticationService) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  companyDelete(param: any): Observable<any> {
    const id = param;
    return this.http.delete(this._compUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
  getAllCompany(): Observable<any> {
    return this.http.get(this._compUrl1 + '?sort=name', this.options)
      .map((res: Response ) => res.json());
  }
  getSelectedCat(catId): Observable<any> {
    return this.http.get(this._catUrl + catId, this.options)
      .map((res: Response ) => res.json());
  }

  getProdID(proID): Observable<any> {
    return this.http.get(this._proUrl + '?code=' + proID + '&&select=_id' , this.options)
      .map((res: Response ) => res.json());
  }
  getAllProductCategory(): Observable<any> {
    return this.http.get(this._catUrl + '/?type=Product&&sort=name', this.options)
      .map((res: Response ) => res.json());
  }
  getHSNCode(): Observable<any> {
    return this.http.get(this._hsnUrl  + '/?select=name%20code', this.options)
      .map((res: Response ) => res.json());
  }
  getAllProductDetails(): Observable<any> {
    return this.http.get(this._proUrl + '/?populate=category&&populate=updateBy&&populate=createBy&&sort=updateBy', this.options)
      .map((res: Response ) => res.json());
  }
  getProductCategoryID(id): Observable<any> {
    return this.http.get(this._catUrl + id + '/?type=Product', this.options)
      .map((res: Response ) => res.json());
  }
  getProductCategoryCode(id): Observable<any> {
    return this.http.get(this._catUrl + id + '/?select=code', this.options)
      .map((res: Response ) => res.json());
  }
  getParentAttribute(parentName): Observable<any> {
    return this.http.get(this._catUrl + '?name=' + parentName , this.options)
      .map((res: Response ) => res.json());
  }
  getProductById(id): Observable<any> {
    // return this.http.get(this._proUrl + id + '/?populate=category&&populate=manufacturer', this.options)
    return this.http.get(this._proUrl + id + '/?populate=category', this.options)
      .map((res: Response ) => res.json());
  }
  getAllVariation(baseid): Observable<any> {
    return this.http.get(this._proUrl  + '/?baseProductId=' + baseid + '&&sort=varNo', this.options)
      .map((res: Response ) => res.json());
  }
  getBaseProId(baseid): Observable<any> {
    return this.http.get(this._proUrl  + '/?baseProductId=' + baseid + '&&sort=code', this.options)
      .map((res: Response ) => res.json());
  }

  getPriceChange(): Observable<any> {
    return this.http.get(this._proUrl + '?status=Price Change&&populate=proprietary.mid&&populate=changePriceRequest.merchantId', this.options)
      .map((res: Response ) => res.json());
  }
  getReqUnderEnquiry(): Observable<any> {
    return this.http.get(this._proUrl + '?status=Under Enquiry&&productType=Proprietary&&varNo=1&&populate=mer_createBy&&populate=mer_updateBy&&populate=proprietary.mid', this.options)
      .map((res: Response ) => res.json());
  }
  getproById(id): Observable<any> {
    return this.http.get(this._proUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
  updateProductPrice(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._proUrl + id, body, this.options)
      .map((res: Response ) => res.json());
  }
  getproByBaseId(baseid): Observable<any> {
    return this.http.get(this._proUrl + '?baseProductId=' + baseid + '&&select=_id%20name', this.options)
      .map((res: Response ) => res.json());
  }
  getproProBy(baseid): Observable<any> {
    return this.http.get(this._proUrl  + baseid + '/?populate=proprietary.mid', this.options)
      .map((res: Response ) => res.json());
  }
  getCompanyByID(param: String): Promise<any> {
    const id = param;
    return this.http.get(this._compUrl + id + '/?populate=createBy', this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  updateProImageIndex(proId: any, param: any): Observable<any> {
    return this.http.put(this._proUrl + proId , JSON.stringify({images: param}), this.options)
      .map((res: Response ) => res.json());
  }
  addCompany( company: any): Observable<any> {
    return this.http.post(this._compUrl , JSON.stringify(company), this.options)
      .map((res: Response ) => res.json());
  }

  sendNotificationAllMerchant( value: any): Observable<any> {
    return this.http.post(this._notiUrl , JSON.stringify(value), this.options)
      .map((res: Response ) => res.json());
  }

  addCompany2 ( company: any): Promise<any> {
    return this.http.post(this._compUrl , JSON.stringify(company), this.options)
      .map((res: Response ) => res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  updateCompany(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._compUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }
  updateProduct(id: any, param: String): Observable<any> {
    const body = param;
    return this.http.put(this._proUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }
  updateStatus(id: any, param: String): Observable<any> {
    return this.http.put(this._proUrl + id , JSON.stringify({status: param}), this.options)
      .map((res: Response ) => res.json());
  }

  updateAttribute(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._proUrl + id , body, this.options)
      .map((res: Response ) => res.json());
  }
  updateVarAttribute(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._proUrl + id , JSON.stringify({attributes: body}), this.options)
      .map((res: Response ) => res.json());
  }

  // Image Upload S3

  uploadImage(code: any , url: any) {
    var promise = new Promise((resolve, reject) => {
      var awsConfig = new AWS.Config({
        accessKeyId: environment.awsAccessKey,
        secretAccessKey: environment.awsSecretKey,
        region: environment.awsRegion,
      });
      const s3 = new AWS.S3(awsConfig);
      // console.log(url);
      if (url !== '') {
        fetch(url)
          .then(res => res.blob()) // Gets the response and returns it as a blob
          .then(blob => {
            var final = url.substr(url.lastIndexOf('/') + 1);
            s3.upload({Bucket: 'jhakaas-docs', Key: 'product/images/' + code + '/' + final, Body: blob}, (err, mimage) => {
              // console.log(mimage);
              resolve(mimage);
            });
          });
      } else {
        resolve([]);
      }

    });
    return promise;
    // .map((res: Response ) => <any> res.json());
  }


  uploadVarImage(Bcode: any, code: any, url: any) {
    var promise = new Promise((resolve, reject) => {
      var awsConfig = new AWS.Config({
        accessKeyId: environment.awsAccessKey,
        secretAccessKey: environment.awsSecretKey,
        region: environment.awsRegion,
      });
      const s3 = new AWS.S3(awsConfig);
      fetch(url)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          var final = url.substr(url.lastIndexOf('/') + 1);
          s3.upload({Bucket: 'jhakaas-docs', Key: 'product/images/' + Bcode + '/' + code + '/' + final, Body: blob}, (err, mimage) => {
            // console.log(mimage);
            resolve(mimage);
          });
        });
    });
    return promise;
    // .map((res: Response ) => <any> res.json());
  }

  getEAN(ean): Observable<any> {
    return this.http.get(this._proUrl + '?ean=' + ean, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getHSN(hsn): Observable<any> {
    return this.http.get(this._proUrl + '?hsnCode=' + hsn, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  // Find Category

  getCategoryByName(name): Promise<any> {
    // console.log('Category  - ' + name);
    return this.http.get(this._catUrl + '?name=' + name + '&&type=Product', this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // Find Manufacture

  getManufactureByName(name): Observable<any> {
    // console.log('Company  - ' + name);
    return this.http.get(this._compUrl + '?name=' + name, this.options)
      .map((res: Response) => <any> res.json());
    // .toPromise()
    // .then(this.extractData)
    // .catch(this.handleError);
  }

  getCountrybycode(alphaCode: any): Observable<any> {
    return this.http.get(this._countryUrl  + '?alpha2Code=' + alphaCode + '&&select=name', this.options)
      .map((res: Response ) => res.json());
  }

  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status !== 'Active') {
      return this.http.put(this._compUrl + id, {'status': 'Active'}, this.options)
        .map((res: Response ) => <any> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    } else {
      return this.http.put(this._compUrl + id, {'status': 'De-active'}, this.options)
        .map((res: Response ) => <any> res.json());
      // .toPromise()
      // .then(this.extractData)
      // .catch(this.handleError);
    }

  }

  // Post Product Data
  postProduct( param: any): Observable<any> {
    // console.log(JSON.stringify(param));
    return this.http.post(this._proUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  // Import Product Data
  importProduct( data: any): Observable<any> {
    return this.http.post(this._proUrl + 'import', JSON.stringify(data) , this.options)
      .map((res: Response ) => res.json());
  }

  deleteProImg( proId, rowID): Observable<any>{
    return this.http.delete(this._proUrl + proId + '/images/' + rowID , this.options)
      .map((res: Response ) => res.json());
  }
  deleteLicImg( proId, rowID): Observable<any>{
    return this.http.delete(this._proUrl + proId + '/license_images/' + rowID , this.options)
      .map((res: Response ) => res.json());
  }

  getVarNo(baseid): Observable<any> {
    return this.http.get(this._proUrl  + '/?baseProductId=' + baseid + '&&select=varNo&&sort=-varNo&&limit=1', this.options)
      .map((res: Response ) => res.json());
  }
  getvarId(varId): Observable<any> {
    return this.http.get(this._proUrl  + '?code=' + varId+ '&&select=_id', this.options)
      .map((res: Response ) => res.json());
  }
  updateVarSeq(id: any, param: any): Observable<any> {
    return this.http.put(this._proUrl + id , JSON.stringify({varNo: param}), this.options)
      .map((res: Response ) => res.json());
  }
}
