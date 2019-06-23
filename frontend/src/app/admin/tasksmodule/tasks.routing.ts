import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import {TasksComponent } from './tasks.component';

export const routes: Routes = [
  {
    path: '',
    component:TasksComponent,
    children: []
  }
];

export const TasksModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
