import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../api/api-service';
import { AuthService } from '@auth0/auth0-angular';

export const ROLE_CLAIM = 'http://localhost:5213/roles';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = inject(ApiService);
  auth = inject(AuthService);

  readonly isInitializing = computed(()=>{
    return this.user() === null && this.isAuth() === null;
  })
  readonly isAuth = toSignal(this.auth.isAuthenticated$, { initialValue: null })
  readonly user = toSignal(this.auth.user$,{initialValue:null})
  readonly isAdmin = computed(()=>{
    const user = this.user();
    if(!user) return false;
    const roles = user[ROLE_CLAIM] as string[]| undefined;
    return roles?.includes('Admin')?? false;
  });

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
    // clear the local storage
    this.auth.logout();
    localStorage.clear();
  }

  register() {
  this.auth.loginWithRedirect({
    appState: {
      target: '/onboarding'
    },
    authorizationParams: {
      screen_hint: 'signup',
    }
  });
}

}
