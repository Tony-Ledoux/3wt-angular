import { Component, inject, output, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { uniqueDeviceTypeValidator } from '../../validators/storagerule-list-validator';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { LabeledSelectbox, SelectOptions } from '@app/shared/components/form/labled-selectbox/labeled-selectbox';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { ButtonComponent } from "@app/shared/components/button/button";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-category-form',
  imports: [ReactiveFormsModule, LabeledInput, LabeledSelectbox, ButtonComponent],
  templateUrl: './product-category-form.html',
  styleUrl: './product-category-form.css',
})
export class ProductCategoryForm {
  private fb = inject(FormBuilder);
  apiSrv = inject(ApiService);
  notifySrc = inject(NotifyService);

  categoryAdded = output<any>();
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
          //this.categories.update(p => [...p, data])
          this.notifySrc.success(`${data.categorieName} is toegevoegd `);
          this.categoryAdded.emit(data);
          this.categoryForm.reset();
          this.storageRules.clear();
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error?.message || err.error || 'Er gebeurde een onbekende fout';

          this.notifySrc.error(errorMessage);
          console.error('Full error object:', err);
        }
      });
    }
  }


}
