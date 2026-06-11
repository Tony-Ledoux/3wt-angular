import { Component, inject, input, output } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

export type InputType = 'text' | 'number' | 'positive-number' | 'decimal' | 'positive-decimal' | 'password' | 'email' | 'date';

@Component({
  selector: 'app-labeled-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labeled-input.html',
  styleUrl: './labeled-input.css',
})
export class LabeledInput implements ControlValueAccessor {
  // Injecteer NgControl om direct toegang te hebben tot de validatie status van de parent
  public ngControl = inject(NgControl, { self: true, optional: true });

  // Inputs via Signals (Angular 17+)
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<InputType>('text');
  name = input.required<string>();
  valueChange = output<any>();

  // CVA State
  value: any = '';
  disabled = false;

  // CVA Callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Vertaalt custom InputTypes naar standaard HTML attributen
   */
  get attributes() {
    const type = this.type();
    const map: Record<string, any> = {
      'positive-number': { type: 'number', min: '0', step: '1' },
      'decimal':         { type: 'number', step: '0.01' },
      'positive-decimal':{ type: 'number', min: '0', step: '0.01' },
      'number':          { type: 'number', step: '1' },
    };

    return map[type] || { type: type };
  }

  /**
   * Bepaalt of de input visueel als 'invalid' moet worden getoond
   */
  get isInvalid(): boolean {
    const control = this.ngControl?.control;
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  /**
   * Genereert de foutmelding op basis van de actieve validators
   */
  get errorMessage(): string {
    const errors = this.ngControl?.control?.errors;
    if (!errors) return '';

    if (errors['required']) return `${this.label()} is verplicht`;
    if (errors['min']) return `${this.label()} mag niet lager zijn dan ${errors['min'].min}`;
    if (errors['minlength']) return `Minimaal ${errors['minlength'].requiredLength} tekens nodig`;
    if (errors['maxlength']) return `Maximaal ${errors['maxlength'].requiredLength} tekens toegestaan`;
    if (errors['unique']) return `${this.label()} bestaat al`;

    return `${this.label()} is ongeldig`;
  }

  // --- ControlValueAccessor Implementatie ---

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let val = inputElement.value;

    // Voorkom negatieve tekens bij positive types
    if (this.type() === 'positive-number' || this.type() === 'positive-decimal') {
      val = val.replace(/-/g, '');
      inputElement.value = val; 
    }

    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val)
  }
}
