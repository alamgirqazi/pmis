import {
  BrowserXhr,
  Http,
  HttpModule,
  RequestOptions,
  XHRBackend
} from '@angular/http';
import { BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgProgressBrowserXhr, NgProgressModule } from 'ngx-progressbar';
import { ToasterModule, ToasterService } from 'angular2-toaster';

import { ActivitiesApi } from '../sdk/services/custom/activities.service';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { AsideNavigationService } from './services/asideNavigation.Service';
import { AuthService } from '../sdk/services/core/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CustomdirectivesModule } from './shared/directives/customdirectives/customdirectives.module';
import { DonorApi } from '../sdk/services/custom/donors.service';
import { ErrorInterceptor } from '../sdk/services/core/httpinterceptor.service';
import { ExcelService } from '../sdk/services/custom/excel.service';
import { LoginComponent } from './login/login.component';
import { MiscHelperService } from '../sdk/services/custom/misc.service';
import { NgModule } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ObjectivesApi } from './../sdk/services/custom/objectives.service';
import { ProjectsApi } from '../sdk/services/custom/projects.service';
import { RedirectLoginGuard } from './guard/redirectlogin.service';
import { Router } from '@angular/router';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { StatisticsApi } from '../sdk/services/custom/statistics.service';
import { TasksApi } from './../sdk/services/custom/tasks.service';
import { TreeviewModule } from 'ngx-treeview';
import { UserApi } from '../sdk/services/custom/user.service';
import { isLoginGuard } from './guard/islogin.service';

// import { SidebarService } from './shared/sidebar.service';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRouting,
    SlimLoadingBarModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToasterModule,
    ModalModule.forRoot(),
    NgxJsonViewerModule,
    HttpModule,
    HttpClientModule,
    NgProgressModule,
    BsDatepickerModule.forRoot(),
    CustomdirectivesModule
  ],
  providers: [
    isLoginGuard,
    RedirectLoginGuard,

    // { provide: BrowserXhr, useClass: NgProgressBrowserXhr },

    ToasterService,
    MiscHelperService,
    ExcelService,
    ProjectsApi,
    ObjectivesApi,
    ActivitiesApi,
    TasksApi,
    StatisticsApi,
    AuthService,
    UserApi,
    DonorApi,
    AsideNavigationService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
