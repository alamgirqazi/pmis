// import '../../../mainassets/plugins/datatables/css/dataTables.bootstrap.css';

import * as FileSaver from 'file-saver';
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
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import { UserApi } from '../../../sdk/services/custom/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private router: Router,
    private http: HttpClient,
    private userApi: UserApi,
    private excelService: ExcelService,
    private miscHelperService: MiscHelperService,
    private authService: AuthService,
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

  changedApp;
  isFetchingData = false;
  formData;
  @ViewChildren(DataTableDirective)
  dtElement: QueryList<DataTableDirective>;
  userList = [];
  ngOnInit() {
    this.configDatatable();
    this.userList = this.miscHelperService.userList;
    const { role } = this.authService.getAccessTokenInfo();
    if (role != 'Chief Executive Officer') {
      this.router.navigate(['/admin/projects']);
    }
    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
  }
  ngAfterViewInit() {
    this.configDatatable();
  }

  isLater(str1, str2) {
    return new Date(str1) > new Date(str2);
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

  updateAppStatus() {
    this.slimScroll.progress = 20;
    this.slimScroll.start();
    const status = {
      status: this.mystatus
    };
    const displayMsg = `${this.changedApp.name} is now ${this.mystatus}`;

    this.userApi.updateUser(this.changedApp._id, status).subscribe(
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
      lengthMenu: [10, 50],
      // dom: 'Btp',
      // buttons: ['csv', 'excel'],

      ajax: (dataTablesParameters: any, callback) => {
        // let filter = this.selectedLocation;
        // if (this.selectedLocation == 'All') {
        //   filter = '';
        // }
        // dataTablesParameters.location_filter = filter;
        const params = this.miscHelperService.objectToHttpParams(
          dataTablesParameters
        );
        const url = Baseconfig.getPath() + `/users`;

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
            this.result.forEach(element => {
              if (element.avatar) {
                element.src =
                  Baseconfig.getPath() +
                  '/' +
                  element.avatar +
                  element.avatar_ext;
              }
            });
            setTimeout(() => {
              this.dtTrigger.next();
              setTimeout(() => {
                this.slimScroll.complete();
                this.isFetchingData = true;
              }, 50);
            });

            callback({
              recordsTotal: total,
              recordsFiltered: total,
              data: []
            });
          });
      }
    };
  }
  decline() {
    this.modalRef.hide();
  }

  outputAndReload() {
    this.configDatatable(true);

    this.modalRef.hide();
  }

  deleteApplication() {
    const displayMsg = `${this.changedApp.Name} has been removed successfully`;

    this.userApi.deleteUser(this.changedApp._id).subscribe(
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
