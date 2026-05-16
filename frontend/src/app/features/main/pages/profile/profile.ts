import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '@app/core/services/user/user';
import { HouseholdService } from '../../services/household-service';
import { JsonPipe } from '@angular/common';
import { OnboardingPage } from "../../onboarding/pages/onboarding_page";
import { HouseholdCard } from '../../onboarding/components/household-card/household-card';
import { DatabaseSettings } from '@app/core/services/config/database-settings';
import { ButtonComponent } from '@app/shared/components/button/button';
import { ModalService } from '@app/core/modal-service';
import { HouseholdManagementCard } from '../../components/household-management-card/household-management-card';
import { Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify/notify-service';

@Component({
  selector: 'app-profile',
  imports: [JsonPipe, ButtonComponent, HouseholdManagementCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private modalS = inject(ModalService)
  private router = inject(Router);
  private notify = inject(NotifyService)
  userSrv = inject(UserService);
  householdSrv = inject(HouseholdService);
  config = inject(DatabaseSettings);

  // Helper om te bepalen of een specifiek huishouden geselecteerd is
  isHouseholdSelected(id: number): boolean {
    return this.householdSrv.selected_household()?.householdId === id;
  }

  onSelectHousehold(id: number): void {
    // 1. Check of dit huishouden al geselecteerd is
    if (this.isHouseholdSelected(id)) {
      return; // Doe niets, voorkom dubbele modal
    }

    // 2. Haal de naam op voor de bevestiging
    const house = this.householdSrv.households()?.find(h => h.householdId === id);

    // 3. Bevestig de wissel
    this.modalS.open('Huishouden wisselen', `Wil je overschakelen naar ${house?.householdName}?`)
      .setConfirmCallback(() => { 
        this.householdSrv.selectHousehold(id);
         //this.router.navigate(['/app/dashboard']);
         })
      .show();
  }

  onLeaveHousehold(id: number): void {
    const house = this.householdSrv.households()?.find(h => h.householdId === id);
  
    this.modalS.open('Huishouden verlaten', `Weet je zeker dat je ${house?.householdName} wilt verlaten?`)
      .setType('danger')
      .setConfirmText('Ja, ik wil verlaten')
      .setConfirmCallback(() => {
        this.householdSrv.leaveHouseHold(id);
       })
      .show();
  }
  onRemoveHouseHold(id: number): void {
const house = this.householdSrv.households()?.find(h => h.householdId === id);
  
    this.modalS.open('Huishouden verwijderen', `Weet je zeker dat je ${house?.householdName} wilt verwijderen?`)
      .setType('danger')
      .setConfirmText('Ja, verwijder dit huishouden')
      .setConfirmCallback(() => { this.householdSrv.removeHousehold(id); })
      .show();
  }
}
