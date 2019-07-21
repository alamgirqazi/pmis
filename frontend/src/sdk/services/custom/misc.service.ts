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
      type: 'Executive Director'
    },
    {
      id: 2,
      type: 'Managing Director'
    },
    {
      id: 3,
      type: 'Project Manager'
    },
    {
      id: 4,
      type: 'Project Coordinator'
    },
    {
      id: 5,
      type: 'Official'
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
