import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROLE_CLAIM, UserService } from '../services/user/user';
import { filter, map, of, switchMap, take } from 'rxjs';

export const noAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(UserService);
  const router = inject(Router);
  return auth.auth.isAuthenticated$.pipe(
    filter(isAuth => isAuth !== null && isAuth !== undefined), //gebruiker is nu geAthenticeerd
    switchMap(isAuth => {
      if (!isAuth) {
        return of(true);
      }
      return auth.auth.idTokenClaims$.pipe(
        filter(claims => claims !== null && claims !== undefined), //claims are now known
        map(claims => {
          const roles = claims[ROLE_CLAIM] as string[] | undefined
          const isAdmin = roles?.includes('Admin');
          if(isAdmin){
            router.navigate(['/admin']);
          }
          return true;
        })
      );
    })
    , take(1)
  );
};
