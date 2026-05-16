import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { HouseholdService } from '../../services/household-service';
import { ApiService } from '@app/core/services/api/api-service';
import { HouseholdUserType, HouseholdWithUsersType } from '@app/core/types/householdUserType';
import { toSignal } from '@angular/core/rxjs-interop';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { untracked } from '@angular/core/primitives/signals';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from '@app/shared/components/form/checkbox/checkbox';
import { LabeledInput } from "@app/shared/components/form/labeled-input/labeled-input";
import { ButtonComponent } from "@app/shared/components/button/button";
import { JsonPipe } from '@angular/common';
//ToDO: hook up buttons and form
@Component({
  selector: 'app-settings',
  imports: [Spinner, ReactiveFormsModule, Checkbox, LabeledInput, ButtonComponent, JsonPipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  //injects
  private fb = inject(FormBuilder);
  private apiSrv = inject(ApiService);
  householdSrv = inject(HouseholdService);
  //Forms
  householdForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]]
  })
  inviteControl = new FormControl(false)

  //signals
  private sourceS = toSignal(this.apiSrv.get<HouseholdWithUsersType>(`/households/${this.householdSrv.selected_household()?.householdId}`), { initialValue: null })
  detailsS = signal<HouseholdWithUsersType | null>(null)
  isLoadingS = computed(() => {
    return this.detailsS() === null
  })
  private formValuesS = toSignal(this.householdForm.valueChanges, {
    initialValue: this.householdForm.value
  });


  isSaveDisabledS = computed(() => {
    const source = this.detailsS();
    const currentValues = this.formValuesS();
    if (!source || !currentValues) return true;
    const isUnchanged = currentValues.name === source.name && currentValues.address === source.address;
    return this.householdForm.invalid || isUnchanged;
  });

 
  guestS = signal<HouseholdUserType[]>([])


  constructor() {
    effect(() => {
      const source = this.sourceS();
      if (source !== undefined) {
        untracked(() => {
          this.detailsS.set(source)
          this.householdForm.patchValue({ name: source?.name, address: source?.address })
          this.inviteControl.setValue(source?.isOpenForInvite!, { emitEvent: false });
          this.guestS.set(source?.users.filter(u=>u.isowner !== true)!);
        });
      }
    });
    effect(() => {
      const change = this.inviteControl.valueChanges
      change.subscribe({
        next: (d) => {
          console.log(d);
        }
      })
    })
  }

  detailsReset() {
    this.householdForm.patchValue({ name: this.detailsS()?.name, address: this.detailsS()?.address })
  }

  onSubmit() {
    console.log('submitted');
  }

  onRecycleClick() {

  }


}
