import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./features/roles/roles.routes').then(m => m.ROLE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then(m => m.USER_ROUTES),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'permissions',
  //   loadChildren: () => import('./features/permissions/permissions.routes').then(m => m.PERMISSION_ROUTES),
  //   canActivate: [AuthGuard]
  // },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
