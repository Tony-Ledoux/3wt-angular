import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { PublicMenu } from "@app/layout/menus/public-menu/public-menu";

@Component({
  selector: 'app-public',
  imports: [RouterModule, PublicMenu],
  templateUrl: './public.html',
  styleUrl: './public.css',
})
export class Public {

}
