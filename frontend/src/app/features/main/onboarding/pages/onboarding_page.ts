import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { CreateHousehold } from '../components/create-household/create-household';

import { HouseholdService } from '../../services/household-service';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { Router } from '@angular/router';
import { HouseholdCard } from "../components/household-card/household-card";
import { ButtonComponent } from "@app/shared/components/button/button";

//this page is behind the authGuard and noAdmin Guard!

@Component({
  selector: 'app-onboarding',
  imports: [Spinner, HouseholdCard, ButtonComponent],
  templateUrl: './onboarding_page.html',
  styleUrl: './onboarding_page.css',
})
export class OnboardingPage {
  h_srv = inject(HouseholdService);
  router = inject(Router);
  modal = inject(ModalService);

  // We gebruiken een signal om de selectie bij te houden
  selectedHouseholdIndex = signal<number | null>(null);

  selectCard(index: number) {
    this.selectedHouseholdIndex.set(index);
  }

  goToDashboard() {
    const index = this.selectedHouseholdIndex();
    if (index !== null) {
      this.h_srv.selectHousehold(index);
      this.router.navigate(['/dashboard']);
    }
  }

  handleCreateNewHousehold(){
    this.modal.open('Aanmaken',CreateHousehold)
      .setCloseBackdropClick(false)
      .setCancelActionButton(false)
      .setShowActionButton(false)
      .setIcon('fa fa-users')
      .show()
  }

}