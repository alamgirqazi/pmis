import { StatisticsApi } from './../../../sdk/services/custom/statistics.service';
import * as Highcharts from 'highcharts';

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  isDevMode
} from '@angular/core';

import { AsideNavigationService } from '../../services/asideNavigation.Service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
// import { StatisticsApi } from '../../../sdk/services/custom/statistics.service';
import { chart } from 'highcharts';
import { AuthService } from '../../../sdk/services/core/auth.service';
import { Router } from '@angular/router';
import { element } from 'protractor';

declare var EasyPieChart: any;

@Component({
  selector: 'app-dashboardmodule',
  templateUrl: './dashboardmodule.component.html',
  styleUrls: ['./dashboardmodule.component.css']
})
export class DashboardmoduleComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    private slimScroll: SlimLoadingBarService,
    private authService: AuthService,
    private statisticsApi: StatisticsApi,
    private router: Router,
    private _asideNavigationService: AsideNavigationService
  ) {}
  modalRef: BsModalRef;
  tabId;
  Applications;
  Ips;
  navOpened;

  ngOnInit() {
    const { role } = this.authService.getAccessTokenInfo();
    // if (Role == 'User') {
    //   this.router.navigate(['/admin/assets']);
    // }
    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
    });
  }
}
