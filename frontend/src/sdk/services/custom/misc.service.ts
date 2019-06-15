import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectLike } from 'lodash';
import { AbstractControl } from '@angular/forms';

/**
 * Helper Services and Functions
 */
@Injectable()
export class MiscHelperService {
  constructor() {}

  userList =[
    {
      id:1,
      type: 'Admin'
    },
    {
      id:2,
      type: 'Executive Director'
    },{
      id:3,
      type: 'Manager'
    },{
      id:4,
      type: 'Project Coordinator'
    },{
      id:5,
      type: 'Project Manager'
    },{
      id:6,
      type: 'Official'
    },

  ]

  get userTypeList(){
    return this.userList;
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
