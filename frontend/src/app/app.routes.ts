import { Routes } from '@angular/router';
import {authGuard} from "./shared/guard/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./core/no-found/no-found.component').then(m => m.NoFoundComponent)
  }
];
