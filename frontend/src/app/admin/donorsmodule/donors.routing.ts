import { RouterModule, Routes } from '@angular/router';

import { DonorsComponent } from './donors.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DonorsComponent,
    children: []
  }
];

export const DonorsModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
