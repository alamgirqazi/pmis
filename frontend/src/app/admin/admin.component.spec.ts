// import {
//   BrowserXhr,
//   Http,
//   HttpModule,
//   RequestOptions,
//   XHRBackend
// } from '@angular/http';
// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {
//   InternalStorage,
//   JSONSearchParams,
//   LoopBackAuth,
//   SDKModels
// } from '../../sdk';
// import { ToasterModule, ToasterService } from 'angular2-toaster';

// import { AdminComponent } from './admin.component';
// import { CategoryApi } from '../../sdk/services/custom/Category';
// import { EmployeeApi } from '../../sdk/services/custom/Employee';
// import { Globals } from '../shared/globals';
// import { LeftsidemenuComponent } from './leftsidemenu/leftsidemenu.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import { SidebarService } from '../shared/sidebar.service';
// import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

// describe('AdminComponent', () => {
//   let component: AdminComponent;
//   let fixture: ComponentFixture<AdminComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [AdminComponent, LeftsidemenuComponent],
//       imports: [
//         RouterTestingModule,
//         SlimLoadingBarModule.forRoot(),
//         FormsModule,
//         HttpModule,
//         ReactiveFormsModule
//       ],
//       providers: [
//         Globals,
//         CategoryApi,
//         EmployeeApi,
//         SDKModels,
//         LoopBackAuth,
//         ToasterService,
//         InternalStorage,
//         JSONSearchParams,
//         SidebarService
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AdminComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('Expand should work correctly for Nav', () => {
//     expect(component).toBeTruthy();
//     expect(component.isexpand).toBeFalsy();
//     component.toggleclass();
//     console.log('should be true', component.isexpand);
//     expect(component.isexpand).toBeTruthy();
//   });
// });
