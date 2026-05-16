import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HouseholdService } from '@app/features/main/services/household-service';

export const notOnboardedGuard: CanActivateFn = async (route, state) => {
  const household_service = inject(HouseholdService);
  const router = inject(Router);
  const isValid = await household_service.validateSelectedHoushold();
  if(isValid){
    console.log('User already has a household, redirecting to dashboard...');
    router.navigate(['/app/dashboard']);
    return false;
  }
  return true;
};
