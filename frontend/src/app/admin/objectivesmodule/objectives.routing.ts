import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { ObjectivesComponent } from './objectives.component';

export const routes: Routes = [
  {
    path: '',
    component: ObjectivesComponent,
    children: []
  }
];

export const ObjectivesModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
