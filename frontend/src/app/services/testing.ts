import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class NavService {
  private _navItemSource = new BehaviorSubject(false);
  private _viewSwitch = new BehaviorSubject('simple');

  navItem$ = this._navItemSource.asObservable();
  viewTool$ = this._viewSwitch.asObservable();

  changeNav(state) {
    this._navItemSource.next(state);
    console.log('changeNav');
  }

  changeView(state) {
    this._viewSwitch.next(state);
  }
}
