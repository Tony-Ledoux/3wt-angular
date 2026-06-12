import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { storageDevice } from '@app/core/types/device';
import { ProductCategory } from '@app/core/types/productCategories';
import { ProductDto } from '@app/core/types/products';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { SelectOptions, LabeledSelectbox } from '@app/shared/components/form/labled-selectbox/labeled-selectbox';

@Component({
  selector: 'app-add-inventory-item',
  imports: [JsonPipe,ReactiveFormsModule, LabeledSelectbox, LabeledInput],
  templateUrl: './add-inventory-item.html',
  styleUrl: './add-inventory-item.css',
})
export class AddInventoryItem {
  private fb = inject(FormBuilder)
  data = input<any>();
  product = computed<ProductDto>(()=>this.data()?.product)
  categories = computed<ProductCategory[]>(()=>this.data().categories)
  devices = computed<storageDevice[]>(()=>this.data().devices)
  defaultUnit = computed<string>(()=>this.product()?.defaultUnit ?? '');
  public get deviceOptionsList():SelectOptions[] {
     return this.devices().map(x => ({ label: `${x.name} - ${x.deviceType}`, value: x.id })).sort((a, b) => a.label.localeCompare(b.label));
  }
  inventoryForm = this.fb.group({
    StorageLocationId:['', Validators.required],
    Quantity:['', [Validators.required, Validators.min(0.01)]],
    Unit:[''], 
    ExpiryDate : ['']
  });

  constructor(){
    effect(()=> {
      const currentData = this.data();
      if(currentData && currentData.product){
        this.inventoryForm.get('Unit')?.patchValue(this.defaultUnit());
      }
    });
  }
}
