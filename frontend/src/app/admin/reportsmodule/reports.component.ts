import * as FileSaver from 'file-saver';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jsPDF';
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
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { ExcelService } from '../../../sdk/services/custom/excel.service';
import { MiscHelperService } from '../../../sdk/services/custom/misc.service';
import { ObjectivesApi } from './../../../sdk/services/custom/objectives.service';
import { ProjectsApi } from './../../../sdk/services/custom/projects.service';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';

// import '../../../mainassets/plugins/datatables/css/dataTables.bootstrap.css';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private router: Router,
    private http: HttpClient,
    private excelService: ExcelService,
    private daterangepickerOptions: DaterangepickerConfig,
    private projectsApi: ProjectsApi,
    private objectivesApi: ObjectivesApi,
    private miscHelperService: MiscHelperService,
    private authService: AuthService,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private _asideNavigationService: AsideNavigationService
  ) {
    this.toasterService = toasterService;
    const start = moment().subtract(12, 'months');
    const end = moment();

    this.daterangepickerOptions.skipCSS = true;

    this.daterangepickerOptions.settings = {
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: true,
      startDate: start,
      endDate: end,
      ranges: {}
    };
  }
  selectedAppStatus: any = null;
  hiddenTblresult = [];

  dateEndFormatted;
  dateStartFormatted;
  showTempTable = false;

  dtOptions = {};
  dtOptions2 = {};
  dtOptions3 = {};
  dtOptions4 = {};
  dtOptions5 = {};
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dtTrigger3: Subject<any> = new Subject();
  dtTrigger4: Subject<any> = new Subject();
  dtTrigger5: Subject<any> = new Subject();
  tabList = [false, false, false];
  navOpened;
  result;
  result2;
  queryStatus = null;
  queryType = null;
  queryPriority = null;
  modalRef: BsModalRef;
  msgstatus;
  newInstance = true;
  mystatus;
  selectedType;
  selectedPriority;

  selectedLocation = 'All';
  selectedCategory = 'All';
  selectedDisposed;

  role = 'User';
  location;

  assetList;
  categoriesList;
  isDisposedListing = [
    {
      id: 1,
      name: 'All',
      value: ''
    },
    {
      id: 2,
      name: 'Disposed',
      value: 1
    },
    {
      id: 3,
      name: 'Not Disposed',
      value: 0
    }
  ];
  locationListing;
  changedApp;
  dateStartFormatted2;
  dateEndFormatted2;
  dateStart;
  dateEnd;
  isFetchingData = false;
  isFetchingData2 = false;
  isFetchingData3 = false;
  isFetchingData4 = false;
  isFetchingData5 = false;
  formData;
  allStatuses = [
    {
      id: 1,
      name: 'Projects wise',
      type: 'project',
      icon: 'icon-gray'
    },
    {
      id: 2,
      name: 'Objectives wise',
      status: 'Unblocked',
      type: 'objective',

      icon: 'text-success'
    },
    {
      id: 3,
      name: 'Activities wise',
      status: 'Blocked',
      type: 'activity',

      icon: 'text-danger'
    },
    {
      id: 4,
      name: 'Tasks wise',
      type: 'task',

      status: 'Blocked',
      icon: 'text-danger'
    },
    {
      id: 5,
      name: 'Employee wise',
      type: 'employee',
      status: 'Blocked',
      icon: 'text-danger'
    }
  ];
  @ViewChildren(DataTableDirective)
  dtElement: QueryList<DataTableDirective>;

  ngOnInit() {
    this.configDatatable();
    this.selectedAppStatus = this.allStatuses[0];
    this.getAll();
    const { Role } = this.authService.getAccessTokenInfo();

    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
  }
  statusSelected(item) {
    this.selectedAppStatus = item;
    this.resetAll();
    if (item.type == 'project') {
      this.getAll(true);
    }
    if (item.type == 'objective') {
      this.getAll2(true);
    }
    console.log('item');
  }
  resetAll() {
    this.isFetchingData = false;
    this.isFetchingData2 = false;
    this.isFetchingData3 = false;
    this.isFetchingData4 = false;
    this.isFetchingData5 = false;
  }
  getAll(flag?, closemodal?) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();
    this.isFetchingData = false;

    this.projectsApi.getProjects().subscribe(
      async data => {
        if (flag) {
          await this.miscHelperService.destroyDataTable(
            'angulardatatable',
            this.dtElement
          );
        }
        const { docs } = data['data'];
        this.result = docs;

        for (const iterator of this.result) {
          iterator.percentage =
            this.miscHelperService.calculateStatusPercentage(
              iterator.objective_detail
            ) + '%';
          iterator.objective_complete = this.miscHelperService.calculateStatusPercentage(
            iterator.objective_detail,
            false
          );
          iterator.activity_complete = this.miscHelperService.calculateStatusPercentage(
            iterator.activity_detail,
            false
          );
          iterator.task_complete = this.miscHelperService.calculateStatusPercentageTasks(
            iterator.task_detail,
            false
          );
          iterator.task_users = this.calculateTaskUsers(iterator.task_detail);
          iterator.objectives_users = this.calculateTaskUsers(
            iterator.objective_detail
          );
          iterator.activity_users = this.calculateTaskUsers(
            iterator.activity_detail
          );
          iterator.task_names = this.returnNamesArray(
            iterator.task_detail,
            'task_name'
          );
          iterator.activity_names = this.returnNamesArray(
            iterator.activity_detail,
            'activity_name'
          );
          iterator.objective_names = this.returnNamesArray(
            iterator.objective_detail,
            'objective_name'
          );
        }
        setTimeout(() => {
          this.dtTrigger.next();
          setTimeout(() => {
            this.isFetchingData = true;
            if (closemodal) {
              this.modalRef.hide();
            }
          }, 250);
        }, 100);
        this.slimScroll.complete();
      },
      error => {
        this.slimScroll.complete();
      }
    );
  }
  getAll2(flag?) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();
    this.isFetchingData2 = false;

    this.objectivesApi.getObjectives().subscribe(
      async data => {
        if (flag) {
          await this.miscHelperService.destroyDataTable(
            'angulardatatable2',
            this.dtElement
          );
        }
        const { docs } = data['data'];
        this.result2 = docs;

        for (const iterator of this.result2) {
          iterator.percentage =
            this.miscHelperService.calculateStatusPercentage(
              iterator.objective_detail
            ) + '%';
          iterator.objective_complete = this.miscHelperService.calculateStatusPercentage(
            iterator.objective_detail,
            false
          );
          iterator.activity_complete = this.miscHelperService.calculateStatusPercentage(
            iterator.activity_detail,
            false
          );
          iterator.task_complete = this.miscHelperService.calculateStatusPercentageTasks(
            iterator.task_detail,
            false
          );
          iterator.task_users = this.calculateTaskUsers(iterator.task_detail);
          iterator.objectives_users = this.calculateTaskUsers(
            iterator.objective_detail
          );
          iterator.activity_users = this.calculateTaskUsers(
            iterator.activity_detail
          );
          iterator.task_names = this.returnNamesArray(
            iterator.task_detail,
            'task_name'
          );
          iterator.activity_names = this.returnNamesArray(
            iterator.activity_detail,
            'activity_name'
          );
          iterator.objective_names = this.returnNamesArray(
            iterator.objective_detail,
            'objective_name'
          );
        }
        setTimeout(() => {
          this.dtTrigger2.next();
          setTimeout(() => {
            this.isFetchingData2 = true;
          }, 250);
        }, 100);
        this.slimScroll.complete();
      },
      error => {
        this.slimScroll.complete();
      }
    );
  }

  returnNamesArray(arr, variable) {
    if (!arr || (arr && arr.length === 0)) {
      return [];
    }
    const names = [];

    for (const iterator of arr) {
      names.push(iterator['' + variable]);
    }

    return names;
  }
  configDatatable() {
    this.dtOptions = {
      paging: true,
      autoWidth: false,
      lengthChange: false,
      searching: true,
      retrieve: true,
      pageLength: 10,
      ordering: true,
      dom: 'Btp',
      // Configure the buttons
      buttons: ['csv', 'excel'],
      // buttons: ['copy', 'print', 'csv', 'excel', 'pdf'],
      columnDefs: [
        {
          targets: 0,
          orderable: false
        },
        {
          targets: 6,
          orderable: false
        },
        {
          targets: 7,
          orderable: false
        }
      ],
      pagingType: 'simple_numbers',
      order: [[0, 'desc']]
    };
    this.dtOptions2 = {
      paging: true,
      autoWidth: false,
      lengthChange: false,
      searching: true,
      retrieve: true,
      pageLength: 10,
      ordering: true,
      dom: 'Btp',
      // Configure the buttons
      buttons: ['csv', 'excel'],
      // buttons: ['copy', 'print', 'csv', 'excel', 'pdf'],
      columnDefs: [
        {
          targets: 0,
          orderable: false
        },
        {
          targets: 6,
          orderable: false
        },
        {
          targets: 7,
          orderable: false
        }
      ],
      pagingType: 'simple_numbers',
      order: [[0, 'desc']]
    };
  }

  calculateTaskUsers(arr) {
    if (!arr || (arr && arr.length === 0)) {
      return 0;
    }
    const names = [];

    for (const iterator of arr) {
      for (const iterator2 of iterator.users_assigned) {
        names.push(iterator2.name);
      }
    }

    const unique = this.getUnique(names);
    return unique;
  }
  getUnique(array) {
    const uniqueArray = [];

    // Loop through array values
    for (const value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    return uniqueArray;
  }
}
