import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../api/api-service';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = inject(ApiService);
  auth = inject(AuthService);

  householdusers = toSignal<Object[]>(this.api.get('/users/me'),{initialValue: null});
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


  


}
