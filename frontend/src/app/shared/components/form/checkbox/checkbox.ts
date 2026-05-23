import { Component, computed, effect, ElementRef, forwardRef, input, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
export interface CheckboxChanged {
  checked: boolean|null;
  name: string | undefined;
}

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    }
  ]
})
export class Checkbox implements ControlValueAccessor {
  label = input<string>();
  name = input<string>();
  nullable = input<boolean>(false);
  changed = output<CheckboxChanged>();
  disabled = input<boolean>(false);
  private _formDisabled = signal(false);
  isDisabled = computed(() => this.disabled() || this._formDisabled());

  value = signal<boolean|null>(false);
  private inputElement = viewChild<ElementRef<HTMLInputElement>>('chekboxInput');

  onChange: (value: boolean|null) => void = () => { };
  onTouched: () => void = () => { };

  constructor(){
    effect(()=>{
      const el = this.inputElement()?.nativeElement;
      if(el){
        el.indeterminate = this.value() === null;
      }
    })
  }

  toggle(): void {
    if (this.isDisabled()) return;
    const current = this.value();
    let newValue: boolean|null;
    if(!this.nullable()){
      newValue = current === null ? true: !current;
    }else{
      if(current === false) newValue=true;
      else if(current == true) newValue = null;
      else newValue = false;
    }
    this.value.set(newValue);
    this.changed.emit({
      checked: newValue,
      name: this.name()
    })
    this.onChange(newValue);
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
    this._formDisabled.set(isDisabled);
  }

}
