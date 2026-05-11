import { Routes } from '@angular/router';
import { Home } from './features/Home/pages/home/home';
import { Onboarding } from './features/Onboarding/pages/onboarding/onboarding';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {path:'', component: Home },
    {path:'onboarding', component:Onboarding , canActivate: [AuthGuard]}
];
