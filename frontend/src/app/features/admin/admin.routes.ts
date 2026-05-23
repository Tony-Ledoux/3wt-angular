import { Routes } from '@angular/router';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminSettings } from './pages/admin-settings/admin-settings';
import { AdminProductCategories } from './pages/admin-product-categories/admin-product-categories';
import { NotFound } from '../public/pages/not-found/not-found';
import { AdminProductPage } from './pages/admin-product-page/admin-product-page';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'households', component: AdminUsers },
      { path: 'settings', component: AdminSettings },
      { path: 'product-categorie', component: AdminProductCategories },
      { path: 'product', component: AdminProductPage },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', component: NotFound }
    ],
  },
];
