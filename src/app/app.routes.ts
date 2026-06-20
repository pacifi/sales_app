import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    canActivate: [authGuard],

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/ui/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/product/product.routes').then((m) => m.productRoutes),
      },
      {
        path: 'persons',
        loadChildren: () => import('./features/person/person.routes').then((m) => m.personRoutes),
      },
      {
        path: 'sales',
        loadChildren: () => import('./features/sale/sale.routes').then((m) => m.saleRoutes),
      },
    ],
  },

  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
