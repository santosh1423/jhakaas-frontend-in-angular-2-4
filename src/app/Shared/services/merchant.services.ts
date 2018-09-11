import { Injectable } from '@angular/core';
import {Http , Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from './authentication.service';
// import {PapaParseService} from 'ngx-papaparse';
import * as moment from 'moment';
// import AWS = require('aws-sdk');

@Injectable()

export class MerchantServices {
  private _merchantUrl = environment.apiUrl + 'merchant/';
  private _chainUrl = environment.apiUrl + 'category/chain/';
  private _empUrl = environment.apiUrl + 'employee/';
  private _merchantExportUrl = environment.apiUrl;
  public _catUrl = environment.apiUrl + 'category/';
  public _proUrl = environment.apiUrl + 'product/';
  public _vsUrl = environment.apiUrl + 'virtualStore/';
  private _approvedByUrl = environment.apiUrl;
  private _registerByUrl = environment.apiUrl;
  private _merchantImportUrl = environment.apiUrl + 'merchant/import';
  private _orderUrl = environment.apiUrl + 'order/';
  private _varconfUrl = environment.apiUrl + 'variableconfig';
  private _pendingMerUrl = environment.apiUrl + 'merchant?status=Pending';
  private _exCurMerUrl = environment.apiUrl + 'merchant/?';
  private _notificationUrl = environment.apiUrl + 'sendNotification';
  private _smsUrl = environment.apiUrl + 'sms/merid';
  private status: any;
  public impData: any;
  headers: Headers;
  options: RequestOptions;
  extractData: any;
  handleError: any;
  public str: any;
  constructor(private http: Http, private _authenticationservice: AuthenticationService ) {
    this.headers = new Headers({ 'Content-Type': 'application/json'});
    this.headers.append('api-token', this._authenticationservice.apiToken());
    this.options = new RequestOptions({ headers: this.headers });
  }

  getOrder(id: any, param: any): Observable<any> {
    var date = param;
    var todate = param.todate;
    var fromdate = param.fromdate;
    var status = param.status;
    if (param.hasOwnProperty('status')) {
      if (status === 'Pending') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderDate__gte=' + fromdate + '&&orderDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();
            }
          });
      }
      if (status === 'Delivered') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderStatus.deliveredDate__gte=' + fromdate + '&&orderStatus.deliveredDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();
            }
          });
      }
      if (status === 'Cancelled by Vendor') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderStatus.vendorRejectionDate__gte=' + fromdate + '&&orderStatus.vendorRejectionDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();
            }
          });
      }
      if (status === 'Cancelled by Customer') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderStatus.customerRejectionDate__gte=' + fromdate + '&&orderStatus.customerRejectionDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();
            }
          });
      }
      if (status === 'Out For Delivery') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderStatus.shippingDate__gte=' + fromdate + '&&orderStatus.shippingDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();

            }
          });
      }
      if (status === 'Completed') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderStatus.paymentDate__gte=' + fromdate + '&&orderStatus.paymentDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();
            }
          });
      }
      if (status === 'Confirm by Vendor') {
        return this.http.get(this._orderUrl + '?merchant=' + id + '&&populate=customer&&populate=merchant&&populate=items.product&&orderStatus.currentStatus='
          + status + '&&orderStatus.vendorAcceptedDate__gte=' + fromdate + '&&orderStatus.vendorAcceptedDate__lte=' + todate, this.options)
          .map(res => {
            this.extractData = res;
            if (this.extractData._body !== '0') {
              return res.json();
            }
          });
      }
    }
  }
  getOrder1(id: any, todate: any, fromdate): Observable<any> {
      return this.http.get(this._orderUrl + '?merchant=' + id +
        '&&populate=customer&&populate=merchant&&populate=items.product&&orderDate__gte='
        + fromdate + '&&orderDate__lte=' + todate, this.options)
        .map(res => {
          this.extractData = res;
          if (this.extractData._body !== '0') {
            return res.json();
          }
        });
  }
  getAllCategory(): Observable<any> {
    return this.http.get(this._catUrl + '?type=Merchant', this.options)
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

  // Send Notification

  sendNotication(data): Observable<any> {
    return this.http.post(this._notificationUrl, JSON.stringify(data) , this.options)
      .map((res: Response ) => res.json());
  }

  sendSms(data): Observable<any> {
    console.log(data);
    console.log('b');
    return this.http.post(this._smsUrl, JSON.stringify(data) , this.options)
      .map((res: Response ) => res.json());
  }






  getNumbers(nu): Observable<any> {
    return this.http.get(environment.apiUrl + 'merchant/?mobileNumber=' + nu, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  getMerDetails(id): Observable<any> {
    return this.http.get(environment.apiUrl + 'merchant/' + id, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  getEmails(email): Observable<any> {
    return this.http.get(environment.apiUrl + 'merchant/?email=' + email + '&&select=email', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getEmailUsers(email): Promise<any> {
    return this.http.get(environment.apiUrl + 'user/?email=' + email + '&&select=email', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  getByIdOrder(param: String): Observable<any>  {
    const id = param;
    return this.http.get(this._orderUrl + id + '/?&&populate=merchant&&populate=customer', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }


  getAllMerchant() {
    return this.http.get(this._merchantUrl, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getSLA() {
    return this.http.get(this._varconfUrl, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getAllExportMerchant(fromdate) {
    return this.http.get(this._merchantExportUrl + 'merchant/?' +
      'createdAt__gte=' + fromdate +
      '&&populate=user&&populate=category&&populate=registered_by' +
      '&&populate=approved.approved_by&&populate=rejected.rejected_by&&populate=ratings.customer&&populate=approvedBy.approved_by',
      this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getAllApprovedBy() {
    return this.http.get(this._approvedByUrl + 'employee/?empType=Admin&&empType=Back office&&sort=firstName',
      this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getAllRegisterBy() {
    return this.http.get(this._registerByUrl + 'employee?sort=firstName',
      this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  getPendingMerchant() {
    return this.http.get(this._pendingMerUrl, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getExportFilterMerchant(value: any): Observable<any> {
    // var res = str1.concat(str2);
    if (value.pincode !== '' || value.approvedBy !== '' || value.registerBy !== '' ||
      value.status !== '' ||
      value.fromdate !== '' ||
      value.todate !== '') {
      this.str = '';
      if (value.status !== '' && value.status !== 'ALL') {
          var lstr = 'status=' + value.status + '&&';
          this.str = this.str.concat(lstr);
      }
      if (value.approvedBy !== '' && value.approvedBy !== 'ALL') {
        var appstr = 'approved.approved_by=' + value.approvedBy + '&&';
        this.str = this.str.concat(appstr);
      }
      if (value.registerBy !== '' && value.registerBy !== 'ALL') {
        var regstr = 'registered_by=' + value.registerBy + '&&';
        this.str = this.str.concat(regstr);
      }
      if (value.pincode !== '') {
        var pinstr = 'postalCode=' + value.pincode + '&&';
        this.str = this.str.concat(pinstr);
      }
      if (value.fromdate !== '') {
        var fdstr = 'createdAt__gte=' + value.fromdate + '&&';
        this.str = this.str.concat(fdstr);
      }
      if (value.todate !== '') {
        var tdstr = 'createdAt__lte=' + value.todate + '&&';
        this.str = this.str.concat(tdstr);
      }
      var populate = 'populate=user&&populate=category' +
        '&&populate=registered_by' +
        '&&populate=approved.approved_by' +
        '&&populate=approvedBy.approved_by' +
        '&&populate=rejected.rejected_by';
      this.str = this.str.concat(populate);
      if (this.str !== '') {
        return this.http.get(this._exCurMerUrl + this.str,
          this.options).map(res => {
          this.extractData = res;
          if (this.extractData._body !== '0') {
            return res.json();
          }
        });
      } else {
        return this.http.get(this._exCurMerUrl +
        'status=' + value.status +
        '&&approved.approved_by=' + value.approvedBy +
        '&&registered_by=' + value.registerBy +
        '&&postalCode=' + value.pincode +
        '&&createdAt__gte=' + value.fromdate +
        '&&createdAt__lte=' + value.todate +
          '?&&populate=user&&populate=category' +
          '&&populate=registered_by' +
          '&&populate=ratings.customer' +
          '&&populate=approved.approved_by&&populate=rejected.rejected_by&&populate=approvedBy.approved_by',
          this.options).map(res => {
          this.extractData = res;
          if (this.extractData._body !== '0') {
            return res.json();
          }
        });
      }

    } else {
      return this.http.get(this._exCurMerUrl +
        'populate=user&&populate=category&&populate=registered_by&&populate=approved.approved_by' +
        '&&populate=rejected.rejected_by&&populate=ratings.customer&&populate=approvedBy.approved_by',
        this.options).map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json();
        }
      });
    }
  }

  getMerchant(param: String): Promise<any> {
    const id = param;
    return this.http.get(this._merchantUrl + id +
      '/?populate=category&&populate=registered_by&&populate=approved.approved_by' +
      '&&populate=rejected.rejected_by&&populate=subscription.createdBy&&populate=approvedBy.approved_by' +
      '&&populate=ratings.customer&&populate=callRecord.posted_by', this.options)
      .map((res: Response) => <any> res.json())
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getEmpAdminId(id) {
    return this.http.get(this._empUrl + '?user=' + id + '&&populate=profile', this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getMobileById(params: String, id: any) {
    return this.http.get(this._merchantUrl + id + '/phone/' + params, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
  getEmailById(params: String, id: any) {
    return this.http.get(this._merchantUrl + id + '/secondaryEmail/' + params, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getSocialById(params: String, id: any) {
    return this.http.get(this._merchantUrl + id + '/social_media/' + params, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getBankById(params: String, id: any) {
    return this.http.get(this._merchantUrl + id + '/bankDetails/' + params, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getDocumentById(params: String, id: any) {
    return this.http.get(this._merchantUrl + id + '/documents/' + params, this.options)
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  getChainCategory ( cname: any): Observable<any> {
    return this.http.post(this._chainUrl, JSON.stringify({cat: cname}) , this.options)
      .map((res: Response ) => res.json());
  }

  callRecordService( mid: any, param: any): Observable<any> {
    return this.http.post(this._merchantUrl + mid + '/callRecord', JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }
  // Post Data
  postMerchant( param: any): Observable<any> {
    return this.http.post(this._merchantUrl, JSON.stringify(param) , this.options)
    .map((res: Response ) => res.json());
  }

  postVirtualStore( param: any): Observable<any> {
    return this.http.post(this._vsUrl, JSON.stringify(param) , this.options)
    .map((res: Response ) => res.json());
  }

  putProductVStore(id: any, param: any): Observable<any> {
    return this.http.put(this._vsUrl + id, JSON.stringify({products: param}) , this.options)
    .map((res: Response ) => res.json());
  }

  updatemobile(id: any, param: any): Observable<any> {
    return this.http.put(this._merchantUrl + id, JSON.stringify({phone: param}) , this.options)
    .map((res: Response ) => res.json());
  }
  updateemail(id: any, param: any): Observable<any> {
    return this.http.put(this._merchantUrl + id, JSON.stringify({secondaryEmail: param}) , this.options)
    .map((res: Response ) => res.json());
  }



  postMerchant2(param: any): Observable<any> {
    return this.http.post(this._merchantImportUrl, JSON.stringify(param) , this.options)
      .map((res: Response ) => res.json());
  }

  updateStatus(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._merchantUrl + id, body, this.options)
      .map((res: Response ) => res.json());
  }

  addApproved(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/approvedBy/', body, this.options)
      .map((res: Response ) => res.json());
  }

  updateSocial(id: any, rowId: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._merchantUrl + id + '/social_media/' + rowId, body, this.options)
      .map((res: Response ) => res.json());
  }

  updateBank(id: any, rowId: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._merchantUrl + id + '/bankDetails/' + rowId, body, this.options)
      .map((res: Response ) => res.json());
  }
  updateDoc(id: any, rowId: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._merchantUrl + id + '/documents/' + rowId, body, this.options)
      .map((res: Response ) => res.json());
  }
  updateMobileNumber(id: any, rowId: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._merchantUrl + id + '/phone/' + rowId, body, this.options)
      .map((res: Response ) => res.json());
  }
  updateEmailID(id: any, rowId: any, param: any): Observable<any> {
    const body = param;
    return this.http.put(this._merchantUrl + id + '/secondaryEmail/' + rowId, body, this.options)
      .map((res: Response ) => res.json());
  }
  addMobileNumber(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/phone/', body, this.options)
      .map((res: Response ) => res.json());
  }
  addEmailID(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/secondaryEmail/', body, this.options)
      .map((res: Response ) => res.json());
  }
  addSocialMedia(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/social_media/', body, this.options)
      .map((res: Response ) => res.json());
  }
  addBankDetails(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/bankDetails/', body, this.options)
      .map((res: Response ) => res.json());
  }
  addDocumentDetails(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/documents/', body, this.options)
      .map((res: Response ) => res.json());
  }
  addEmail(id: any, param: any): Observable<any> {
    const body = param;
    return this.http.post(this._merchantUrl + id + '/secondaryEmail/', body, this.options)
      .map((res: Response ) => res.json());
  }
  updateMerchant(id: any, param: any): Observable<any> {
    const body = param;

    return this.http.put(this._merchantUrl + id, body, this.options)
      .map((res: Response ) => res.json());
  }
  updatestatus(param: String, param2: String): Observable<any> {
    const id = param2;
    this.status = param;
    if (this.status === 'Pending') {
      return this.http.put(this._merchantUrl + id, JSON.stringify({'status': 'Active'}), this.options)
        .map((res: Response ) => res.json());
    } else {
      return this.http.put(this._merchantUrl + id, JSON.stringify({'status': 'Pending'}), this.options)
        .map((res: Response ) => res.json());
    }

  }

  deleteMerchant(param: String): Observable<any> {
    const id = param;
    return this.http.delete(this._merchantUrl + id, this.options)
      .map((res: Response ) => res.json());
  }
  removeSocial(merid: String, rowId: string): Observable<any> {
    return this.http.delete(this._merchantUrl + merid + '/social_media/' +  rowId , this.options)
      .map((res: Response ) => res.json());
  }
  removeBank(merid: String, rowId: string): Observable<any> {
    return this.http.delete(this._merchantUrl + merid + '/bankDetails/' +  rowId , this.options)
      .map((res: Response ) => res.json());
  }
  removeEmail(merid: String, rowId: string): Observable<any> {
    return this.http.delete(this._merchantUrl + merid + '/secondaryEmail/' +  rowId , this.options)
      .map((res: Response ) => res.json());
  }
  removeDoc(merid: String, rowId: string): Observable<any> {
    return this.http.delete(this._merchantUrl + merid + '/documents/' +  rowId , this.options)
      .map((res: Response ) => res.json());
  }
  removephone(merid: String, rowId: string): Observable<any> {
    return this.http.delete(this._merchantUrl + merid + '/phone/' +  rowId , this.options)
      .map((res: Response ) => res.json());
  }
}
