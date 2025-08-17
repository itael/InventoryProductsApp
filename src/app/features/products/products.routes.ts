import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
    // If the file does not exist, create 'product-form.component.ts' in the 'product-form' folder.
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
];
