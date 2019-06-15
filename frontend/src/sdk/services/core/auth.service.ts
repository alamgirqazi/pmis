import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import * as decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor() {}

  public getAccessTokenId() {
    const token = localStorage.getItem('token');
    return token;
  }
  public getAccessTokenInfo() {
    const access_token = localStorage.getItem('token');
    const { data } = decode(access_token);
    return data;
  }

  /**
   * Clear token and other user releated data.
   */

  public clearToken() {
    localStorage.removeItem('token');
  }
}
