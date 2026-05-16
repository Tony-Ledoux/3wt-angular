import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-admin-sidebar-nav-link',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar-nav-link.html',
  styleUrl: './admin-sidebar-nav-link.css',
})
export class AdminSidebarNavLink {
  link = input.required<string>();
  label = input.required<string>();
  icon = input<string>(); //font awsome icon
}
