import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { InventoryItem } from '@app/core/types/inventory-item';
import { ButtonComponent } from '@app/shared/components/button/button';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';

@Component({
  selector: 'app-edit-form',
  imports: [JsonPipe, LabeledInput, ButtonComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
  data = input<{ item: InventoryItem, household: number }>();
  inventory_item = computed(() => this.data()?.item ?? null)
  private fb = inject(FormBuilder);
  private apiSrv = inject(ApiService)
  alter = this.fb.group({
    quantity: [null, [Validators.required, Validators.min(0.01)]]
  })

  onSubmit() {
    const id = this.inventory_item()?.id ?? 0;
    const put = {
      id,
      quantity: parseFloat(this.alter.get("quantity")?.value ?? '0')
    }
    this.apiSrv.put<InventoryItem | void>(`/inventory/household/${this.data()?.household ?? 0}`, put).subscribe({
      next: (data) => {
        console.log(data, typeof data);
      }
    });

  }

}
