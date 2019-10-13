import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {
  Component,
  ElementRef,
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

import { AuthService } from '../../../../sdk/services/core/auth.service';
import { Baseconfig } from '../../../../sdk/base.config';
import { DataTableDirective } from 'angular-datatables';
import { DepartmentApi } from './../../../../sdk/services/custom/department.service';
import { FormGroup } from '@angular/forms';
import { MiscHelperService } from '../../../../sdk/services/custom/misc.service';
import { ObjectivesApi } from '../../../../sdk/services/custom/objectives.service';
import { ProjectsApi } from '../../../../sdk/services/custom/projects.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from './../../../../sdk/services/custom/user.service';
import { Validators } from '@angular/forms';
import { DonorApi } from '../../../../sdk/services/custom/donors.service';

// import { ApplicationApi } from '../../../../sdk/services/custom/assets.service';

@Component({
  selector: 'app-projectsmodal',
  templateUrl: './projectsmodal.component.html',
  styleUrls: ['./projectsmodal.component.css']
})
export class ProjectsmodalComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private miscHelperService: MiscHelperService,
    private authService: AuthService,
    private projectsApi: ProjectsApi,
    private objectivesApi: ObjectivesApi,
    private departmentApi: DepartmentApi,
    private donorApi: DonorApi,
    private userApi: UserApi,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private fb: FormBuilder
  ) {
    this.toasterService = toasterService;
  }
  @Input() formData;
  @Input() newInstance;
  @Output() output: EventEmitter<any> = new EventEmitter();
  @Output() outputAndReload: EventEmitter<any> = new EventEmitter();
  // deleteTemplate: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;
  attachments = [];
  isLoading = false;
  deleteId;
  control;
  result;
  title;
  modalRef: BsModalRef;
  tempFormData;
  appInfoForm: FormGroup;
  appActivityForm: FormGroup;
  appObjectiveForm: FormGroup;
  submitForm = false;
  submitObjectives = false;
  objectiveDeleted = false;
  objectiveInfo;
  locationListing = [];
  categoriesList = [];
  role = 'User';
  usersList = [];
  departmentList = [];
  projectManagersList = [];
  @Input() tabId = 1;
  githubUsers = [];

  // priorityList = [
  //   {
  //     id: 1,
  //     name: 'low'
  //   },
  //   {
  //     id: 2,
  //     name: 'medium'
  //   },
  //   {
  //     id: 3,
  //     name: 'high'
  //   }
  // ];

  priorityList = [];
  severityList = [];
  donorListing = [];
  ngOnInit() {
    // this.locationListing = [...this.miscHelperService.locationList];
    // this.departmentList = this.miscHelperService.departmentList;
    this.severityList = this.miscHelperService.severityList;
    this.priorityList = this.miscHelperService.priorityList;
    const { role } = this.authService.getAccessTokenInfo();
    this.getUsersFromDB();
    this.getDonorListing();
    this.getDepartments();
    this.getProjectManagers();
    this.formInitializer();
    if (this.newInstance) {
      this.getProjectsNextId();
      this.addObjectives();
    }
    if (!this.newInstance) {
      this.appInfoForm.patchValue(this.formData);
      this.addExistingActivities();
      // create new activities
    }

    this.role = role;
    // this.getAll();
  }

  addExistingActivities() {
    // if (this.formData.objectives && this.formData.objectives.length > 0) {
    //   // patch Rooms here
    //   this.resetObjectives();
    //   const control = <FormArray>this.appObjectiveForm.get('objectives');

    //   for (const obj of this.formData.objectives) {
    //     const addrCtrl = this.createObjectives();
    //     addrCtrl.patchValue(obj);
    //     control.push(addrCtrl);
    //   }
    // } else {
    // this.addObjectives();
    this.getObjectivesFromDB();
    // }
  }

  getDepartments() {
    this.departmentApi.getAllDepartments().subscribe(
      async response => {
        this.departmentList = response.data;
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  getObjectivesFromDB() {
    const project_id = this.appInfoForm.controls['_id'].value;
    this.objectivesApi.getObjectivesByIds(project_id, '').subscribe(
      async response => {
        if (response.data && response.data.docs.length > 0) {
          // patch Rooms here
          this.resetObjectives();
          const control = <FormArray>this.appObjectiveForm.get('objectives');

          for (const obj of response.data.docs) {
            const addrCtrl = this.createObjectives();
            addrCtrl.patchValue(obj);
            control.push(addrCtrl);
          }
        } else {
          this.addObjectives();
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
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      _id: ['', []],
      // objective: ['', []],
      // activity: ['', []],
      // assigned_to: ['', []],
      // task: ['', []],
      department: ['', [Validators.required]],
      priority: ['medium', [Validators.required]],
      start_date: [null, [Validators.required]],
      price: [null, []],
      donor: [null, []],
      severity: ['normal', [Validators.required]],
      end_date: [null, [Validators.required]],
      notes: [null, []],
      attachments: [null, []],
      users: [],
      objectives: this.fb.array([])
    });
    this.appObjectiveForm = this.fb.group({
      objectives: this.fb.array([])
    });
  }

  createObjectives() {
    return this.fb.group({
      _id: [''],
      objective_name: ['', [Validators.required]],
      project_id: [''],
      severity: ['normal', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      attachments: [null],
      users_assigned: [null]
    });
  }
  resetObjectives() {
    const control = <FormArray>this.appObjectiveForm.get('objectives');
    this.clearFormArray(control);
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  createUsers() {
    return this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      type: [null],
      avatar: [null]
    });
  }

  get formDataObjectives() {
    return <FormArray>this.appObjectiveForm.get('objectives');
  }
  get formDataUsers() {
    return <FormArray>this.appInfoForm.get('users');
  }
  get formDataUsersArray() {
    return this.appInfoForm.controls['users'].value;
  }

  addObjectives() {
    (<FormArray>this.appObjectiveForm.get('objectives')).push(
      this.createObjectives()
    );
  }
  addUsers() {
    (<FormArray>this.appInfoForm.get('users')).push(this.createUsers());
  }

  deleteObjective(id, item) {
    // if (id !== 0) {
    if (item.value._id && item.value._id != '') {
      this.objectiveDeleted = true;
      this.objectiveInfo = item;
      const control = <FormArray>this.appObjectiveForm.get('objectives');
      this.control = control;
      this.deleteId = id;
      this.openDeleteModal(this.deleteTemplate);

      // control.removeAt(id);
      //open delete modal;
    } else {
      const control = <FormArray>this.appObjectiveForm.get('objectives');
      control.removeAt(id);
    }
    // }
  }
  deleteObjectiveFromDB() {
    this.objectivesApi.deleteObjective(this.objectiveInfo.value._id).subscribe(
      async response => {
        this.control.removeAt(this.deleteId);
        this.toasterService.pop('success', 'Objective deleted Successfully');
        this.modalRef.hide();
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }

  decline() {
    this.modalRef.hide();
  }

  getProjectManagers() {
    const type = 'Managers';
    this.getUsersFromDB(type);
  }

  getUsersFromDB(type = 'Chief Operating Officer') {
    // const user_type = null;
    this.userApi.getUsers(type).subscribe(
      async response => {
        console.log('my users->', response);

        response.data.docs.forEach(element => {
          if (element.avatar) {
            element.src =
              Baseconfig.getPath() + '/' + element.avatar + element.avatar_ext;
          }
        });

        if (type === 'Chief Operating Officer') {
          this.usersList = response.data.docs;
        } else {
          this.projectManagersList = response.data.docs;
        }

        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  getProjectsNextId() {
    this.projectsApi.getProjectsNextId().subscribe(
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
  getDonorListing() {
    this.donorApi.getDonors().subscribe(
      async response => {
        console.log('respo donore->', response);
        if (response.data && response.data.docs) {
          this.donorListing = response.data.docs;
        }
        // this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  openDeleteModal(template) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xs' });
  }
  saveAppInfo() {
    this.submitForm = true;
    if (this.appInfoForm.valid) {
      if (this.newInstance) {
        this.insertData();
      } else {
        if (this.tabId === 1) {
          this.updateData(this.appInfoForm.value);
        } else if (this.tabId === 2) {
          this.saveObjectivesToDB();
        }
        // //   let objectives = this.appInfoForm.controls['objectives'].value;
        // //   objectives.forEach(element => {
        // //     if (element._id == '') {
        // //       delete element._id;
        // //     }
        // //   });

        // //   this.updateData({
        // //     objectives: objectives
        // //   });
        // // }
      }
    }
    // console.log('save against this ID', this.formData._id);
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
  openAttachments(template: TemplateRef<any>, data) {
    this.tempFormData = data;
    console.log('data', data);
    this.title = `Objective: ${data.objective_name}`;
    this.attachments = data.attachments;
    this.modalRef = this.modalService.show(template, { class: 'modal-xlg' });
  }

  reload() {
    this.outputAndReload.emit(null);
  }

  saveObjectivesToDB() {
    this.submitObjectives = true;
    if (this.appObjectiveForm.valid) {
      this.isLoading = true;
      const project_id = this.appInfoForm.controls['_id'].value;
      this.objectivesApi
        .insertObjectives(this.appObjectiveForm.value, project_id)
        .subscribe(
          async response => {
            console.log('response->', response);
            this.outputAndReload.emit(null);
            this.submitObjectives = false;
            this.isLoading = false;

            // this.slimScroll.complete();
          },
          error => {
            console.log('error', error);
            // this.modalRef.hide();
            this.isLoading = false;

            this.submitObjectives = false;
            this.toasterService.pop('error', 'There are some error inserting');
            this.slimScroll.complete();
          }
        );
    }
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

  assignedToChanged(event) {}
}
