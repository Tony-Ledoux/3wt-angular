import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { storageDevice } from '@app/core/types/device';
import { NoDuplicateValidator } from '@app/core/validators/no-duplicate-validator/no-dubplicate-validator';
import { ButtonComponent } from '@app/shared/components/button/button';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { LabeledSelectbox } from '@app/shared/components/form/labled-selectbox/labeled-selectbox';

@Component({
  selector: 'app-add-storagelocation-form',
  imports: [JsonPipe, LabeledSelectbox, ReactiveFormsModule, LabeledInput, ButtonComponent],
  templateUrl: './add-storagelocation-form.html',
  styleUrl: './add-storagelocation-form.css',
})
export class AddStoragelocationForm {
  private fb = inject(FormBuilder);
  private apiSrv = inject(ApiService)
  data = input<any>();
  submitted = output<storageDevice>();
  private existing_storagelocations = computed<storageDevice[]>(() => this.data()?.exitsting ?? [])
  existing_storagelocations_names = computed(() => this.existing_storagelocations().map(loc => loc.name).filter(Boolean));
  household_id = computed<number>(() => this.data().household_id)
  storageLocationForm = this.fb.group({
    naam: ['', [Validators.required, Validators.minLength(3), NoDuplicateValidator<string>(this.existing_storagelocations_names)]],
    type: ['', [Validators.required]]
  });

  onSubmit() {
    const body = {
      naam: this.storageLocationForm.value.naam,
      deviceType: this.storageLocationForm.value.type
    }
    this.apiSrv.post<storageDevice>(`/storagelocations/household/${this.household_id()}`, body).subscribe({
      next: (data) => {
        console.log(data);
        this.submitted.emit(data);
      },
      error: (err) => {
        console.error(err)
      }
    });
  }


}
