import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { NavService } from '../services/testing';
import { Subscription } from 'rxjs/Subscription';

// import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// import { ToasterService } from 'angular2-toaster';
(<any>window).pdfWorkerSrc = 'assets/pdf.worker.js';

@Component({
  providers: [NavService],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  isexpand: boolean = false;
  issimpleView: boolean;
  subscription: Subscription;
  constructor(
    private _navService: NavService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this._navService.navItem$.subscribe(item => {
      this.issimpleView = item;
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    this._navService.changeNav(false);
    this.subscription.unsubscribe();
  }

  toggleclass() {
    this.isexpand = !this.isexpand;
  }
}
