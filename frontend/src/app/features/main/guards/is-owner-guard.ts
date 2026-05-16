import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HouseholdService } from '../services/household-service';

export const isOwnerGuard: CanActivateFn = (route, state) => {
  const householdS = inject(HouseholdService);
  const router = inject(Router)
  if(!householdS.selected_household()?.isowner){
    return router.navigate(['/dashboard']);
  }
  return true;
};
