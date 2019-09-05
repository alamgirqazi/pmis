import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren
} from '@angular/core';

// import { ApplicationApi } from '../../../../sdk/services/custom/assets.service';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { Validators } from '@angular/forms';
import { MiscHelperService } from '../../../../sdk/services/custom/misc.service';
import { UserApi } from '../../../../sdk/services/custom/user.service';
import { Baseconfig } from '../../../../sdk/base.config';

@Component({
  selector: 'app-usersmodal',
  templateUrl: './usersmodal.component.html',
  styleUrls: ['./usersmodal.component.css']
})
export class UsersmodalComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private miscHelperService: MiscHelperService,
    private userApi: UserApi,
    private toasterService: ToasterService,
    private fb: FormBuilder
  ) {
    this.toasterService = toasterService;
  }
  @Input() formData;
  @Input() newInstance;
  @Output() output: EventEmitter<any> = new EventEmitter();
  @Output() outputAndReload: EventEmitter<any> = new EventEmitter();
  isLoading = false;
  result;
  userInfo;
  placeHolder = 'assets/images/placeholder.jpg';
  AdminSelected = false;
  filePresent = false;
  isLoadingImgUpload = false;
  appInfoForm: FormGroup;
  submitForm = false;
  locationListing = [];
  userTypeList = [];
  ngOnInit() {
    this.formInitializer();
    this.userTypeList = [...this.miscHelperService.userTypeList];

    if (!this.newInstance) {
      this.appInfoForm.patchValue(this.formData);

      if (this.formData.avatar) {
        this.userInfo = {};
        this.userInfo.avatar =
          Baseconfig.getPath() +
          '/' +
          this.formData.avatar +
          this.formData.avatar_ext;
      }
    } else {
      this.getUserNextId();
    }
    this.getAll();
  }

  getAll() {}

  closeModal() {
    this.output.emit(null);
  }

  onFileChange(e) {
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
      designation: [null],
      avatar: [null],
      avatar_ext: [null],
      _id: ['', []]
      // status: ['', [Validators.required]],
    });
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
            this.outputAndReload.emit(null);

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

  getUserNextId() {
    this.userApi.getUserNextId().subscribe(
      async response => {
        console.log('respoe->', response);
        this.appInfoForm.patchValue(response.data);
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  saveAppInfo() {
    this.submitForm = true;
    if (this.appInfoForm.valid) {
      if (this.newInstance) {
        this.insertData();
      } else {
        this.updateData();
      }
    }
    // console.log('save against this ID', this.formData._id);
  }

  updateData() {
    this.isLoading = true;

    const val = this.appInfoForm.value;
    if (val.password == '') {
      delete val.password;
    }
    this.userApi.updateUser(this.formData._id, val).subscribe(
      async response => {
        console.log('response->', response);
        this.outputAndReload.emit(null);
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        // this.modalRef.hide();
        this.toasterService.pop('error', 'There are some error updating');
        this.slimScroll.complete();
      }
    );
  }
  insertData() {
    this.isLoading = true;
    this.userApi.insertUser(this.appInfoForm.value).subscribe(
      async response => {
        console.log('response->', response);
        this.outputAndReload.emit(null);
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        // this.modalRef.hide();
        this.toasterService.pop('error', 'There are some error inserting');
        this.slimScroll.complete();
      }
    );
  }
}
