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
import { ProjectsApi } from '../../../sdk/services/custom/projects.service';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  constructor(
    private slimScroll: SlimLoadingBarService,
    private authService: AuthService,
    private http: HttpClient,
    private miscHelperService: MiscHelperService,
    private excelService: ExcelService,
    private projectsApi: ProjectsApi,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private router: Router,
    private _asideNavigationService: AsideNavigationService
  ) {
    this.toasterService = toasterService;
  }
  items;
  treeData;
  selectedProject;
  // items: TreeviewItem[];
  title;
  selectedAppStatus: any = null;
  allStatuses;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  tabList = [false, false, false];
  navOpened;
  result = [];
  attachments = [];
  displayattachments = [];
  hiddenTblresult = [];
  showTempTable = false;
  tabId = 1;
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
  // @TODO
  ngOnInit() {
    const { role } = this.authService.getAccessTokenInfo();
    if (role.includes('Chief')) {
    } else {
      this.router.navigate(['/admin/profile']);
    }

    // if (role != 'Chief Executive Officer' || role != 'Chief Operating Officer') {
    //   this.router.navigate(['/admin/objectives']);
    // }
    this.role = role;

    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
      // console.log('message: ', message);
      // console.log('this.navOpened: ', this.navOpened);
    });
  }

  onSelectedChange(e) {
    console.log('e');
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
        let filter = this.selectedLocation;
        let category_filter = this.selectedCategory;
        if (this.selectedLocation == 'All') {
          filter = '';
        }
        if (this.selectedCategory == 'All') {
          category_filter = '';
        }
        dataTablesParameters.location_filter = filter;
        dataTablesParameters.category_filter = category_filter;
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
            const { docs, limit, total, offset } = resp['data'];
            this.result = docs;

            for (const iterator of this.result) {
              iterator.percentage = this.miscHelperService.calculateStatusPercentage(
                iterator.objective_detail
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

  openConfirmationTab(template: TemplateRef<any>, data, mystatus?, msgstatus?) {
    this.msgstatus = msgstatus;
    this.mystatus = mystatus;
    this.changedApp = data;
    this.modalRef = this.modalService.show(template, { class: 'modal-xs' });
  }

  openAttachments(template: TemplateRef<any>, data) {
    this.formData = data;
    this.formData['project_id'] = data._id;
    // let find other attachments

    let attachments = [];

    if (data.objective_detail) {
      for (const iterator of data.objective_detail) {
        attachments = attachments.concat(iterator.attachments);
      }
    }
    if (data.activity_detail) {
      for (const iterator of data.activity_detail) {
        attachments = attachments.concat(iterator.attachments);
      }
    }
    if (data.task_detail) {
      for (const iterator of data.task_detail) {
        attachments = attachments.concat(iterator.attachments);
      }
    }

    if (data.attachments === null) {
      data.attachments = [];
    }
    this.attachments = [...data.attachments];
    this.displayattachments = [...data.attachments, ...attachments];

    this.title = `Project: ${this.formData.name}`;
    this.modalRef = this.modalService.show(template, { class: 'modal-xlg' });
  }

  openModal(template: TemplateRef<any>, data, newInstance, tabId) {
    this.tabId = tabId;
    console.log('data', data);
    this.newInstance = newInstance;
    this.formData = data;
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-xlg'
    };
    this.modalRef = this.modalService.show(template, config);
  }
  openTreeModal(template: TemplateRef<any>, data) {
    this.selectedProject = data;
    const config = {
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'gray modal-xlg'
    };
    this.projectsApi.getProjectDetail(data._id).subscribe(
      async response => {
        console.log('response', response);
        this.modalRef = this.modalService.show(template, config);
        this.treeData = response.data;

        for (const iterator of this.treeData) {
          iterator.percentage = this.miscHelperService.calculateStatusPercentageObject(
            iterator
          );
        }
        this.slimScroll.complete();
      },
      error => {
        console.log('error', error);
        this.slimScroll.complete();
      }
    );
  }
  closeModal() {
    this.modalRef.hide();
  }
  updateAppStatus(status, data) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();

    const displayMsg = `${data.name} is now ${status}`;

    this.projectsApi.updateProjectsStatus(data._id, { status }).subscribe(
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
