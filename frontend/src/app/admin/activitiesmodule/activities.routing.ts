import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { ActivitiesComponent } from './activities.component';

export const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
    children: []
  }
];

export const ActivitiesModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
