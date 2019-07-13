import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../core/auth.service';
import { Baseconfig } from '../../base.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 */
@Injectable()
export class ProjectsApi {
  constructor(protected http: HttpClient, private authService: AuthService) {}
  public login(data): Observable<any> {
    const url = Baseconfig.getPath() + '/auth';
    return this.http.post(url, data).map((response: any) => {
      return response;
    });
  }

  public getProjectsNextId(): Observable<any> {
    const url = Baseconfig.getPath() + `/projects/getnextid`;

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
  public getProjectDetail(project_id): Observable<any> {
    const url = Baseconfig.getPath() + `/projects/detail/${project_id}`;

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
  // public uploadDocument(image: any): Observable<any> {
  //   const url = Baseconfig.getPath() + `/assets/fileimport`;

  //   const formData: FormData = new FormData();
  //   formData.append('file', image, image.name);

  //   return this.http
  //     .post(url, formData, {
  //       headers: new HttpHeaders().set(
  //         'Authorization',
  //         this.authService.getAccessTokenId()
  //       )
  //     })
  //     .map((response: any) => {
  //       return response;
  //     });
  // }
  // public uploadProjectsDocument(image: any): Observable<any> {
  //   const url = Baseconfig.getPath() + `/Projects/fileimport`;

  //   const formData: FormData = new FormData();
  //   formData.append('file', image, image.name);

  //   return this.http
  //     .post(url, formData, {
  //       headers: new HttpHeaders().set(
  //         'Authorization',
  //         this.authService.getAccessTokenId()
  //       )
  //     })
  //     .map((response: any) => {
  //       return response;
  //     });
  // }

  public insertProjects(data): Observable<any> {
    const url = Baseconfig.getPath() + '/projects/';
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

  public updateProjectsStatus(_id: any, data?: any): Observable<any> {
    const url = Baseconfig.getPath() + '/projects/' + _id;
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

  public deleteProjects(_id: any): Observable<any> {
    const url = Baseconfig.getPath() + '/projects/' + _id;
    return this.http.delete(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        this.authService.getAccessTokenId()
      )
    });
  }
}
