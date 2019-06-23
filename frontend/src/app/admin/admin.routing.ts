import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren:
          'app/admin/dashboardmodule/dashboardmodule.module#DashboardmoduleModule'
      },
      // {
      //   path: 'assets',
      //   loadChildren: 'app/admin/assetsmodule/assets.module#AssetsmoduleModule'
      // },
      // {
      //   path: 'supplies',
      //   loadChildren:
      //     'app/admin/inventorymodule/inventory.module#InventorymoduleModule'
      // },
      {
        path: 'users',
        loadChildren: 'app/admin/usersmodule/users.module#UsersmoduleModule'
      },
      {
        path: 'projects',
        loadChildren:
          'app/admin/projectsmodule/projects.module#ProjectsmoduleModule'
      },
      {
        path: 'objectives',
        loadChildren:
          'app/admin/objectivesmodule/objectives.module#ObjectivesmoduleModule'
      },
      {
        path: 'activities',
        loadChildren:
          'app/admin/activitiesmodule/activities.module#ActivitiesmoduleModule'
      },
      {
        path: 'tasks',
        loadChildren: 'app/admin/tasksmodule/tasks.module#TasksmoduleModule'
      },
      {
        path: 'profile',
        loadChildren:
          'app/admin/profilemodule/profile.module#ProfilemoduleModule'
      },
      // {
      //   path: 'reports',
      //   loadChildren:
      //     'app/admin/reportsmodule/reports.module#ReportsmoduleModule'
      // },

      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '/admin/profile' }
    ]
  }
];

export const AdminRoutes: ModuleWithProviders = RouterModule.forChild(routes);
