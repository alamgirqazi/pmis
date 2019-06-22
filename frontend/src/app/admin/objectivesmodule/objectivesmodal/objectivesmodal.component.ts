import { UserApi } from './../../../../sdk/services/custom/user.service';
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
  ViewChildren,
  ViewChild
} from '@angular/core';

// import { ApplicationApi } from '../../../../sdk/services/custom/assets.service';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { Validators } from '@angular/forms';
import { MiscHelperService } from '../../../../sdk/services/custom/misc.service';
import { AuthService } from '../../../../sdk/services/core/auth.service';
import { ProjectsApi } from '../../../../sdk/services/custom/projects.service';
import { Baseconfig } from '../../../../sdk/base.config';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

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
  activityInfo;
  deleteId;
  control;
  departmentList = [];
  tabId = 1;
  githubUsers = [];
  ngOnInit() {
    // this.locationListing = [...this.miscHelperService.locationList];
    this.departmentList = this.miscHelperService.departmentList;
    const { role } = this.authService.getAccessTokenInfo();
    this.getProjectCoordinators();
    this.formInitializer();

    this.addActivities();

    if (this.newInstance) {
      this.addActivities();
    }
    if (!this.newInstance) {
      this.appInfoForm.patchValue(this.formData);
      this.getActivitiesFromDB();
      // create new activities
    }

    this.role = role;
    // this.getAll();
  }
  getActivitiesFromDB() {
    // const project_id = this.appInfoForm.controls['_id'].value;
    console.log('project_id');
    // this.objectivesApi.getObjectivesByIds(project_id, '').subscribe(
    //   async response => {
    //     console.log('my projects objectives->', response);
    //     if (response.data && response.data.docs.length > 0) {
    //       // patch Rooms here
    //       this.resetObjectives();
    //       const control = <FormArray>this.appObjectiveForm.get('objectives');

    //       for (const obj of response.data.docs) {
    //         const addrCtrl = this.createObjectives();
    //         addrCtrl.patchValue(obj);
    //         control.push(addrCtrl);
    //       }
    //     } else {
    //       this.addObjectives();
    //     }
    //     // this.slimScroll.complete();
    //   },
    //   error => {
    //     console.log('error', error);
    //     this.slimScroll.complete();
    //   }
    // );
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
    console.log('item--', item);
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
      activity_name: [''],
      project_id: [''],
      objective_id: [''],
      users_assigned: [null]
    });
  }
  getProjectCoordinators() {
    const type = 'Project Coordinator';
    this.getUsersFromDB(type);
  }
  deleteActivityFromDB() {
    console.log('this.objectiveInfo', this.activityInfo.value._id);
    // this.activityApi.deleteActivity(this.activityInfo.value._id).subscribe(
    //   async response => {
    //     console.log('deleteActivityFromDB->', response);
    //     this.control.removeAt(this.deleteId);
    //     this.toasterService.pop('success', 'Objective deleted Successfully');
    //     this.modalRef.hide();
    //     // this.slimScroll.complete();
    //   },
    //   error => {
    //     console.log('error', error);
    //     this.slimScroll.complete();
    //   }
    // );
  }

  getUsersFromDB(type = 'Project Coordinator') {
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
      if (this.newInstance) {
        this.insertData();
      } else {
        this.updateData(this.appInfoForm.value);

        // if (this.tabId === 1) {
        //   this.updateData(this.appInfoForm.value);
        // } else if (this.tabId === 2) {
        //   this.updateData(this.appInfoForm.value);
        // }
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
