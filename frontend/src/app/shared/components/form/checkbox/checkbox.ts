import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
  providers: [
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>Checkbox),
      multi: true,
    }
  ]
})
export class Checkbox implements ControlValueAccessor {
  label = input<string>();
  disabled = input<boolean>(false);

  value = signal<boolean>(false);

  onChange: any = ()=>{};
  onTouched: any = ()=>{};

  toggle():void {
    if(this.disabled()) return;

    this.value.update((v)=> !v);
    this.onChange(this.value());
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.value.set(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    
  }

}
