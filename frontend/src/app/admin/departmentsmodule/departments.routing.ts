import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { DepartmentsComponent } from './departments.component';

export const routes: Routes = [
  {
    path: '',
    component: DepartmentsComponent,
    children: []
  }
];

export const DepartmentsModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
