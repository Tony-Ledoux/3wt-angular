import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../api/api-service';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = inject(ApiService);
  auth = inject(AuthService);

  householdusers = signal<any[]|null>(null);
  numHouseholdUsers = computed(()=> this.householdusers()?.length ?? -1) //if length = -1 state is loading

  readonly isAuth = toSignal(this.auth.isAuthenticated$, { initialValue: false })
  readonly user = toSignal(this.auth.user$,{initialValue:null})

  login() {
    this.auth.loginWithRedirect({
      appState:{
        target:'/onboarding'
      },
      authorizationParams:{
        prompt:'login'
      }
    });
  }
  logoff() {
    this.auth.logout();
  }

  async loadHouseholdUsers(){
    try{
      const data = await firstValueFrom(this.api.get<any[]>('/users/me'));
      this.householdusers.set(data);
    } catch (error){
      console.error('Fout bij laden van gebruikersdata:', error);
      this.householdusers.set([]); // Zet op lege lijst bij fout om loading state te beëindigen
      throw error;
    }
    
  }


  


}
