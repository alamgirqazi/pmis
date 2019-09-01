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
import { DonorApi } from '../../../../sdk/services/custom/donors.service';
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
  selector: 'app-donorsmodal',
  templateUrl: './donorsmodal.component.html',
  styleUrls: ['./donorsmodal.component.css']
})
export class DonorsmodalComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private donorApi: DonorApi,
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
  rDesignationesult;
  userInfo;
  AdminSelected = false;
  filePresent = false;
  isLoadingImgUpload = false;
  appInfoForm: FormGroup;
  submitForm = false;
  locationListing = [];
  userTypeList = [];
  ngOnInit() {
    this.formInitializer();
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
      company: [''],
      phone: [''],
      focal_person: [''],
      _id: ['', []]
      // status: ['', [Validators.required]],
    });
  }

  getUserNextId() {
    this.donorApi.getDonorNextId().subscribe(
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
    this.donorApi.updateDonor(this.formData._id, val).subscribe(
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
    this.donorApi.insertDonor(this.appInfoForm.value).subscribe(
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
