import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from './components/admin-sidebar/admin-sidebar';


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
