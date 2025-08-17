import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Use Server-Side Rendering for all routes to avoid prerendering issues
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
