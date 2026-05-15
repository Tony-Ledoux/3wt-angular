import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ModalService } from '@app/core/modal-service';
import { UserService } from '@app/core/services/user/user';
import { ButtonComponent } from "@app/shared/components/button/button";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, RouterLink, ButtonComponent],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  user = inject(UserService);
  modalService = inject(ModalService);
  // Reactive state using Signals
  isSidebarOpen = signal(true);

  handleLogOffClick() {
    this.modalService.open(
      "Afmelden?",
      "Ben je zeker dat je wil afmelden?",
      { icon: 'fa fa-sign-out', onConfirm: () => { this.user.logoff() } })
      .show();
  }
  

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
