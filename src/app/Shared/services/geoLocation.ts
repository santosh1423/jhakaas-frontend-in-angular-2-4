import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()

export class GeoLocation {
  private _geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  private _geoAddress = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  extractData: any;
  handleError: any;
  constructor(private http: Http) {
  }
  public getAddress(lat , lng) {
    return this.http.get(this._geoUrl + lat + ',' + lng + '&sensor=true')
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }

  public getAddress2(address) {
    return this.http.get(this._geoAddress + address + '&sensor=true')
      .map(res => {
        this.extractData = res;
        if (this.extractData._body !== '0') {
          return res.json( );
        }
      });
  }
}
