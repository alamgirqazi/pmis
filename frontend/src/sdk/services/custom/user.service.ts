import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from '../core/auth.service';
import { Baseconfig } from '../../base.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 */
@Injectable()
export class UserApi {
  constructor(protected http: HttpClient, private authService: AuthService) {}
  public login(data): Observable<any> {
    const url = Baseconfig.getPath() + '/auth';
    return this.http.post(url, data).map((response: any) => {
      return response;
    });
  }

  public insertUser(data): Observable<any> {
    const url = Baseconfig.getPath() + '/users/';
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
  public getUserNextId(): Observable<any> {
    const url = Baseconfig.getPath() + `/users/getnextid/next`;

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
  public getSingleUser(_id): Observable<any> {
    const url = Baseconfig.getPath() + `/users/${_id}`;

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

  public getUsers(user_type?): Observable<any> {
    const url = Baseconfig.getPath() + `/users`;

    let params = new HttpParams();
    params = params.append('start', '0');
    params = params.append('length', '100');
    if (user_type) {
      params = params.append('user_type', user_type);
    }
    params = params.append(
      'search',
      JSON.stringify({ value: '', regex: false })
    );

    console.log('params', params);
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        ),
        params: params
      })
      .map((response: any) => {
        return response;
      });
  }

  public updateUser(_id: any, data?: any): Observable<any> {
    const url = Baseconfig.getPath() + '/users/' + _id;
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

  public deleteUser(_id: any): Observable<any> {
    const url = Baseconfig.getPath() + '/users/' + _id;
    return this.http.delete(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        this.authService.getAccessTokenId()
      )
    });
  }

  public getAvatar(company_id: any): Observable<any> {
    const url = Baseconfig.getPath() + `/companies/${company_id}/form/generate`;

    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };

    return this.http.get<any>(url, httpOptions);
  }

  public uploadAvatar(
    user_info: any,
    image: any,
    user_id: any
  ): Observable<any> {
    const url = Baseconfig.getPath() + `/users/avatar/${user_id}`;

    const file_location = `avatar-${user_id}.${user_info.extension}`;
    const formData: FormData = new FormData();
    image.mydestination = 'fasd';
    formData.append('file', image, file_location);

    return this.http
      .put(url, formData, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }
}
