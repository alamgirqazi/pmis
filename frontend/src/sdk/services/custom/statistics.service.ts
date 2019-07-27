import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from '../core/auth.service';
import { Baseconfig } from '../../base.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 */
@Injectable()
export class StatisticsApi {
  constructor(protected http: HttpClient, private authService: AuthService) {}

  public getAllStatistics(completeonly?): Observable<any> {
    const url = Baseconfig.getPath() + `/statistics/getall`;

    let params = new HttpParams();

    if (completeonly) {
      params = params.append('completeonly', '1');
    }

    return this.http
      .get(url, {
        params,
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }
  public getAllUsersStatistics(): Observable<any> {
    const url = Baseconfig.getPath() + `/statistics/getall/users`;

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
}
