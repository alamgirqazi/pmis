import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../core/auth.service';
import { Baseconfig } from '../../base.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 */
@Injectable()
export class DonorApi {
  constructor(protected http: HttpClient, private authService: AuthService) {}

  public insertDonor(data): Observable<any> {
    const url = Baseconfig.getPath() + '/donors/';
    delete data._id;

    return this.http
      .post(url, data, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }
  public getDonorNextId(): Observable<any> {
    const url = Baseconfig.getPath() + `/donors/getnextid/next`;

    return this.http
      .get(url, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }
  public getSingleDonor(_id): Observable<any> {
    const url = Baseconfig.getPath() + `/donors/${_id}`;

    return this.http
      .get(url, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }

  public updateDonor(_id: any, data?: any): Observable<any> {
    const url = Baseconfig.getPath() + '/donors/' + _id;
    return this.http
      .put(url, data, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }

  public deleteDonor(_id: any): Observable<any> {
    const url = Baseconfig.getPath() + '/donors/' + _id;
    return this.http.delete(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        this.authService.getAccessTokenId()
      )
    });
  }
}
