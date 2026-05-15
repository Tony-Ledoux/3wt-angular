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

export const routes: Routes = [
    {
        path:'',
        component: Public,
        canActivate:[noAdminGuard],
        children: [
            {path:'', component: Home},
            {path:'onboarding', canActivate:[AuthGuard, notOnboardedGuard],component:OnboardingPage},
            {path:'logout', redirectTo:''}
        ]
    },
    {
        path:'',
        component:Main, //main shell
        canActivate: [AuthGuard, noAdminGuard, hasOnboardedGuard],
        children:[
            {path:'dashboard', component:Dashboard}
        ]
    },
    {
        path:'admin',
        //component: Home },
        canActivate: [onlyAdminGuard],
        children:[]
    }
];
