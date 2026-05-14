import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-labeled-input',
  imports: [],
  templateUrl: './labeled-input.html',
  styleUrl: './labeled-input.css',
})
export class LabeledInput implements ControlValueAccessor {
  private ngControl = inject(NgControl, { self: true, optional: true });
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<string>('text');
  name = input.required<string>();

  value:any ='';
  disabled = false;
  touched = false;
  invalid = false;

  onChange:any = ()=>{};
  onTouched:any = ()=>{};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

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

  // Helper methodes voor de template
  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  handleBlur(): void {
    this.touched = true;
    this.onTouched();
  }

   get isError(): boolean {
    const control = this.ngControl?.control;
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  get errorMessage(): string {
    const control = this.ngControl?.control;
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${this.label()} is verplicht`;
    if (errors['minlength']) return `${this.label()} moet minimaal ${errors['minlength'].requiredLength} tekens hebben`;
    if (errors['maxlength']) return `${this.label()} mag maximaal ${errors['maxlength'].requiredLength} tekens hebben`;
    
    return `${this.label()} is ongeldig`;
  }
}
