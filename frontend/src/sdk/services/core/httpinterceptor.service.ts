import 'rxjs/add/operator/do';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private slimScroll: SlimLoadingBarService,
    private authService: AuthService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).do(
      event => {
        // if (event instanceof HttpResponse) {
        //   // Runs number of http requests
        // }
      },
      err => {
        if (
          (err instanceof HttpErrorResponse && err.status === 401) ||
          err.status === 403
        ) {

          this.authService.clearToken();
          this.router.navigate(['/login']);
          this.slimScroll.complete();
        }
      }
    );
  }
}
