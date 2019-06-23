import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import {ProfileComponent } from './profile.component';

export const routes: Routes = [
  {
    path: '',
    component:ProfileComponent,
    children: []
  }
];

export const ProfileModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
