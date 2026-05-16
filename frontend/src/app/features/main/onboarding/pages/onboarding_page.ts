import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { CreateHousehold } from '../components/create-household/create-household';

import { HouseholdService } from '../../services/household-service';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { Router } from '@angular/router';
import { HouseholdCard } from "../components/household-card/household-card";
import { ButtonComponent } from "@app/shared/components/button/button";
import { DatabaseSettings } from '@app/core/services/config/database-settings';
import { JoinForm } from '../components/join-form/join-form';

//this page is behind the authGuard, notOnboardedGuard and noAdmin Guard!


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
  settings = inject(DatabaseSettings);
  
  // We gebruiken een signal om de selectie bij te houden
  selectedHousehold = signal<number | null>(null);

  constructor(){
    
    effect(()=>{
      const households = this.h_srv.households();
      if(households && households.length === 1){
        const id = households[0].householdId;
        this.h_srv.selectHousehold(id);
        this.router.navigate(['/dashboard']);
      }
    });
    
  }
 
  
  selectCard(id: number) {
    this.selectedHousehold.set(id);
  }

  goToDashboard() {
    const id = this.selectedHousehold();
    if (id !== null) {
      this.h_srv.selectHousehold(id);
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

  handleJoin(){
    this.modal.open('Aansluiten', JoinForm)
    .setIcon('fa fa-person-walking-luggage')
    .setCancelActionButton(false)
    .setShowActionButton(false)
    .show()
  }

}