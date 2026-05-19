import { Component, inject } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { UserService } from '@app/core/services/user/user';
import { ButtonComponent } from '@app/shared/components/button/button';
import { SidemenuLink } from "../components/sidemenu-link/sidemenu-link";
import { HouseholdService } from '@app/features/main/services/household-service';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonComponent,  SidemenuLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private userService = inject(UserService);
  private modalService = inject(ModalService);
  householdService = inject(HouseholdService);

  handleLogOffClick() {
    this.modalService.open(
      "Afmelden?",
      "Ben je zeker dat je wil afmelden?",
      { icon: 'fa fa-sign-out', onConfirm: () => { this.userService.logoff() } })
      .setType('danger')
      .show();
  }
}
