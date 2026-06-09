import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../api/api-service';
import { AuthService } from '@auth0/auth0-angular';
import { ModalService } from '@app/core/services/modal/modal-service';
import { DatabaseSettings } from '../config/database-settings';

export const ROLE_CLAIM = 'http://localhost:5213/roles';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private configSrv = inject(DatabaseSettings);
  api = inject(ApiService);
  auth = inject(AuthService);
  modalService = inject(ModalService)

  readonly isInitializing = computed(() => {
    return this.user() === null && this.isAuth() === null;
  })
  readonly isAuth = toSignal(this.auth.isAuthenticated$, { initialValue: null })
  readonly user = toSignal(this.auth.user$, { initialValue: null })
  readonly isAdmin = computed(() => {
    const user = this.user();
    if (!user) return false;
    const roles = user[ROLE_CLAIM] as string[] | undefined;
    return roles?.includes('Admin') ?? false;
  });

  login() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/onboarding'
      },
      authorizationParams: {
        prompt: 'login'
      }
    });
  }

  logoff() {
    const redirectUri = `${window.location.origin}/logout`;

    console.log('Length:', redirectUri.length);
    console.log('Last char code:', redirectUri.charCodeAt(redirectUri.length - 1));
    // clear the local storage
    console.log('Auth0 redirect target:', redirectUri);
    this.auth.logout({logoutParams:{ returnTo: redirectUri }});
    localStorage.clear();
  }

  handleLogOffClick() {
    this.modalService.open(
      "Afmelden?",
      "Ben je zeker dat je wil afmelden?",
      { icon: 'fa fa-sign-out', onConfirm: () => { this.logoff() } })
      .show();
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
