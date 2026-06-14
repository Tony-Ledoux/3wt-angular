import { AbstractControl, ValidationErrors } from '@angular/forms';

export function DateNotInPastValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Allow null or empty values
  if (!value) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison

  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { DateInPast: true };
  }

  return null;
}