import { RouterModule, Routes } from '@angular/router';

import { DashboardmoduleComponent } from './dashboardmodule.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DashboardmoduleComponent
    // children: [
    //   { path: '', redirectTo: 'documents' },
    // ]
  }
];

export const DashboardModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
