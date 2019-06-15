import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  config1: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    showCloseButton: true,
    animation: 'flyRight',
    mouseoverTimerStop: true,
    timeout: 4000
  });

  constructor(private router: Router, private ngProgress: NgProgress) {
    // Progress bar show on navigation
    // router.events
    //   .filter(event => event instanceof NavigationStart)
    //   .subscribe(() => ngProgress.start());
    // router.events
    //   .filter(event => event instanceof NavigationEnd)
    //   .subscribe(() => ngProgress.done());
  }
}
