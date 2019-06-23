import { ActivitiesApi } from './../../../sdk/services/custom/activities.service';
import { ObjectivesApi } from './../../../sdk/services/custom/objectives.service';
// import '../../../mainassets/plugins/datatables/css/dataTables.bootstrap.css';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {
  Component,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
  AfterViewInit
} from '@angular/core';

import { AsideNavigationService } from '../../services/asideNavigation.Service';
import { DataTableDirective } from 'angular-datatables';
import { MiscHelperService } from '../../../sdk/services/custom/misc.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExcelService } from '../../../sdk/services/custom/excel.service';
import { AuthService } from '../../../sdk/services/core/auth.service';
import * as moment from 'moment';
import { Baseconfig } from '../../../sdk/base.config';
import { ProjectsApi } from '../../../sdk/services/custom/projects.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, AfterViewInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private authService: AuthService,
    private http: HttpClient,
    private miscHelperService: MiscHelperService,
    private excelService: ExcelService,
    private projectsApi: ProjectsApi,
    private objectivesApi: ObjectivesApi,
    private activitiesApi: ActivitiesApi,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private _asideNavigationService: AsideNavigationService
  ) {
    this.toasterService = toasterService;
  }
  selectedAppStatus: any = null;
  allStatuses;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  tabList = [false, false, false];
  navOpened;
  result = [];
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
    const { id, _id } = this.authService.getAccessTokenInfo();
    console.log('TCL: ObjectivesComponent -> ngOnInit -> id', _id);
    this._id = _id;
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
        const params = this.miscHelperService.objectToHttpParams(
          dataTablesParameters
        );
        const { _id } = this.authService.getAccessTokenInfo();

        //      let filter = this.selectedLocation;
        // if (this.selectedLocation == 'All') {
        //   filter = '';
        // }
        dataTablesParameters.user_id = _id;
        const url = Baseconfig.getPath() + `/activities`;
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
            console.log('res', resp);
            const { docs, limit, total, offset } = resp['data'];
            this.result = docs;
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
    console.log('data', data);
    this.newInstance = newInstance;
    this.formData = data;
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    };
    this.modalRef = this.modalService.show(template, config);
  }

  updateAppStatus(status, data) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();

    const displayMsg = `${data.activity_name} is now ${status}`;

    this.activitiesApi.updateActivitiesStatus(data._id, { status }).subscribe(
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
