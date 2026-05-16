import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ModalService } from '@app/core/modal-service';
import { UserService } from '@app/core/services/user/user';
import { HouseholdService } from '@app/features/main/services/household-service';
import { ButtonComponent } from "@app/shared/components/button/button";
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
   // Reactive state using Signals
  isSidebarOpen = signal(true);

  /*
  handleLogOffClick() {
    this.modalService.open(
      "Afmelden?",
      "Ben je zeker dat je wil afmelden?",
      { icon: 'fa fa-sign-out', onConfirm: () => { this.user.logoff() } })
      .show();
  }
  */

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
