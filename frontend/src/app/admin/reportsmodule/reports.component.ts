import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ActivitiesApi } from './../../../sdk/services/custom/activities.service';
import { AsideNavigationService } from '../../services/asideNavigation.Service';
import { AuthService } from '../../../sdk/services/core/auth.service';
import { DataTableDirective } from 'angular-datatables';
import { MiscHelperService } from '../../../sdk/services/custom/misc.service';
import { ObjectivesApi } from './../../../sdk/services/custom/objectives.service';
import { ProjectsApi } from './../../../sdk/services/custom/projects.service';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject } from 'rxjs/Subject';
import { TasksApi } from './../../../sdk/services/custom/tasks.service';
import { UserApi } from './../../../sdk/services/custom/user.service';
import { ar } from 'ngx-bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(
    private slimScroll: SlimLoadingBarService,

    private projectsApi: ProjectsApi,
    private objectivesApi: ObjectivesApi,
    private activitiesApi: ActivitiesApi,
    private userApi: UserApi,
    private miscHelperService: MiscHelperService,
    private authService: AuthService,
    private tasksApi: TasksApi,
    private router: Router,
    private _asideNavigationService: AsideNavigationService
  ) {}
  selectedAppStatus: any = null;
  hiddenTblresult = [];

  dateEndFormatted;
  dateStartFormatted;
  showTempTable = false;

  dtOptions = {};
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
  result3;
  result4;
  result5;
  role = 'User';

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
    const { role } = this.authService.getAccessTokenInfo();
    if (role === 'Chief Executive Officer') {
    } else {
      this.router.navigate(['/admin/profile']);
    }
    this._asideNavigationService.currentMessage.subscribe(message => {
      this.navOpened = message;
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
    if (item.type == 'activity') {
      this.getAll3(true);
    }
    if (item.type == 'task') {
      this.getAll4(true);
    }
    if (item.type == 'employee') {
      this.getAll5(true);
    }
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
              iterator.activity_detail
            ) + '%';

          iterator.activity_complete = this.miscHelperService.calculateStatusPercentage(
            iterator.activity_detail,
            false
          );
          iterator.task_complete = this.miscHelperService.calculateStatusPercentageTasks(
            iterator.task_detail,
            false
          );
          iterator.task_users = this.calculateTaskUsers(iterator.task_detail);
          const arr = [iterator];
          iterator.objectives_users = this.calculateTaskUsers(arr);
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

  // Activity
  getAll3(flag?) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();
    this.isFetchingData3 = false;

    this.activitiesApi.getActivities().subscribe(
      async data => {
        if (flag) {
          await this.miscHelperService.destroyDataTable(
            'angulardatatable3',
            this.dtElement
          );
        }
        const { docs } = data['data'];
        this.result3 = docs;

        for (const iterator of this.result3) {
          iterator.percentage =
            this.miscHelperService.calculateStatusPercentageTasks(
              iterator.task_detail
            ) + '%';

          iterator.task_complete = this.miscHelperService.calculateStatusPercentageTasks(
            iterator.task_detail,
            false
          );
          iterator.task_users = this.calculateTaskUsers(iterator.task_detail);
          const arr = [iterator];

          iterator.activity_users = this.calculateTaskUsers(arr);
          iterator.task_names = this.returnNamesArray(
            iterator.task_detail,
            'task_name'
          );
        }

        setTimeout(() => {
          this.dtTrigger3.next();
          setTimeout(() => {
            this.isFetchingData3 = true;
          }, 250);
        }, 100);
        this.slimScroll.complete();
      },
      error => {
        this.slimScroll.complete();
      }
    );
  }

  // Task
  getAll4(flag?) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();
    this.isFetchingData4 = false;

    this.tasksApi.getTasks().subscribe(
      async data => {
        if (flag) {
          await this.miscHelperService.destroyDataTable(
            'angulardatatable4',
            this.dtElement
          );
        }
        const { docs } = data['data'];
        this.result4 = docs;

        for (const iterator of this.result4) {
          iterator.percentage = '0%';
          if (iterator.status === 'complete') {
            iterator.percentage = '100%';
          }

          const arr = [iterator];
          iterator.task_users = this.calculateTaskUsers(arr);
        }

        setTimeout(() => {
          this.dtTrigger4.next();
          setTimeout(() => {
            this.isFetchingData4 = true;
          }, 250);
        }, 100);
        this.slimScroll.complete();
      },
      error => {
        this.slimScroll.complete();
      }
    );
  }
  // Employee
  getAll5(flag?) {
    this.slimScroll.progress = 20;
    this.slimScroll.start();
    this.isFetchingData5 = false;

    this.userApi.getUsersStatistics().subscribe(
      async data => {
        if (flag) {
          await this.miscHelperService.destroyDataTable(
            'angulardatatable5',
            this.dtElement
          );
        }
        this.result5 = data.data['docs'];

        for (const iterator of this.result5) {
          iterator.objectives_complete = this.checkIfUserCompleted(
            iterator.objectives,
            iterator._id
          );
          iterator.activities_complete = this.checkIfUserCompleted(
            iterator.activities,
            iterator._id
          );
          iterator.tasks_complete = this.checkIfUserCompletedTasks(
            iterator.tasks
          );
        }

        setTimeout(() => {
          this.dtTrigger5.next();
          setTimeout(() => {
            this.isFetchingData5 = true;
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
      // paging: true,
      // autoWidth: true,
      // lengthChange: false,
      // searching: true,
      // retrieve: true,
      pageLength: 10,
      searching: true,
      ordering: true,
      dom: 'Bftp',
      // Configure the buttons
      buttons: ['csv', 'excel'],
      // buttons: ['copy', 'print', 'csv', 'excel', 'pdf'],
      // columnDefs: [
      //   {
      //     targets: 0,
      //     orderable: false
      //   },
      //   {
      //     targets: 6,
      //     orderable: false
      //   },
      //   {
      //     targets: 7,
      //     orderable: false
      //   }
      // ],
      pagingType: 'simple_numbers'
      // order: [[0, 'desc']]
    };
  }

  checkIfUserCompleted(arr, user_id) {
    if (!arr || arr.length === 0) {
      return 0;
    }
    let success = 0;
    for (const iterator of arr) {
      const found = iterator.users_assigned.find(function(element) {
        return element._id === user_id;
      });
      if (found.status == 'complete') {
        success++;
      }
    }
    return success;
  }
  checkIfUserCompletedTasks(arr) {
    if (!arr || arr.length === 0) {
      return 0;
    }
    let success = 0;
    for (const iterator of arr) {
      if (iterator.status == 'complete') {
        success++;
      }
    }
    return success;
  }

  calculateTaskUsers(arr) {
    if (!arr || (arr && arr.length === 0)) {
      return 0;
    }
    const names = [];

    for (const iterator of arr) {
      if (iterator.users_assigned) {
        for (const iterator2 of iterator.users_assigned) {
          names.push(iterator2.name);
        }
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
