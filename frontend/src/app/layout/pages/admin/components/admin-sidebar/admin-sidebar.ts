import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from "@app/shared/components/button/button";
import { AdminSidebarNavLink } from "../admin-sidebar-nav-link/admin-sidebar-nav-link";
import { UserService } from '@app/core/services/user/user';

@Component({
  selector: 'app-admin-sidebar',
  imports: [ ButtonComponent, AdminSidebarNavLink],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  auth = inject(UserService)
}
