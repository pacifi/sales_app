import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./ui/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./ui/product-list/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./ui/product-list/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: 'categories',
    loadComponent: () => import('./ui/category-list/category-list').then((m) => m.CategoryList),
  },
];
