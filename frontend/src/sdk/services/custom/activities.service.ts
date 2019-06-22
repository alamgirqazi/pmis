import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from '../core/auth.service';
import { Baseconfig } from '../../base.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 */
@Injectable()
export class ActivitiesApi {
  constructor(protected http: HttpClient, private authService: AuthService) {}

  public getActivitiesByIds(
    project_id,
    objective_id,
    user_id?
  ): Observable<any> {
    const url = Baseconfig.getPath() + `/activities`;

    let params = new HttpParams();

    if (user_id) {
      params = params.append('user_id', user_id);
    }
    if (project_id) {
      params = params.append('project_id', project_id);
    }
    if (objective_id) {
      params = params.append('objective_id', objective_id);
    }
    params = params.append('start', '0');
    params = params.append('length', '100');
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

  public insertActivities(data, project_id): Observable<any> {
    const url = Baseconfig.getPath() + '/activities/insertmany';
    data['project_id'] = project_id;

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

  public updateActivitiesStatus(_id: any, data?: any): Observable<any> {
    const url = Baseconfig.getPath() + '/activities/' + _id;
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

  public deleteObjective(_id: any): Observable<any> {
    const url = Baseconfig.getPath() + '/Activities/' + _id;
    return this.http.delete(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        this.authService.getAccessTokenId()
      )
    });
  }
}
