import { Routes } from "@angular/router";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Settings } from "./pages/settings/settings";
import { isOwnerGuard } from "./guards/is-owner-guard";
import { NotFound } from "../public/pages/not-found/not-found";
import { Profile } from "./pages/profile/profile";
import { Products } from "./pages/products/products";
import { Recipes } from "./pages/recipes/recipes";
import { Shoppinglist } from "./pages/shoppinglist/shoppinglist";
import { WeekMenu } from "./pages/week-menu/week-menu";
import { Locaties } from "./pages/locaties/locaties";
import { Inventory } from "./pages/inventory/inventory";


export const MAIN_ROUTES: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: "dashboard", pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'locaties', component: Locaties },
            { path: 'profile', component: Profile },
            { path: 'inventory', component: Inventory },
            { path: 'producten', component: Products },
            { path: 'recepten', component: Recipes },
            { path: 'menu', component: WeekMenu },
            { path: 'shoppinglist', component: Shoppinglist },
            { path: "settings", canActivate: [isOwnerGuard], component: Settings },
            { path: '**', component: NotFound },
        ]
    }
]