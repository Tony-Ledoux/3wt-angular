import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from './components/admin-sidebar/admin-sidebar';
import { ButtonComponent } from "@app/shared/components/button/button";


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebar, ButtonComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  isOpen = signal(false);

  toggleMenu(){
    this.isOpen.update(p=>!p);
  }
}
