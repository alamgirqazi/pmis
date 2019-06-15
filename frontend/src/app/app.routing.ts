import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { RedirectLoginGuard } from './guard/redirectlogin.service';
import { isLoginGuard } from './guard/islogin.service';

const routes: Routes = <Routes>[
  {
    path: 'admin',
    canActivate: [isLoginGuard],
    loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectLoginGuard]
  },

  { path: '**', redirectTo: '/admin/users' }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes);
