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
import { TasksApi } from './../../../../sdk/services/custom/tasks.service';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from './../../../../sdk/services/custom/user.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-activitiesmodal',
  templateUrl: './activitiesmodal.component.html',
  styleUrls: ['./activitiesmodal.component.css']
})
export class ActivitiesmodalComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private miscHelperService: MiscHelperService,
    private authService: AuthService,
    private projectsApi: ProjectsApi,
    private activitiesApi: ActivitiesApi,
    private objectivesApi: ObjectivesApi,
    private userApi: UserApi,
    private tasksApi: TasksApi,
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
  tempFormData;
  attachments = [];
  title;
  appInfoForm: FormGroup;
  appActivityForm: FormGroup;
  appObjectiveForm: FormGroup;
  submitForm = false;
  submitObjectives = false;
  locationListing = [];
  categoriesList = [];
  role = 'User';
  usersList = [];
  taskInfo;
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
      this.getTasksFromDB();
      // create new activities
    }

    this.role = role;
    // this.getAll();
  }
  getTasksFromDB() {
    const activity_id = this.formData._id;
    console.log('formData', this.formData);
    console.log('activity_id');
    this.tasksApi.getTasksByIds(activity_id, '').subscribe(
      async response => {
        console.log('my projects tasks ->', response);
        if (response.data && response.data.docs.length > 0) {
          // patch Rooms here
          this.resetTasks();
          const control = <FormArray>this.appInfoForm.get('tasks');

          for (const obj of response.data.docs) {
            const addrCtrl = this.createTasks();
            addrCtrl.patchValue(obj);
            control.push(addrCtrl);
          }
        } else {
          this.addTasks();
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

  openAttachments(template: TemplateRef<any>, data) {
    this.tempFormData = data;
    console.log('data', data);
    this.title = `Task: ${data.task_name}`;
    this.attachments = data.attachments;
    this.modalRef = this.modalService.show(template, { class: 'modal-xlg' });
  }

  reload() {
    this.outputAndReload.emit(null);
  }
  changeTab(id) {
    this.tabId = id;
  }
  formInitializer() {
    this.appInfoForm = this.fb.group({
      tasks: this.fb.array([])
    });
  }
  deleteTask(id, item) {
    // if (id !== 0) {
    if (item.value._id && item.value._id != '') {
      this.taskInfo = item;
      const control = <FormArray>this.appInfoForm.get('tasks');
      this.control = control;
      this.deleteId = id;
      this.openDeleteModal(this.deleteTemplate);

      // control.removeAt(id);
      //open delete modal;
    } else {
      const control = <FormArray>this.appInfoForm.get('tasks');
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
  resetTasks() {
    const control = <FormArray>this.appInfoForm.get('tasks');
    this.clearFormArray(control);
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  get formDataTasks() {
    return <FormArray>this.appInfoForm.get('tasks');
  }

  addTasks() {
    (<FormArray>this.appInfoForm.get('tasks')).push(this.createTasks());
  }
  createTasks() {
    return this.fb.group({
      _id: [''],
      task_name: ['', [Validators.required]],
      project_id: [''],
      objective_id: [''],
      activity_id: [''],
      users_assigned: [null, [Validators.required]],
      attachments: [null, []],
      priority: ['medium', []],
      start_date: [null, [Validators.required]],
      severity: ['normal', [Validators.required]],
      end_date: [null, [Validators.required]]
    });
  }
  getProjectCoordinators() {
    const type = 'Project Coordinators / Officers';
    this.getUsersFromDB(type);
  }
  deleteTaskFromDB() {
    console.log('this.objectiveInfo', this.taskInfo.value._id);
    this.tasksApi.deleteTask(this.taskInfo.value._id).subscribe(
      async response => {
        console.log('deletetaskInfoFromDB->', response);
        this.control.removeAt(this.deleteId);
        this.toasterService.pop('success', 'Task deleted Successfully');
        this.modalRef.hide();
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }

  getUsersFromDB(type = 'Project Coordinators / Officers') {
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
    this.submitForm = true;
    if (this.appInfoForm.valid) {
      this.isLoading = true;
      this.tasksApi
        .insertTasks(
          this.appInfoForm.value,
          this.formData.project_id,
          this.formData.objective_id,
          this.formData._id // activity id
        )
        .subscribe(
          async response => {
            console.log('response->', response);
            this.outputAndReload.emit(null);
            this.isLoading = false;

            // this.slimScroll.complete();
          },
          error => {
            console.log('error', error);
            // this.modalRef.hide();
            this.isLoading = false;

            this.toasterService.pop('error', 'There are some error inserting');
            this.slimScroll.complete();
          }
        );
    }
  }
}
