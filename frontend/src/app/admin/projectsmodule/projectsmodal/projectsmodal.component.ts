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
  tabId = 1;
  ngOnInit() {
    // this.locationListing = [...this.miscHelperService.locationList];
    // this.categoriesList = this.miscHelperService.categoriesList;
    const { Role, Location } = this.authService.getAccessTokenInfo();
    this.getUsersFromDB();
    this.formInitializer();
    if (this.newInstance) {
      this.getProjectsNextId();
    }
    if (!this.newInstance) {
      this.appInfoForm.patchValue(this.formData);
    }

    this.role = Role;

    this.addObjectives();
    // this.getAll();
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
      objective: ['', []],
      activity: ['', []],
      assigned_to: ['', []],
      task: ['', []],
      department: ['', []],
      priority: ['', []],
      start_date: [null, []],
      end_date: [null, []],
      notes: [null, []],
      attachments: [null, []],
      status: [null, []],
      objectives: this.fb.array([])
    });
    // this.appObjectiveForm = this.fb.group({
    //   objectives: this.fb.array([])
    // });
  }

  createObjectives() {
    return this.fb.group({
      _id: [''],
      objective_name: ['', [Validators.required]],
      users_assigned: [null]
    });
  }

  get formDataObjectives() {
    return <FormArray>this.appInfoForm.get('objectives');
  }

  addObjectives() {
    (<FormArray>this.appInfoForm.get('objectives')).push(
      this.createObjectives()
    );
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
    this.userApi.getUsers().subscribe(
      async response => {
        console.log('my users->', response);
        this.usersList = response.data.docs;
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
        this.updateData();
      }
    }
    // console.log('save against this ID', this.formData._id);
  }

  updateData() {
    this.isLoading = true;
    this.projectsApi
      .updateProjectsStatus(this.formData._id, this.appInfoForm.value)
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
