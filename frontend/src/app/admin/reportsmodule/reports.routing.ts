import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { ReportsComponent } from './reports.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: []
  }
];

export const ReportsModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
