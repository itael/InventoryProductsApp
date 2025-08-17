import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic routes with parameters - use Server-Side Rendering
  {
    path: 'products/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'products/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'users/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'roles/:id/edit',
    renderMode: RenderMode.Server
  },
  // Static routes - can be prerendered
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'products',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'products/create',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'users',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'users/create',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'roles',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'roles/create',
    renderMode: RenderMode.Prerender
  },
  // Catch-all for other routes
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
