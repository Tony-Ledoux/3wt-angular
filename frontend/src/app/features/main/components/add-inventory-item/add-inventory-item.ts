import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { storageDevice } from '@app/core/types/device';
import { ProductCategory } from '@app/core/types/productCategories';
import { ProductDto } from '@app/core/types/products';
import { ButtonComponent } from '@app/shared/components/button/button';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { SelectOptions, LabeledSelectbox } from '@app/shared/components/form/labled-selectbox/labeled-selectbox';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-add-inventory-item',
  imports: [JsonPipe, ReactiveFormsModule, LabeledSelectbox, LabeledInput, ButtonComponent],
  templateUrl: './add-inventory-item.html',
  styleUrl: './add-inventory-item.css',
})
export class AddInventoryItem {
  private fb = inject(FormBuilder)
  inventoryForm = this.fb.group({
    StorageLocationId: ['', Validators.required],
    Quantity: ['', [Validators.required, Validators.min(0.01)]],
    Unit: [''],
    ExpiryDate: ['']
  });
  data = input<any>();
  product = computed<ProductDto>(() => this.data()?.product)
  categories = computed<ProductCategory[]>(() => this.data().categories)
  devices = computed<storageDevice[]>(() => this.data().devices)
  defaultUnit = computed<string>(() => this.product()?.defaultUnit ?? '');
  storageAdvice = signal<string | null>(null);
  storageLocationId = toSignal(
    this.inventoryForm.controls.StorageLocationId.valueChanges.pipe(
      startWith(this.inventoryForm.controls.StorageLocationId.value)
    )
  );
  
 
  
  public get deviceOptionsList(): SelectOptions[] {
    return this.devices().map(x => ({ label: `${x.name} - ${x.deviceType}`, value: x.id })).sort((a, b) => a.label.localeCompare(b.label));
  }

  constructor() {
    effect(() => {
      const currentData = this.data();
      if (!currentData.product) return

      this.inventoryForm.get('Unit')?.patchValue(this.defaultUnit(), { emitEvent: false });
      //const multiplier = currentData.categories[0].storagerules.filter(x=>x.)

      // if storageLocationIdChanges
      //if multiplier is negative, set warning else calculate exirationdate if product.shelflifeClosed is known
    });
  }
  onExpiryDateChange(event: string) {
    console.log(event);
  }

  onSubmit() {
    console.log(this.inventoryForm.value);
  }
}
