import { CanActivateFn, Router } from '@angular/router';
import { ROLE_CLAIM, UserService } from '../services/user/user';
import { inject } from '@angular/core';
import { filter, map, switchMap, take } from 'rxjs';

export const onlyAdminGuard: CanActivateFn = (childRoute, state) => {
  const auth = inject(UserService);
  const router = inject(Router);
  return auth.auth.isAuthenticated$.pipe(
      filter(isAuth => isAuth !== null && isAuth !== undefined), //gebruiker is nu geAthenticeerd
      switchMap(isAuth => {
        if (!isAuth) {
          return router.navigate(['/']);
        }
        return auth.auth.idTokenClaims$.pipe(
          filter(claims => claims !== null && claims !== undefined), //claims are now known
          map(claims => {
            const roles = claims[ROLE_CLAIM] as string[] | undefined
            const isAdmin = roles?.includes('Admin');
            if(!isAdmin){
              router.navigate(['/']);
            }
            return true;
          })
        );
      })
      , take(1)
    );
};
