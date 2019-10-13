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

import { Baseconfig } from '../../../../sdk/base.config';
import { DataTableDirective } from 'angular-datatables';
import { DepartmentApi } from '../../../../sdk/services/custom/department.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MiscHelperService } from '../../../../sdk/services/custom/misc.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from '../../../../sdk/services/custom/user.service';
import { Validators } from '@angular/forms';

// import { ApplicationApi } from '../../../../sdk/services/custom/assets.service';

@Component({
  selector: 'app-departmentsmodal',
  templateUrl: './departmentsmodal.component.html',
  styleUrls: ['./departmentsmodal.component.css']
})
export class DepartmentsmodalComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private miscHelperService: MiscHelperService,
    private departmentApi: DepartmentApi,
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
    } else {
      this.getUserNextId();
    }
  }

  closeModal() {
    this.output.emit(null);
  }

  formInitializer() {
    this.appInfoForm = this.fb.group({
      name: [null, [Validators.required]],
      id: ['', [Validators.required]],
      _id: ['', []]
      // status: ['', [Validators.required]],
    });
  }

  getUserNextId() {
    this.departmentApi.getDepartmentNextId().subscribe(
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
  }

  updateData() {
    this.isLoading = true;

    const val = this.appInfoForm.value;

    this.departmentApi.updateDepartment(this.formData._id, val).subscribe(
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
    this.departmentApi.insertDepartment(this.appInfoForm.value).subscribe(
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
