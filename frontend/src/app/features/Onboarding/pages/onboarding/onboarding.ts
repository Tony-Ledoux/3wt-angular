import { Component, effect, inject, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user/user';

@Component({
  selector: 'app-onboarding',
  imports: [],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding {
  user = inject(UserService);
  
  constructor(){
      effect(async () => {
      // 1. Dit effect 'luistert' naar het isAuth signal
      const authenticated = this.user.isAuth();
      
      console.log(`Authenticatie status veranderd naar: ${authenticated}`);

      // 2. Zodra isAuth true wordt, roepen we automatisch loadData aan
      if (authenticated) {
        try {
          await this.user.loadHouseholdUsers()
          console.log('Gebruikersdata succesvol geladen via effect!');
        } catch (e) {
          console.error('Effect faalde bij laden data', e);
        }
      }
    });
  }
  

}
