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

  allStatuses;
  dtOptions = {};
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  tabList = [false, false, false];
  navOpened;
  result;
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
  formData;
  @ViewChildren(DataTableDirective)
  dtElement: QueryList<DataTableDirective>;

  ngOnInit() {
    this.configDatatable();
    this.getAll();
    const { Role } = this.authService.getAccessTokenInfo();

    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
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
      ignoreBackdropClick: true
      // class: 'gray modal-lg'
    };
    this.modalRef = this.modalService.show(template, config);
  }

  generateAssetsBackup() {
    // this.assetsApi.getAssetsEverything().subscribe(
    //   async response => {
    //     console.log('response->', response);
    //     setTimeout(() => {
    //       this.exportExcel(response.data);
    //     }, 1000);
    //     this.slimScroll.complete();
    //   },
    //   error => {
    //     console.log('error', error);
    //     // this.modalRef.hide();
    //     this.slimScroll.complete();
    //   }
    // );
  }

  returnMonthsDifference(d1, d2, bothmonths = false) {
    const date1 = new Date(d1); //Remember, months are 0 based in JS
    const date2 = new Date(d2);
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    let month1 = date1.getMonth();
    let month2 = date2.getMonth();
    if (month1 === 0) {
      //Have to take into account
      month1++;
      month2++;
    }
    let numberOfMonths;

    // 1.If you want just the number of the months between the two dates excluding both month1 and month2

    // numberOfMonths = (year2 - year1) * 12 + (month2 - month1) - 1;

    // 2.If you want to include either of the months
    if (!bothmonths) {
      numberOfMonths = (year2 - year1) * 12 + (month2 - month1);
    }

    // 3.If you want to include both of the months
    if (bothmonths) {
      numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;
    }
    // numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;

    return numberOfMonths;
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
      pageLength: 25,
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

  decline() {
    this.modalRef.hide();
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
    var uniqueArray = [];

    // Loop through array values
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    return uniqueArray;
  }

  get returnTodayDate() {
    return new Date(Date.now());
  }

  outputAndReload() {
    // this.configDatatable(true);

    this.modalRef.hide();
  }
  exportExcel(data?, msg?) {
    // if (data) {
    //   this.excelService.exportAsExcelFile(data, 'assets');
    // } else {
    //   const mydata = JSON.parse(JSON.stringify(this.result));
    //   mydata.forEach(element => {
    //     delete element.is_deleted;
    //     delete element._id;
    //     delete element.__v;
    //   });
    // let no</any>wdate = new Date(Date.now());
    const nowdate = moment().format('LLLL'); // "Invalid date"

    let text;
    if (msg) {
      text = `assets-report-${nowdate}`;
    } else {
    }
    text = `assets-backup-${nowdate}`;
    this.excelService.exportAsExcelFile(data, text);
  }
}
