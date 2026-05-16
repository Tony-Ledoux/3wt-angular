import { Routes } from '@angular/router';

// Placeholder components (we maken deze hieronder)
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminSettings } from './pages/admin-settings/admin-settings';

import { AdminProductCategories } from './pages/admin-product-categories/admin-product-categories';
import { onlyAdminGuard } from '@app/core/guards/only-admin-guard';
import { AdminLayout } from '@app/layout/pages/admin/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'settings', component: AdminSettings },
      { path: 'product-categorie', component: AdminProductCategories },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
