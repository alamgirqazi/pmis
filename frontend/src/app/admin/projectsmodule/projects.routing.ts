import { RouterModule, Routes } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { ProjectsComponent } from './projects.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: []
  }
];

export const ProjectsModuleRoutes: ModuleWithProviders = RouterModule.forChild(
  routes
);
