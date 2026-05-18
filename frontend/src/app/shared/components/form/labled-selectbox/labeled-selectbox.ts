import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

export interface SelectOptions {
  label: string;
  value: any
}

@Component({
  selector: 'app-labeled-selectbox',
  imports: [ReactiveFormsModule],
  templateUrl: './labeled-selectbox.html',
  styleUrl: './labeled-selectbox.css',

})
export class LabeledSelectbox implements ControlValueAccessor {
  private ngControl = inject(NgControl, { self: true, optional: true })
  choices = input.required<SelectOptions[]>();
  label = input.required<string>();
  
  value: any;
  disabled = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  // interface
  writeValue(obj: any): void {
    this.value = obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

   onChangeEvent(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }
  //helper getters
  get isError(): boolean {
    const control = this.ngControl?.control;
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  get errorMessage(): string {
    const control = this.ngControl?.control;
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${this.label()} is verplicht`;
    if(errors['duplicate']) return `${this.label()} mag maar 1 keer voorkomen`

    return `${this.label()} is ongeldig`;
  }
}
