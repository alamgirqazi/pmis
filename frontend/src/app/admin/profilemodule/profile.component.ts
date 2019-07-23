import * as moment from 'moment';

import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivitiesApi } from './../../../sdk/services/custom/activities.service';
import { AsideNavigationService } from '../../services/asideNavigation.Service';
import { AuthService } from '../../../sdk/services/core/auth.service';
import { Baseconfig } from '../../../sdk/base.config';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from '../../../sdk/services/custom/excel.service';
import { MiscHelperService } from '../../../sdk/services/custom/misc.service';
import { ObjectivesApi } from './../../../sdk/services/custom/objectives.service';
import { ProjectsApi } from '../../../sdk/services/custom/projects.service';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { TasksApi } from './../../../sdk/services/custom/tasks.service';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from './../../../sdk/services/custom/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,

    private fb: FormBuilder,
    private userApi: UserApi,
    private toasterService: ToasterService,
    private _asideNavigationService: AsideNavigationService
  ) {
    this.toasterService = toasterService;
  }
  navOpened;
  result = [];
  userInfo;
  submitForm = false;
  isLoadingImgUpload = false;
  isLoading = false;
  filePresent;
  modalRef: BsModalRef;
  appInfoForm: FormGroup;
  _id;
  // @TODO
  ngOnInit() {
    const { _id, role } = this.authService.getAccessTokenInfo();
    this._id = _id;
    this.formInitializer();
    this.getAll();
    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
  }

  onFileChange(e) {
    console.log('e', e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      this.userInfo = {};
      this.userInfo.touched = true;
      this.userInfo.avatar = (<FileReader>event.target).result;
      this.userInfo.file = file;
      this.userInfo.extension = file.name.split('.').pop();
    };
    this.filePresent = true;
  }

  formInitializer() {
    this.appInfoForm = this.fb.group({
      name: [null, [Validators.required]],
      id: ['', [Validators.required]],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      avatar: [null],
      avatar_ext: [null],
      _id: ['', []]
      // status: ['', [Validators.required]],
    });
  }

  getAll() {
    this.userApi.getSingleUser(this._id).subscribe(
      async response => {
        console.log('respoe->', response);
        this.appInfoForm.patchValue(response.data);
        if (response.data.avatar) {
          this.userInfo = {};
          this.userInfo.avatar =
            Baseconfig.getPath() +
            '/' +
            response.data.avatar +
            response.data.avatar_ext;
        }
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        // this.slimScroll.complete();
      }
    );
  }
  uploadImage() {
    if (this.filePresent) {
      this.isLoadingImgUpload = true;
      const id = this.appInfoForm.controls.id.value;

      this.userApi
        .uploadAvatar(this.userInfo, this.userInfo.file, id)
        .subscribe(
          async response => {
            console.log('respoe->', response);
            this.isLoadingImgUpload = false;
            this.toasterService.pop('success', 'Image uploaded successfully!');
            // this.appInfoForm.patchValue(response.data);
            // this.slimScroll.complete();
          },
          error => {
            console.log('error', error);
            this.isLoadingImgUpload = false;
            this.toasterService.pop(
              'error',
              'There are some error while uploading Image'
            );

            // this.slimScroll.complete();
          }
        );
    }
  }
  save() {
    this.isLoading = true;
    const val = this.appInfoForm.value;
    if (val.password == '') {
      delete val.password;
    }
    this.userApi.updateUser(this._id, val).subscribe(
      async response => {
        console.log('response->', response);
        this.toasterService.pop('success', 'Data saved successfully!');
        this.isLoading = false;

        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.isLoading = false;

        // this.modalRef.hide();
        this.toasterService.pop('error', 'There are some error updating');
      }
    );
  }
}
