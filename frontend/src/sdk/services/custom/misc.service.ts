import { AbstractControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectLike } from 'lodash';

/**
 * Helper Services and Functions
 */
@Injectable()
export class MiscHelperService {
  constructor() {}

  userList = [
    {
      id: 1,
      type: 'Chief Executive Officer'
    },
    {
      id: 2,
      type: 'Chief Operating Officer'
    },
    {
      id: 3,
      type: 'Managers'
    },
    {
      id: 4,
      type: 'Project Managers'
    },
    {
      id: 5,
      type: 'Project Coordinators / Officers'
    }
  ];
  depList = [
    {
      id: 1,
      name: 'Dep 1'
    },
    {
      id: 2,
      name: 'Dep 2'
    }
  ];

  prioritylist = [
    {
      id: 1,
      name: 'low'
    },
    {
      id: 2,
      name: 'medium'
    },
    {
      id: 3,
      name: 'high'
    }
  ];
  severitylist = [
    {
      id: 1,
      name: 'low'
    },
    {
      id: 2,
      name: 'normal'
    },
    {
      id: 3,
      name: 'critical'
    }
  ];

  get userTypeList() {
    return this.userList;
  }
  get departmentList() {
    return this.depList;
  }
  get priorityList() {
    return this.prioritylist;
  }
  get severityList() {
    return this.severitylist;
  }

  async destroyDataTable(tableId, dtElement) {
    dtElement.forEach(async alertInstance => {
      if (alertInstance['el'].nativeElement.id === tableId) {
        if (alertInstance.dtInstance) {
          await alertInstance.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
        }
      }
    });
  }

  calculateStatusPercentage(arr: Array<any>, percentage = true) {
    if (!arr || (arr && arr.length === 0)) {
      return 0;
    }
    let success = 0;
    let total_users = 0;
    for (const iterator of arr) {
      if (iterator.users_assigned) {
        for (const iterator2 of iterator.users_assigned) {
          total_users++;
          if (iterator2.status && iterator2.status === 'complete') {
            success++;
          }
        }
      }
    }

    if (success === 0) {
      return 0;
    } else {
      if (percentage) {
        return Math.round((success / total_users) * 100);
      } else {
        return success;
      }
    }
  }
  calculateStatusPercentageObject(obj: any) {
    if (!obj) {
      return 0;
    }
    let success = 0;
    let total_users = 0;

    for (const iterator2 of obj.users_assigned) {
      total_users++;
      if (iterator2.status && iterator2.status === 'complete') {
        success++;
      }
    }

    if (success === 0) {
      return 0;
    } else {
      return Math.round((success / total_users) * 100);
    }
  }
  calculateStatusPercentageTasks(arr: any, percentage = true) {
    if (!arr) {
      return 0;
    }
    let success = 0;
    let total_users = 0;

    for (const iterator of arr) {
      total_users++;
      console.log('in');
      if (iterator.status && iterator.status === 'complete') {
        console.log('in2');

        success++;
      }
    }

    if (success === 0) {
      return 0;
    }
    if (percentage) {
      return Math.round((success / total_users) * 100);
    } else {
      return success;
    }
  }
  removeSpaces(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  objectToHttpParams(obj: any) {
    return Object.entries(obj || {}).reduce((params, [key, value]) => {
      // if (key == 'search') {
      //   const val = `search[value]`;
      //   return params.set(val, JSON.stringify(value['value']));
      // } else {
      return params.set(
        key,
        isObjectLike(value) ? JSON.stringify(value) : String(value)
      );
      // }
    }, new HttpParams());
  }
}
