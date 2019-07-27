// import '../../../mainassets/plugins/datatables/css/dataTables.bootstrap.css';

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
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private router: Router,
    private http: HttpClient,
    private excelService: ExcelService,
    private daterangepickerOptions: DaterangepickerConfig,
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
  dtOptions: DataTables.Settings = {};
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
    const { Role } = this.authService.getAccessTokenInfo();

    this.dateStart = moment().subtract(12, 'months');
    this.dateEnd = moment();
    this.setDates();

    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
  }
  ngAfterViewInit() {
    this.setDates();
    this.configDatatable();
  }
  changedListing(list) {
    this.selectedLocation = list.name;
    this.configDatatable(true);
  }
  changedCategoryListing(list) {
    this.selectedCategory = list.name;
    this.configDatatable(true);
  }
  changedDisposedListing(list) {
    this.selectedDisposed = list;
    this.configDatatable(true);
  }
  isLater(str1, str2) {
    return new Date(str1) > new Date(str2);
  }
  setDates() {
    this.dateStartFormatted = this.dateStart.format('YYYY-MM-DD');

    this.dateStartFormatted2 = moment(this.dateStartFormatted).format(
      'DD-MM-YYYY'
    );
    // this.dateStartFormatted = this.dateStart.format('DD-MM-YYYY');
    this.dateEndFormatted = this.dateEnd.format('YYYY-MM-DD');
    this.dateEndFormatted2 = moment(this.dateEndFormatted).format('DD-MM-YYYY');
    // this.dateEndFormatted = this.dateEnd.format('DD-MM-YYYY');
  }
  selectedDate(value: any) {
    this.dateStart = value.start;
    this.dateEnd = value.end;
    this.setDates();
    // this.getAll(true);
    this.configDatatable(true);
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

  calcDateDiff(d1) {
    const b = moment(d1);
    const a = moment(Date.now());
    const years = a.diff(b, 'year');
    b.add(years, 'years');

    const months = a.diff(b, 'months');
    b.add(months, 'months');

    const days = a.diff(b, 'days');

    // console.log(years + ' years ' + months + ' months ' + days + ' days');
    if (years > 0) {
      return `${years} years, ${months} months,  ${days} days`;
    } else if (months > 0) {
      return `${months} months,  ${days} days`;
    } else {
      return `${days} days`;
    }
  }
  calcDateDiffObj(d1) {
    const b = moment(d1);
    const a = moment(Date.now());
    const years = a.diff(b, 'year');
    b.add(years, 'years');

    const months = a.diff(b, 'months');
    b.add(months, 'months');

    const days = a.diff(b, 'days');

    // console.log(years + ' years ' + months + ' months ' + days + ' days');
    return { years, months, days };
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
      lengthMenu: [10, 50, 100, 200, 500],
      // dom: 'Btp',
      // buttons: ['csv', 'excel'],

      ajax: (dataTablesParameters: any, callback) => {
        const params = this.miscHelperService.objectToHttpParams(
          dataTablesParameters
        );
        const url = Baseconfig.getPath() + `/projects`;

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
            const { docs } = resp['data'];
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
              iterator.task_users = this.calculateTaskUsers(
                iterator.task_detail
              );
              iterator.objectives_users = this.calculateTaskUsers(
                iterator.objective_detail
              );
              iterator.activity_users = this.calculateTaskUsers(
                iterator.activity_detail
              );
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
  decline() {
    this.modalRef.hide();
  }

  genPDF() {
    this.showTempTable = true;
    this.hiddenTblresult = this.result;

    setTimeout(() => {
      this.genPdf();
      this.showTempTable = false;
    }, 1000);
  }

  genPdf() {
    var data = document.getElementById('secrettable');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Assets-report.pdf'); // Generated PDF
      // this.showTempTable = false;
    });
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
    this.configDatatable(true);

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
