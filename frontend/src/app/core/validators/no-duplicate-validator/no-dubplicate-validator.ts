import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

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
            return null; 
        }

        // 4. Normalize value: lowercase it if it's a string
        const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value as T;

        // 5. Check for duplicates (case-insensitive for strings)
        if (items.some(item => {
            const normalizedItem = typeof item === 'string' ? item.toLowerCase() : item;
            return normalizedItem === normalizedValue;
        })) {
            console.log("Duplicate found:", value);
            return { unique: true };
        }

        return null;
    };
}
