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
  ViewChildren
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
  appInfoForm: FormGroup;
  appActivityForm: FormGroup;
  appObjectiveForm: FormGroup;
  submitForm = false;
  submitObjectives = false;
  locationListing = [];
  categoriesList = [];
  role = 'User';
  usersList = [];
  departmentList = [];
  tabId = 1;
  githubUsers = [];
  ngOnInit() {
    // this.locationListing = [...this.miscHelperService.locationList];
    this.departmentList = this.miscHelperService.departmentList;
    const { Role, Location } = this.authService.getAccessTokenInfo();
    this.getUsersFromDB();
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

    this.role = Role;
    // this.getAll();
  }

  addExistingActivities() {
    if (this.formData.objectives && this.formData.objectives.length > 0) {
      // patch Rooms here
      this.resetObjectives();
      const control = <FormArray>this.appInfoForm.get('objectives');

      for (const obj of this.formData.objectives) {
        const addrCtrl = this.createObjectives();
        addrCtrl.patchValue(obj);
        control.push(addrCtrl);
      }
    } else {
      this.addObjectives();
    }
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
      department: ['', []],
      priority: ['', []],
      start_date: [null, []],
      end_date: [null, []],
      notes: [null, []],
      attachments: [null, []],
      status: [null, []],
      users: [],
      objectives: this.fb.array([])
    });
    // this.appObjectiveForm = this.fb.group({
    //   objectives: this.fb.array([])
    // });
  }

  createObjectives() {
    return this.fb.group({
      _id: [''],
      objective_name: [''],
      users_assigned: [null]
    });
  }
  resetObjectives() {
    const control = <FormArray>this.appInfoForm.get('objectives');
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
    return <FormArray>this.appInfoForm.get('objectives');
  }
  get formDataUsers() {
    return <FormArray>this.appInfoForm.get('users');
  }
  get formDataUsersArray() {
    return this.appInfoForm.controls['users'].value;
  }

  addObjectives() {
    (<FormArray>this.appInfoForm.get('objectives')).push(
      this.createObjectives()
    );
  }
  addUsers() {
    (<FormArray>this.appInfoForm.get('users')).push(this.createUsers());
  }

  deleteObjective(id, item) {
    if (id !== 0) {
      const control = <FormArray>this.appInfoForm.get('objectives');
      control.removeAt(id);
      // if (item.value._id) {
      //   this.subsidiaryDeleted = true;

      //   //   this.deleteCompanySubsidiariesInfo(subinfo.value._id);
      // }
    }
  }
  getUsersFromDB() {
    // const user_type = null;
    const user_type = 'Project Manager';
    this.userApi.getUsers(user_type).subscribe(
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
