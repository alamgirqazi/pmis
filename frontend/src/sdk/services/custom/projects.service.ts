import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
  public getProjects(): Observable<any> {
    const url = Baseconfig.getPath() + `/projects`;

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
  public uploadAttachment(
    project_id,
    file: any,
    file_info: any,
    attachments,
    tempformData = null
  ): Observable<any> {
    let url;
    const formData: FormData = new FormData();

    if (file_info.file_type == 'projects') {
      url = Baseconfig.getPath() + `/projects/${project_id}/attachments`;
    }
    if (file_info.file_type == 'objectives') {
      url =
        Baseconfig.getPath() +
        `/objectives/${project_id}/attachments/${tempformData._id}`;
      formData.append('objective_id', tempformData._id);
      formData.append('objective_name', tempformData.objective_name);
    }
    if (file_info.file_type == 'activities') {
      url =
        Baseconfig.getPath() +
        `/activities/${project_id}/attachments/${tempformData._id}`;
      formData.append('activity_id', tempformData._id);
      formData.append('activity_name', tempformData.activity_name);
    }
    if (file_info.file_type == 'tasks') {
      url =
        Baseconfig.getPath() +
        `/tasks/${project_id}/attachments/${tempformData._id}`;
      formData.append('task_id', tempformData._id);
      formData.append('task_name', tempformData.task_name);
    }

    const file_location = `attachment-${file_info.id}.${file_info.extension}`;

    formData.append('file', file, file_location);
    formData.append('file_type', file_info.file_type);
    formData.append('file_name', file.name);
    formData.append('id', file_info.id);
    formData.append('user_name', file_info.user_name);
    formData.append('user_id', file_info.user_id);
    formData.append('extension', file_info.extension);
    formData.append('attachments', JSON.stringify(attachments));

    return this.http
      .post(url, formData, {
        headers: new HttpHeaders().set(
          'Authorization',
          this.authService.getAccessTokenId()
        )
      })
      .map((response: any) => {
        return response;
      });
  }
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
  public updateAttachments(
    _id: any,
    type = 'projects',
    data: any
  ): Observable<any> {
    let url;
    if (type == 'projects') {
      url = Baseconfig.getPath() + '/projects/' + _id;
    }
    if (type == 'objectives') {
      url = Baseconfig.getPath() + '/objectives/' + _id;
    }
    if (type == 'activities') {
      url = Baseconfig.getPath() + '/activities/' + _id;
    }
    if (type == 'tasks') {
      url = Baseconfig.getPath() + '/tasks/' + _id;
    }

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
