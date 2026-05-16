import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidemenu-link',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidemenu-link.html',
  styleUrl: './sidemenu-link.css',
})
export class SidemenuLink {
  
  label = input.required<string>();
  link = input.required<string>();
  icon = input<string>();
}
