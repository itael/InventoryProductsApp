import { Routes } from '@angular/router';

export const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../permissions/permission-list/permission-list.component').then(m => m.PermissionListComponent)
  }
];
