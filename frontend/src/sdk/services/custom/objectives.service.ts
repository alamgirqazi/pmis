import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from '../core/auth.service';
import { Baseconfig } from '../../base.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 */
@Injectable()
export class ObjectivesApi {
  constructor(protected http: HttpClient, private authService: AuthService) {}

  public getObjectivesByIds(project_id, user_id?): Observable<any> {
    const url = Baseconfig.getPath() + `/objectives`;

    let params = new HttpParams();

    if (user_id) {
      params = params.append('user_id', user_id);
    }
    if (project_id) {
      params = params.append('project_id', project_id);
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
  // public getObjectivesByUserId(user_id): Observable<any> {
  //   const url = Baseconfig.getPath() + `/objectives/user/${user_id}`;
  //   return this.http
  //     .get(url, {
  //       headers: new HttpHeaders().set(
  //         'Authorization',
  //         this.authService.getAccessTokenId()
  //       )
  //     })
  //     .map((response: any) => {
  //       return response;
  //     });
  // }

  public insertObjectives(data, project_id): Observable<any> {
    const url = Baseconfig.getPath() + '/objectives/insertmany';
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
  public getObjectives(): Observable<any> {
    const url = Baseconfig.getPath() + `/objectives`;

    const params = new HttpParams().set('start', '0').set('length', '50'); // now it has aaa
    return this.http
      .get(url, {
        params: params,
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }
  public updateObjectivesStatus(_id: any, data?: any): Observable<any> {
    const url = Baseconfig.getPath() + '/objectives/' + _id;
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
    const url = Baseconfig.getPath() + '/objectives/' + _id;
    return this.http.delete(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        this.authService.getAccessTokenId()
      )
    });
  }
}
