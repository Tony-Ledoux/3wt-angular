import { Routes } from '@angular/router';
import { Home } from './features/public/pages/home/home';
import { OnboardingPage } from './features/main/onboarding/pages/onboarding_page';
import { AuthGuard } from '@auth0/auth0-angular';
import { Main } from './layout/pages/main/main';
import { Public } from './layout/pages/public/public';
import { noAdminGuard } from './core/guards/no-admin-guard';
import { onlyAdminGuard } from './core/guards/only-admin-guard';
import { Dashboard } from './features/main/pages/dashboard/dashboard';
import { notOnboardedGuard } from './core/guards/not-onboarded-guard';
import { hasOnboardedGuard } from './core/guards/has-onboarded-guard';
import { Settings } from './features/main/pages/settings/settings';
import { AdminLayout } from './layout/pages/admin/admin-layout';
import { NotFound } from './features/public/pages/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        component: Main, //main shell
        canActivate: [AuthGuard, noAdminGuard, hasOnboardedGuard],
        loadChildren: () => import('@features/main/main.routes').then(m => m.MAIN_ROUTES)
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [onlyAdminGuard],
        loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: '',
        component: Public,
        canActivate: [],
        children: [
            { path: '', component: Home },
            { path: 'onboarding', canActivate: [AuthGuard, notOnboardedGuard, noAdminGuard], component: OnboardingPage },
            { path: 'logout', redirectTo: '' },
            { path: '**', component: NotFound }
        ]
    },
];
