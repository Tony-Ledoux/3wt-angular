import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { HouseholdService } from '@app/features/main/services/household-service';

export const hasOnboardedGuard: CanActivateChildFn = async (route, state) => {
  const household_service = inject(HouseholdService);
  const router = inject(Router);
  const isValid = await household_service.validateSelectedHoushold();
  if(!isValid){
    console.log('User has not onboarded');
    router.navigate(['/onboarding']);
    return false;
  }
  return true;
};

