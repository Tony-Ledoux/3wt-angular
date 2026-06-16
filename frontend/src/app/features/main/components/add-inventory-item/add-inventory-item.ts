import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { storageDevice } from '@app/core/types/device';
import { InventoryItem } from '@app/core/types/inventory-item';
import { ProductCategory, StorageRule } from '@app/core/types/productCategories';
import { ProductDto } from '@app/core/types/products';
import { DateNotInPastValidator } from '@app/core/validators/date-not-in-past/date-not-in-past';
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
  private apiSrv = inject(ApiService);
  private toastSrv = inject(NotifyService);

  inventoryForm = this.fb.group({
    StorageLocationId: ['', Validators.required],
    ProductId: [0],
    Quantity: ['', [Validators.required, Validators.min(0.01)]],
    Unit: [''],
    ExpiryDate: ['',DateNotInPastValidator]
  });
  
  data = input<any>();
  submitted = output<InventoryItem>();
  
  household_id = computed<number>(()=>this.data()?.household_id ?? 0);
  product = computed<ProductDto>(() => this.data()?.product)
  categories = computed<ProductCategory[]>(() => this.data().categories)
  devices = computed<storageDevice[]>(() => this.data().devices)
  defaultUnit = computed<string>(() => this.product()?.defaultUnit ?? '');
  storageLocationId = toSignal(
    this.inventoryForm.controls.StorageLocationId.valueChanges.pipe(
      startWith(this.inventoryForm.controls.StorageLocationId.value)
    )
  );
  selectedDevice = computed<storageDevice | null | undefined>(() => {
    let id: null | string | number | undefined = this.storageLocationId();
    if (!id) return null;
    id = parseInt(id, 10);
    return this.devices().find(x => x.id === id);
  });

  filteredRules = computed<StorageRule[]>(() => {
    const device = this.selectedDevice();
    if (!device) return [];
    const relevantRules: StorageRule[] = [];
    for (const cat of this.categories()) {
      const ruleMatch = cat.storageRules.filter(rule => rule.deviceType === device.deviceType)
      if (ruleMatch.length > 0) {
        relevantRules.push(...ruleMatch)
      }
    }

    return relevantRules
  });

  multiplier = computed<number>(() => {
    const rules = this.filteredRules();
    if (rules.length === 0) return 0;
    // return the sum of all rule.mulipier
    const totaal = rules.reduce((accumulator, rule) => accumulator + rule.multiplier, 0);
    return totaal;
  })
  expiryDate = computed<string>(() => {
    const multiplier = this.multiplier();
    const shelfLife = this.product().shelfLifeClosedMinutes;
    if (!shelfLife) return '';
    let shelfLifeDays = shelfLife / 1440
    if(multiplier !== 0){
      shelfLifeDays = shelfLifeDays * multiplier;
    }
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate());
    expiryDate.setHours(0, 0, 0, 0);// Reset time portion for accuracy
    
    // Add the calculated days to the date
    expiryDate.setDate(expiryDate.getDate() + Math.round(shelfLifeDays));
    
    // Update the form field with a standard YYYY-MM-DD string
    const dateString = expiryDate.toISOString().split('T')[0];
    return dateString;
  })
  storageAdvice = computed<null | string>(() => {
    if(this.selectedDevice()===null) return null;
    if (this.expiryDate() !== '' && this.expiryDate() < new Date().toISOString() ){
      return `We adviseren om ${this.product().productName} niet op te slaan in een ${this.selectedDevice()?.deviceType}`;
    }
    return null;
  });





  public get deviceOptionsList(): SelectOptions[] {
    return this.devices().map(x => ({ label: `${x.name} - ${x.deviceType}`, value: x.id })).sort((a, b) => a.label.localeCompare(b.label));
  }

  constructor() {
    effect(() => {
      const currentData = this.data();
      const exp = this.expiryDate();
      if (!currentData.product) return
      this.inventoryForm.get('ProductId')?.patchValue(this.product().id, { emitEvent: false });
      this.inventoryForm.get('Unit')?.patchValue(this.defaultUnit(), { emitEvent: false });
      if(exp >= new Date().toISOString()){
        this.inventoryForm.get('ExpiryDate')?.patchValue(this.expiryDate(),{emitEvent:false});
      }else {
        this.inventoryForm.get('ExpiryDate')?.patchValue('',{emitEvent:false});
      }
    });
  }


  onSubmit() {
    const hh_id = this.household_id();
    if(this.inventoryForm.valid){
      this.apiSrv.post<InventoryItem>(`/inventory/household/${hh_id}`, this.inventoryForm.value).subscribe({
        next:(data)=>{
          this.toastSrv.success(`${data.product.productName} is toegevoegd aan de inventaris`);
          this.submitted.emit(data);
        },
        error:(err)=>{
          console.error(err);
        }
      });
    }
    console.log(this.inventoryForm.value);
  }
}
