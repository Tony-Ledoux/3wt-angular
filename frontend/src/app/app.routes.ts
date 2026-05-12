import { Routes } from '@angular/router';
import { Home } from './features/public/pages/home/home';
import { OnboardingPage } from './features/main/onboarding/pages/onboarding_page';
import { AuthGuard } from '@auth0/auth0-angular';
import { Main } from './layout/pages/main/main';
import { Public } from './layout/pages/public/public';

export const routes: Routes = [
    {
        path:'',
        component: Public,
        children: [
            {path:'', component: Home},
            {path:'onboarding', canActivate:[AuthGuard],component:OnboardingPage},
            {path:'logout', redirectTo:''}
        ]
    },
    {
        path:'',
        component:Main, //main shell
        canActivate: [AuthGuard],
        children:[
        ]
    },
    {
        path:'',
        //component: Home },
        canActivate: [],
        children:[]
    }
];
