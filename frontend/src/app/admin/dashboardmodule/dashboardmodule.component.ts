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
import { AuthService } from '../../../sdk/services/core/auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { StatisticsApi } from './../../../sdk/services/custom/statistics.service';
import { chart } from 'highcharts';

// import { StatisticsApi } from '../../../sdk/services/custom/statistics.service';

declare var EasyPieChart: any;

@Component({
  selector: 'app-dashboardmodule',
  templateUrl: './dashboardmodule.component.html',
  styleUrls: ['./dashboardmodule.component.css']
})
export class DashboardmoduleComponent implements OnInit, AfterViewInit {
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
  @ViewChild('chartTarget')
  chartTarget: ElementRef;
  @ViewChild('chartTargetObjectives')
  chartTargetObjectives: ElementRef;
  @ViewChild('chartTargetActivities')
  chartTargetActivities: ElementRef;
  @ViewChild('chartTargetUsers')
  chartTargetUsers: ElementRef;
  @ViewChild('chartTargetTasks')
  chartTargetTasks: ElementRef;
  chartOptions = {
    chart: {
      style: {
        fontFamily: "'Roboto', sans-serif"
      }
    }
  };

  _chartObjectives: Highcharts.ChartObject;
  _chartActivities: Highcharts.ChartObject;
  _chartTasks: Highcharts.ChartObject;
  _chartUsers: Highcharts.ChartObject;
  _chart: Highcharts.ChartObject;
  ngOnInit() {
    const { role } = this.authService.getAccessTokenInfo();
    if (role === 'Chief Executive Officer') {
    } else {
      this.router.navigate(['/admin/profile']);
    }
    // if (Role == 'User') {
    //   this.router.navigate(['/admin/assets']);
    // }
    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
    });
  }
  getAll() {
    // this.slimScroll.progress = 20;
    // this.slimScroll.start();
    this.getAllProjectStatistics();
    this.getAllUsersStatistics();
  }

  ngAfterViewInit(): void {
    this.setUpCharts();
    this.getAll();
  }
  getAllProjectStatistics() {
    this.statisticsApi.getAllStatistics().subscribe(
      async data => {
        console.log('data', data);
        const { projects, objectives, activities, tasks } = data.data;
        // const hiChartProjects = [];
        const hiChartProjects = [
          {
            name: 'Complete Projects',
            y: projects.complete,
            sliced: true,
            selected: true
          },
          {
            name: 'Incomplete Projects',
            y: projects.incomplete
          }
        ];
        const hiChartObjectives = [
          {
            name: 'Complete Objectives',
            y: objectives.complete,
            sliced: true,
            selected: true
          },
          {
            name: 'Incomplete Objectives',
            y: objectives.incomplete
          }
        ];
        const hiChartActivities = [
          {
            name: 'Complete Activities',
            y: activities.complete,
            sliced: true,
            selected: true
          },
          {
            name: 'Incomplete Activities',
            y: activities.incomplete
          }
        ];
        const hiChartTasks = [
          {
            name: 'Complete Tasks',
            y: tasks.complete,
            sliced: true,
            selected: true
          },
          {
            name: 'Incomplete Tasks',
            y: tasks.incomplete
          }
        ];

        this._chart.series[0].setData(hiChartProjects);
        this._chartObjectives.series[0].setData(hiChartObjectives);
        this._chartActivities.series[0].setData(hiChartActivities);
        this._chartTasks.series[0].setData(hiChartTasks);
        this.slimScroll.complete();
      },
      error => {
        this.slimScroll.complete();
      }
    );
  }
  getAllUsersStatistics() {
    this.statisticsApi.getAllUsersStatistics().subscribe(
      async data => {
        console.log('data', data);
        const { users } = data.data;
        // const hiChartProjects = [];
        const hiChartData = [
          {
            name: 'Chief Executive Officer',
            y: users.ed,
            sliced: true,
            selected: true
          },
          {
            name: 'Chief Operating Officer',
            y: users.md
          },
          {
            name: 'Managers',
            y: users.pm
          },
          {
            name: 'Project Managers',
            y: users.pc
          },
          {
            name: 'Project Coordinators / Officers',
            y: users['Project Coordinators / Officers']
          }
        ];

        this._chartUsers.series[0].setData(hiChartData);

        this.slimScroll.complete();
      },
      error => {
        this.slimScroll.complete();
      }
    );
  }

  setUpCharts() {
    const options3 = {
      // colors: ['#F44336', '#25cc45'],
      chart: {
        style: {
          fontFamily: "'Roboto', sans-serif"
        },
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        margin: [40, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: -30,
            lang: {
              decimalPoint: '.',
              thousandsSep: ','
            },
            format: '{point.y:,.0f}',
            style: {
              color: 'white',
              textShadow: false,
              textOutline: false
            }
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        align: 'center',
        verticalAlign: 'top'
      },
      exporting: {
        enabled: false
      },
      series: [
        {
          name: 'Total',
          colorByPoint: true,
          data: []
        }
      ]
    };
    this._chart = chart(this.chartTarget.nativeElement, options3);
    this._chartObjectives = chart(
      this.chartTargetObjectives.nativeElement,
      options3
    );
    this._chartActivities = chart(
      this.chartTargetActivities.nativeElement,
      options3
    );
    this._chartTasks = chart(this.chartTargetTasks.nativeElement, options3);
    this._chartUsers = chart(this.chartTargetUsers.nativeElement, options3);
  }
}
