import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '@app/core/services/user/user';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  user = inject(UserService);
  // Reactive state using Signals
  isSidebarOpen = signal(true);
  

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
