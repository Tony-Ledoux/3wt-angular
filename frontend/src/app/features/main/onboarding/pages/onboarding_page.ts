import { Component, effect, inject, signal } from '@angular/core';
import { UserService } from '@app/core/services/user/user';
import { ModalService } from '@app/core/modal-service';
import { FullscreenSpinnerService } from '@app/core/services/spinner/fullscreen-spinner-service';
import { ButtonComponent } from "@app/shared/components/button/button";
import { CreateHousehold } from '../components/create-household/create-household';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-onboarding',
  imports: [ButtonComponent],
  templateUrl: './onboarding_page.html',
  styleUrl: './onboarding_page.css',
})
export class OnboardingPage {

  user = inject(UserService);
  modal = inject(ModalService)
  spinner = inject(FullscreenSpinnerService);
  loadingError = signal<boolean>(false);

  async LoadData() {
    this.spinner.show()
    // 1. Dit effect 'luistert' naar het isAuth signal
    const authenticated = this.user.isAuth();
    console.log(`Authenticatie status veranderd naar: ${authenticated}`);
    // 2. Zodra isAuth true wordt, roepen we automatisch loadData aan
    if (authenticated) {
      try {
        await this.user.loadHouseholdUsers()
        console.log('Gebruikersdata succesvol geladen via effect!');
      }
      catch (e) {
        let confirmAction = () => void
          console.error('Effect faalde bij laden data', e);
        // get the type of error
        if (e instanceof HttpErrorResponse) {
          if (e.status == 401) {
            confirmAction = () => {
              this.user.logoff();
              console.log("User logged out due to session expiry");
            }
          } else {
            confirmAction = () => { this.LoadData() };
          }
          this.modal.open('Error', `<span class="text-lg text-red-500">Er gebeurde een fout <br />probeer opniew </span>`, {
            showCancelButton: false, onConfirm: confirmAction, confirmText: e.status === 401 ? 'Opnieuw inloggen' : 'Opnieuw proberen', icon:'fa fa-bomb', type:'danger'
          });
        }
      } finally {
        this.spinner.hide()
      }
    };
  }

  openInviteModal() {
    throw new Error('Method not implemented.');
  }

  openCreateModal() {
    // Als je modal service componenten ondersteunt:
    this.modal.open("Huishouden aanmaken", CreateHousehold, { showActionButton: false, showCancelButton: false, closeOnBackdropClick: false, icon: 'fa fa-users' });
    // OF als je modal alleen tekst ondersteunt, navigeer dan naar een route:
    // this.router.navigate(['/create-household']);
  }
  constructor() {
    effect(async () => {
      await this.LoadData();
    });
  }
}