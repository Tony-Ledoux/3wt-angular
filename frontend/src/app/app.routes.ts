import { Routes } from '@angular/router';
import { Home } from './features/Home/pages/home/home';
import { Onboarding } from './features/Onboarding/pages/onboarding/onboarding';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {
        path:'',
        //component: null, // Empty shell
        children: [
            {path:'', component: Home}
        ]
    },
    {
        path:'',
        //component:null, //main shell
        canActivate: [AuthGuard],
        children:[
            {path:'onboarding', component:Onboarding}
        ]
    },
    {
        path:'',
        //component: Home },
        canActivate: [],
        children:[]
    }
];
