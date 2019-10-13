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
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { ActivitiesApi } from './../../../../sdk/services/custom/activities.service';
import { AuthService } from '../../../../sdk/services/core/auth.service';
import { Baseconfig } from '../../../../sdk/base.config';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup } from '@angular/forms';
import { MiscHelperService } from '../../../../sdk/services/custom/misc.service';
import { ObjectivesApi } from '../../../../sdk/services/custom/objectives.service';
import { ProjectsApi } from '../../../../sdk/services/custom/projects.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from './../../../../sdk/services/custom/user.service';
import { Validators } from '@angular/forms';

// import { ApplicationApi } from '../../../../sdk/services/custom/assets.service';

@Component({
  selector: 'app-objectivesmodal',
  templateUrl: './objectivesmodal.component.html',
  styleUrls: ['./objectivesmodal.component.css']
})
export class ObjectivesmodalComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private miscHelperService: MiscHelperService,
    private authService: AuthService,
    private projectsApi: ProjectsApi,
    private activitiesApi: ActivitiesApi,
    private objectivesApi: ObjectivesApi,
    private userApi: UserApi,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private fb: FormBuilder
  ) {
    this.toasterService = toasterService;
  }
  @Input() formData;
  @Input() newInstance;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;

  @Output() output: EventEmitter<any> = new EventEmitter();
  @Output() outputAndReload: EventEmitter<any> = new EventEmitter();
  isLoading = false;
  result;
  modalRef: BsModalRef;

  appInfoForm: FormGroup;
  appActivityForm: FormGroup;
  appObjectiveForm: FormGroup;
  submitForm = false;
  submitObjectives = false;
  locationListing = [];
  categoriesList = [];
  role = 'User';
  usersList = [];
  tempFormData;
  attachments = [];
  title;
  activityInfo;
  deleteId;
  control;
  departmentList = [];
  severityList = [];
  priorityList = [];
  tabId = 1;
  githubUsers = [];
  ngOnInit() {
    // this.locationListing = [...this.miscHelperService.locationList];
    this.departmentList = this.miscHelperService.departmentList;
    this.severityList = this.miscHelperService.severityList;
    this.priorityList = this.miscHelperService.priorityList;
    const { role } = this.authService.getAccessTokenInfo();
    this.getProjectCoordinators();
    this.formInitializer();

    // if (this.newInstance) {
    //   this.addActivities();
    // }
    if (!this.newInstance) {
      this.appInfoForm.patchValue(this.formData);
      this.getActivitiesFromDB();
      // create new activities
    }

    this.role = role;
    // this.getAll();
  }
  getActivitiesFromDB() {
    const objective_id = this.formData._id;
    this.activitiesApi.getActivitiesByIds(objective_id, '').subscribe(
      async response => {
        console.log('response', response);
        if (response.data && response.data.docs.length > 0) {
          // patch Rooms here
          this.resetActivities();
          const control = <FormArray>this.appInfoForm.get('activities');

          for (const obj of response.data.docs) {
            const addrCtrl = this.createActivities();
            addrCtrl.patchValue(obj);
            control.push(addrCtrl);
          }
        } else {
          console.log('else');
          this.addActivities();
        }
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  // getAll() {}

  closeModal() {
    this.output.emit(null);
  }

  changeTab(id) {
    this.tabId = id;
  }
  formInitializer() {
    this.appInfoForm = this.fb.group({
      activities: this.fb.array([])
    });
  }
  deleteActivity(id, item) {
    // if (id !== 0) {
    if (item.value._id && item.value._id != '') {
      this.activityInfo = item;
      const control = <FormArray>this.appInfoForm.get('activities');
      this.control = control;
      this.deleteId = id;
      this.openDeleteModal(this.deleteTemplate);

      // control.removeAt(id);
      //open delete modal;
    } else {
      const control = <FormArray>this.appInfoForm.get('activities');
      control.removeAt(id);
    }
    // }
  }

  decline() {
    this.modalRef.hide();
  }

  openDeleteModal(template) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xs' });
  }
  resetActivities() {
    const control = <FormArray>this.appInfoForm.get('activities');
    this.clearFormArray(control);
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  get formDataActivities() {
    return <FormArray>this.appInfoForm.get('activities');
  }

  addActivities() {
    (<FormArray>this.appInfoForm.get('activities')).push(
      this.createActivities()
    );
  }
  createActivities() {
    return this.fb.group({
      _id: [''],
      activity_name: ['', [Validators.required]],
      project_id: [''],
      objective_id: [''],
      users_assigned: [null, [Validators.required]],
      attachments: [null, []],
      priority: ['medium', [Validators.required]],
      start_date: [null, [Validators.required]],
      severity: ['normal', [Validators.required]],
      end_date: [null, [Validators.required]]
    });
  }

  get formDataObjectives() {
    return <FormArray>this.appInfoForm.get('activities');
  }

  getProjectCoordinators() {
    const type = 'Project Managers';
    this.getUsersFromDB(type);
  }
  deleteActivityFromDB() {
    this.activitiesApi.deleteActivity(this.activityInfo.value._id).subscribe(
      async response => {
        console.log('deleteActivityFromDB->', response);
        this.control.removeAt(this.deleteId);
        this.toasterService.pop('success', 'Activity deleted Successfully');
        this.modalRef.hide();
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  openAttachments(template: TemplateRef<any>, data) {
    this.tempFormData = data;
    console.log('data', data);
    this.title = `Activity: ${data.activity_name}`;
    this.attachments = data.attachments;
    this.modalRef = this.modalService.show(template, { class: 'modal-xlg' });
  }
  getUsersFromDB(type = 'Project Managers') {
    // const user_type = null;
    this.userApi.getUsers(type).subscribe(
      async response => {
        console.log('my users->', response);
        this.usersList = response.data.docs;

        this.usersList.forEach(element => {
          if (element.avatar) {
            element.src =
              Baseconfig.getPath() + '/' + element.avatar + element.avatar_ext;
          }
        });

        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }

  saveAppInfo() {
    this.submitObjectives = true;
    if (this.appInfoForm.valid) {
      this.isLoading = true;
      this.activitiesApi
        .insertActivities(
          this.appInfoForm.value,
          this.formData.project_id,
          this.formData._id
        )
        .subscribe(
          async response => {
            console.log('response->', response);
            this.outputAndReload.emit(null);
            this.isLoading = false;
            this.submitObjectives = false;

            // this.slimScroll.complete();
          },
          error => {
            console.log('error', error);
            this.submitObjectives = false;

            // this.modalRef.hide();
            this.isLoading = false;

            this.toasterService.pop('error', 'There are some error inserting');
            this.slimScroll.complete();
          }
        );
    }
  }

  updateData(data_to_save) {
    this.isLoading = true;
    this.projectsApi
      .updateProjectsStatus(this.formData._id, data_to_save)
      .subscribe(
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
  reload() {
    this.outputAndReload.emit(null);
  }
  insertData() {
    this.isLoading = true;
    this.projectsApi.insertProjects(this.appInfoForm.value).subscribe(
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
