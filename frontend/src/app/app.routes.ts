import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'kunden',
    loadComponent: () => import('./pages/customer-list/customer-list').then((m) => m.CustomerListComponent),
    pathMatch: 'full',
  },
  {
    path: 'kunden/:id',
    loadComponent: () => import('./pages/customer-detail/customer-detail').then((m) => m.CustomerDetailComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
