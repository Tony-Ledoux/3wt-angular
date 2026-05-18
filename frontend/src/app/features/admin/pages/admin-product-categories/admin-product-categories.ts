import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { LabeledInput } from "@app/shared/components/form/labeled-input/labeled-input";
import { uniqueDeviceTypeValidator } from '../../validators/storagerule-list-validator';
import { SelectOptions, LabeledSelectbox } from '@app/shared/components/form/labled-selectbox/labeled-selectbox';
import { NotifyService } from '@app/core/services/notify/notify-service';
@Component({
  selector: 'app-admin-product-categories',
  imports: [JsonPipe, ReactiveFormsModule, LabeledInput, LabeledSelectbox],
  templateUrl: './admin-product-categories.html',
  styleUrl: './admin-product-categories.css',
})
export class AdminProductCategories {
  apiSrv = inject(ApiService);
  notifySrc = inject(NotifyService);
  private fb = inject(FormBuilder);

  categories = signal<any[]>([]);
  deviceTypes = signal<SelectOptions[]>([]);

  //forms
  categoryForm = this.fb.group({
    CategorieName: ['', Validators.required],
    storageRules: this.fb.array([], [uniqueDeviceTypeValidator()])
  });

  constructor() {
    this.loadData();
  }

  private loadData() {
    this.apiSrv.get<any[]>('/admin/product-categories').subscribe({
      next: (data) => {
        this.categories.set(data);
      }
    });
    this.apiSrv.get<any[]>('/devicetypes').subscribe({
      next: (data) => {
        const options = data.map(dt => ({
          label: dt.type,
          value: dt.id
        }));
        console.log(data)
        this.deviceTypes.set(options);
      }
    });

  }

  // helpers for the form
  get storageRules() {
    return this.categoryForm.controls.storageRules as FormArray;
  }

  addStorageRule() {
    this.storageRules.push(this.fb.group({
      deviceType: ['', [Validators.required, Validators.min(0)]],
      multiplier: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeStorageRule(index: number) {
    this.storageRules.removeAt(index);
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      console.log('Form Data:', this.categoryForm.value);
      this.apiSrv.post<any>('/admin/product-categories', this.categoryForm.value).subscribe({
        next: (data) => {
          //update category signal 
          this.categories.update(p=> [...p, data])
          this.notifySrc.success(`${data.category} is toegevoegd `);
        }
      });
    }
  }

}
