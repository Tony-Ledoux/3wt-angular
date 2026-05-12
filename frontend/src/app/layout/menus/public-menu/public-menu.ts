import { Component, inject } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { UserService } from '@app/core/services/user/user';
import { ButtonComponent } from '@app/shared/components/button/button';
import { AuthState } from '@auth0/auth0-angular';

@Component({
  selector: 'app-public-menu',
  imports: [ButtonComponent],
  templateUrl: './public-menu.html',
  styleUrl: './public-menu.css',
})
export class PublicMenu {
  userService = inject(UserService)
  modalService = inject(ModalService)

  handleLogOffClick(){
    this.modalService.open("Afmelden?","Ben je zeker dat je wil afmelden?",{icon:'fa fa-sign-out', onConfirm:()=>{this.userService.logoff()}});
  }

}
