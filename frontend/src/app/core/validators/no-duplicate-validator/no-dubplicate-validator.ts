import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Use generic <T> to allow checking uniqueness for strings, numbers, or objects
export function NoDuplicateValidator<T>(itemsAccessor: () => T[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // 1. Only validate if the user has actually typed something
        if (!value) {
            return null; 
        }

        // 2. Access the list dynamically via the passed function (signal)
        const items = itemsAccessor();

        // 3. Wait for data to load before validating
        if (!items?.length) {
            return null; // Validation passes until data arrives
        }

        // 4. Check for duplicates using strict equality
        // For complex objects, your 'itemsAccessor' should map to a unique property (e.g., x => x.id)
        if (items.includes(value as T)) {
            console.log("Duplicate found:", value);
            return { unique: true };
        }

        return null;
    };
}
