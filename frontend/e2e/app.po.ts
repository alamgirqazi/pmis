import { browser, by, element } from 'protractor';
export class AppPage {
  navigateTo() {
    return browser.get('/login');
  }
  getUsernameInput() {
    return element(by.xpath('//*[@id="email"]'));
  }
  getPasswordInput() {
    return element(by.xpath('//*[@id="password"]'));
  }
  getLoginButton(){

    return element(by.xpath('/html/body/app-root/app-login/div/div/div/div/div[2]/form/div[4]/button'));
  }
 getCompaniesTabButton(){
   return element(by.xpath('//*[@id="aside"]/div/div[2]/nav/ul/li[2]'));
 }
getFACompanyButton()
{
  return element(by.xpath('//*[@id="aside-list"]/div[2]/div[2]/div[1]/div[2]/div/a'));
}
getDetailsText(){
  return element(by.xpath('//*[@id="detail"]/div/div/div/app-company-details/div'));
}
getCustomersSubTabButton(){
  return element(by.xpath('//*[@id="detail"]/div/div/div/div/ul/li[2]'));
}
getCustomersList() {
    return element.all(by.css('#customertable > tbody  td'));
  }
getLoadTableButton(){
  return element(by.xpath('//*[@id="customertable"]/thead/tr/th[1]'));
}
getToastMessage(){
  return element(by.className('toast-message'));
}
  // getParagraphText() {
  //   return elefFt(by.css('app-root h1')).getText();
  // }

  // getLoginButton() {
  //   return element(
  //     by.xpath(
  //       '/html/body/app-root/app-login/div/div/div/div/div[2]/form/div[4]/button'
  //     )
  //   );
  // }
  

  // // Menu Page

  // getCategoriesButton() {
  //   return element(
  //     by.xpath(
  //       '//*[@id="list"]/app-sidenav/div/div[2]/div/div/div/div/div/div/div/ul/li[3]/a'
  //     )
  //   );
  // }
  // getModifiersButton() {
  //   return element(
  //     by.xpath(
  //       '//*[@id="list"]/app-sidenav/div/div[2]/div/div/div/div/div/div/div/ul/li[4]/a'
  //     )
  //   );
  // }
  // getMealtimeButton() {
  //   return element(
  //     by.xpath(
  //       '//*[@id="list"]/app-sidenav/div/div[2]/div/div/div/div/div/div/div/ul/li[5]/a'
  //     )
  //   );
  // }

  // // Settings

  // getRestaurantInfoButton() {
  //   return element(
  //     by.xpath(
  //       '//*[@id="list"]/app-settingsleftnav/div/div[2]/div/div/div/div/div/div/div/ul/li[2]/a'
  //     )
  //   );
  // }
  // getRestaurantBankAccountsButton() {
  //   return element(
  //     by.xpath(
  //       '//*[@id="list"]/app-settingsleftnav/div/div[2]/div/div/div/div/div/div/div/ul/li[3]/a'
  //     )
  //   );
  // }
  // // Main Page

  // getDashboardSettingsButton() {
  //   return element(by.xpath('//*[@id="aside"]/div/div[3]/div/a/div[1]/div'));
  // }
  // getDashboardPersonalSettingsButton() {
  //   return element(by.xpath('//*[@id="aside"]/div/div[3]/div/div/a[1]'));
  // }
  // getDashboardLogoutButton() {
  //   return element(
  //     by.xpath('//*[@id="aside"]/div/div[3]/div/div/ul/li[2]/a/i')
  //   );
  // }
  // getDashboardOrderButton() {
  //   return element(by.xpath('//*[@id="aside"]/div/div[2]/nav/ul/li[2]/a'));
  // }
  // getDashboardCustomersButton() {
  //   return element(by.xpath('//*[@id="aside"]/div/div[2]/nav/ul/li[6]/a'));
  // }
  // getDashboardEmployeesButton() {
  //   return element(by.xpath('//*[@id="aside"]/div/div[2]/nav/ul/li[4]/a'));
  // }
  // getDashboardPromotionsButton() {
  //   return element(by.xpath('//*[@id="aside"]/div/div[2]/nav/ul/li[7]/a'));
  // }

  // getOrdersList() {
  //   return element.all(by.css('body app-orders table tbody tr'));
  // }
  // getMenusList() {
  //   return element.all(by.css('body app-items table tbody tr'));
  // }
  // getEmployeesList() {
  //   return element.all(by.css('body app-employeesmodule table tbody tr'));
  // }
  // getCustomersList() {
  //   return element.all(by.css('body app-customersmodule table tbody tr'));
  // }
  // getPromotionsList() {
  //   return element.all(by.css('body app-promotionsmodule table tbody tr'));
  // }
  // getCategoriesList() {
  //   return element.all(by.css('body app-categories table tbody tr'));
  // }
  // getModifiersList() {
  //   return element.all(by.css('body app-modifiers table tbody tr'));
  // }
  // getMealTimeList() {
  //   return element.all(by.css('body app-mealtime table tbody tr'));
  // }
}
