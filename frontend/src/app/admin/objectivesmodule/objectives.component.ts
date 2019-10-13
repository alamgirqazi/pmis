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
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
import { ToasterService } from 'angular2-toaster';

// import '../../../mainassets/plugins/datatables/css/dataTables.bootstrap.css';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.css']
})
export class ObjectivesComponent implements OnInit, AfterViewInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private authService: AuthService,
    private http: HttpClient,
    private miscHelperService: MiscHelperService,
    private excelService: ExcelService,
    private projectsApi: ProjectsApi,
    private objectivesApi: ObjectivesApi,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private router: Router,
    private _asideNavigationService: AsideNavigationService
  ) {
    this.toasterService = toasterService;
  }
  selectedAppStatus: any = null;
  allStatuses;
  selectedObjective;
  treeData;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  tabList = [false, false, false];
  navOpened;
  result = [];
  tempFormData;
  title;
  attachments = [];
  hiddenTblresult = [];
  showTempTable = false;

  queryStatus = null;
  queryType = null;
  queryPriority = null;
  modalRef: BsModalRef;
  msgstatus;
  newInstance = true;
  mystatus;
  selectedType;
  selectedCategory = 'All';
  selectedPriority;
  name;
  role;
  location;
  changedApp;
  isFetchingData = false;
  formData;
  @ViewChildren(DataTableDirective)
  dtElement: QueryList<DataTableDirective>;
  selectedLocation = 'All';
  locationListing = [];
  categoriesList2 = [];
  _id;
  // @TODO
  ngOnInit() {
    const { id, _id, role } = this.authService.getAccessTokenInfo();
    this._id = _id;
    // if (role != 'Managers') {
    //   this.router.navigate(['/admin/activities']);
    // }
    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
  }
  ngAfterViewInit() {
    this.configDatatable();
  }
  get returnTodayDate() {
    return new Date(Date.now());
  }
  async configDatatable(flag?) {
    this.isFetchingData = false;
    if (flag) {
      await this.miscHelperService.destroyDataTable(
        'angulardatatable',
        this.dtElement
      );
      this.dtTrigger.next();
    }
    if (!flag) {
      setTimeout(() => {
        this.dtTrigger.next();
      }, 500);
    }

    this.dtOptions = {
      deferRender: true,
      lengthChange: true,
      retrieve: true,
      order: [1, 'desc'],
      pagingType: 'simple_numbers',
      serverSide: true,
      processing: false,
      searching: false,
      // pageLength: 10,
      lengthMenu: [5, 10, 50],
      // dom: 'Btp',
      // buttons: ['csv', 'excel'],

      ajax: (dataTablesParameters: any, callback) => {
        const { _id } = this.authService.getAccessTokenInfo();
        dataTablesParameters.user_id = _id;
        const params = this.miscHelperService.objectToHttpParams(
          dataTablesParameters
        );

        console.log('_od', _id);
        //      let filter = this.selectedLocation;
        // if (this.selectedLocation == 'All') {
        //   filter = '';
        // }
        const url = Baseconfig.getPath() + `/objectives`;
        // const url =
        //   Baseconfig.getPath() + `/projects/objectives/_id/${this._id}`;

        this.http
          .get(url, {
            params: params,
            headers: new HttpHeaders().set(
              'Authorization',
              this.authService.getAccessTokenId()
            )
          })
          .subscribe(resp => {
            const { docs } = resp['data'];
            this.result = docs;

            if (this.result && this.result.length > 0) {
              this.result.forEach(element => {
                const filter = element.users_assigned.filter(
                  e => e._id === this._id
                );
                if (filter && filter.length > 0) {
                  element.selected_user_assigned = filter[0];
                }
                element.percentage = this.miscHelperService.calculateStatusPercentage(
                  element.activity_detail
                );
              });
            }

            setTimeout(() => {
              this.dtTrigger.next();
              setTimeout(() => {
                this.slimScroll.complete();
                this.isFetchingData = true;
              }, 50);
            });

            callback({
              recordsTotal: 1,
              recordsFiltered: 1,
              data: []
            });
          });
      }
    };
  }

  openConfirmationTab(template: TemplateRef<any>, data, mystatus?, msgstatus?) {
    this.msgstatus = msgstatus;
    this.mystatus = mystatus;
    this.changedApp = data;
    this.modalRef = this.modalService.show(template, { class: 'modal-xs' });
  }
  openModal(template: TemplateRef<any>, data, newInstance) {
    this.newInstance = newInstance;
    this.formData = data;
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    };
    this.modalRef = this.modalService.show(template, config);
  }
  reload() {}
  openTreeModal(template: TemplateRef<any>, data) {
    this.selectedObjective = data;
    this.treeData = data.activity_detail;
    const config = {
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'gray modal-xlg'
    };

    for (const iterator of this.treeData) {
      iterator.percentage = this.miscHelperService.calculateStatusPercentageObject(
        iterator
      );
    }
    this.modalRef = this.modalService.show(template, config);
  }
  closeModal() {
    this.modalRef.hide();
  }
  updateAppStatus(status, data) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();

    const selected_user_assigned = data.selected_user_assigned;

    selected_user_assigned.status = status;

    const array = data.users_assigned;
    const displayMsg = `${data.objective_name} is now ${status}`;

    const filter = array.filter(e => e._id !== this._id);

    const merged = [...filter, ...selected_user_assigned];

    // update status based on users_assigned

    this.objectivesApi
      .updateObjectivesStatus(data._id, { users_assigned: merged })
      .subscribe(
        async response => {
          console.log('response', response);
          this.configDatatable(true);
          this.toasterService.pop('success', displayMsg);
          // Toaster MSG
          this.slimScroll.complete();
        },
        error => {
          console.log('error', error);
          this.toasterService.pop('error', 'There are some error updating');
          this.slimScroll.complete();
        }
      );
  }

  openAttachments(template: TemplateRef<any>, data) {
    this.tempFormData = data;
    this.title = `Objective: ${data.objective_name}`;
    this.attachments = data.attachments;
    this.modalRef = this.modalService.show(template, { class: 'modal-xlg' });
  }

  decline() {
    this.modalRef.hide();
  }
  getNameLetters(name: string) {
    let letter = '';
    name;
    name
      .trim()
      .split(' ')
      .forEach(l => (letter = letter + l.charAt(0).toUpperCase()));
    return letter.substring(0, 2);
    // return letter;
  }
  outputAndReload() {
    this.configDatatable(true);
    this.modalRef.hide();
    // this.getAll(true, true);
  }
  changedListing(list) {
    this.selectedLocation = list.name;
    this.configDatatable(true);
  }
  changedCategoryListing(list) {
    this.selectedCategory = list.name;
    this.configDatatable(true);
  }

  deleteApplication() {
    const displayMsg = `${this.changedApp.name} has been removed successfully`;

    this.projectsApi.deleteProjects(this.changedApp._id).subscribe(
      async response => {
        console.log('response', response);
        this.configDatatable(true);
        this.modalRef.hide();
        this.toasterService.pop('success', displayMsg);
        // Toaster MSG
        this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.modalRef.hide();
        this.toasterService.pop('error', 'There are some error updating');
        this.slimScroll.complete();
      }
    );
  }
}
