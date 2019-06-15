import { browser, by, element, protractor } from 'protractor';

import { AppPage } from './app.po';
import { XHRConnection } from '@angular/http';
import { async } from 'rxjs/scheduler/async';
import { first } from 'rxjs/operator/first';

describe('Quick Angular Admin Page', () => {
  let page: AppPage;

  // beforeEach(() => {
  //   page = new AppPage();
  // });

  beforeAll(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display correct title', function() {
    browser.driver
      .manage()
      .window()
      .maximize();
    expect(browser.getTitle()).toEqual('Quickpay');
  });

  afterAll(() => {
    console.log('all Done');
    browser.sleep(1000);
  });
});
