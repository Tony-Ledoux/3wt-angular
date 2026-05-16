import { Routes } from "@angular/router";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Settings } from "./pages/settings/settings";
import { isOwnerGuard } from "./guards/is-owner-guard";


export const MAIN_ROUTES: Routes = [
    {
        path: '',
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: "settings", canActivate: [isOwnerGuard], component: Settings }
        ]
    }
]