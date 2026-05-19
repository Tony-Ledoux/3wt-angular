import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { HouseholdService } from '../../services/household-service';
import { ApiService } from '@app/core/services/api/api-service';
import { Household, HouseholdUserType, HouseholdWithUsersType } from '@app/core/types/householdUserType';
import { toSignal } from '@angular/core/rxjs-interop';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { untracked } from '@angular/core/primitives/signals';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from '@app/shared/components/form/checkbox/checkbox';
import { LabeledInput } from "@app/shared/components/form/labeled-input/labeled-input";
import { ButtonComponent } from "@app/shared/components/button/button";
import { JsonPipe } from '@angular/common';
import { ModalService } from '@app/core/modal-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { Router } from '@angular/router';
import { PageHeader } from "../../components/page-header/page-header";
// TODO Add polling in the future for members of a household
@Component({
  selector: 'app-settings',
  imports: [Spinner, ReactiveFormsModule, Checkbox, LabeledInput, ButtonComponent, PageHeader],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  //injects
  private fb = inject(FormBuilder);
  private apiSrv = inject(ApiService);
  private modalSrv = inject(ModalService);
  private notify = inject(NotifyService);
  private router = inject(Router);
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
          this.guestS.set(source?.users.filter(u => u.isowner !== true)!);
        });
      }
    });
    this.inviteControl.valueChanges.subscribe({
      next: () => {
        const id = this.detailsS()?.id ?? 0;
        this.inviteControl.disable({ emitEvent: false });
        // do the api call
        this.apiSrv.post<Household>(`/households/${id}/toggleinvite`, {}).subscribe({
          next: () => {

          },
          complete: () => {
            this.inviteControl.enable({ emitEvent: false });
          }
        });
        console.log("flipped", this.inviteControl.value, id)
      }
    });
  }

  detailsReset() {
    this.householdForm.patchValue({ name: this.detailsS()?.name, address: this.detailsS()?.address })
  }

  onSubmit() {
    this.apiSrv.put<HouseholdUserType>(`/households/${this.detailsS()?.id}`, this.householdForm.value).subscribe({
      next: (data) => {
        console.log('recieved data', data)
        // update the details
        this.detailsS.update((p) => {
          if (p == null) return p;
          return {
            ...p,
            name: data.householdName,
            address: data.address?? 'onbekend'
          }
        })
        // update the selected signal (witch also updates the available households)
        this.householdSrv.updateSelectedHouseholdDetails(data)
        //notify
  },
  error: (err) => {
        console.error(err);
}
    });
console.log('submitted', this.householdForm.value, this.detailsS());
  }


onRecycleClick() {
  this.modalSrv.open("Code vernieuwen", `<p>Wil je de inviteercode vernieuwen?</p><p class="text-red-500"> Je kan de huidige code dan <strong>niet</strong> meer gebruiken</p>`)
    .setIcon('fa fa-question')
    .setConfirmCallback(() => this.handleRecycleConfirm())
    .show();
}

handleRecycleConfirm(){
  const id = this.detailsS()?.id ?? 0;
  this.apiSrv.post<Household>(`/households/${id}/generateinvitecode`, {}).subscribe({
    next: (d) => {
      this.detailsS.update(p => {
        if (!p) return p;
        return { ...p, inviteCode: d.inviteCode }
      });
      this.notify.success(`invite code bijgewerkt naar <b>${d.inviteCode}</b>`);
    },
    error: (err) => {

    }
  });
}

onRemoveMemberClick(id: string){
  const user = this.detailsS()?.users.find(u => u.id === id)
  this.modalSrv.open("Buitensluiten", `Ben je zeker dat je deze deelnemer <br/> <strong>${user?.email ?? 'onbekend'}</strong><br/> wil uitsluiten?`)
    .setType('danger')
    .setIcon('fa fa-person-circle-minus')
    .setConfirmCallback(() => this.handleMemberRemove(id))
    .show()
  console.log(id);
}

handleMemberRemove(id: string){
  const householdId = this.detailsS()?.id ?? 0;
  this.apiSrv.deleteWithBody(`/households/${householdId}/user`, { id: id }).subscribe({
    next: () => {
      //update the members
      this.guestS.update((p) => p.filter(u => u.id !== id));
    }
  });
  console.log('remove clicked')
}

onRemoveHouseholdClick(id: number){
  const name = this.detailsS()?.name ?? 'onbekend';
  this.modalSrv.open("Verwijderen", `Ben je zeker dat je huishoden <br/> <strong>${name}</strong><br/> wil verwijderen?`)
    .setType('danger')
    .setIcon('fa fa-trash')
    .setConfirmCallback(() => this.RemoveHousehold(id, name))
    .show()
}

RemoveHousehold(id: number, name: string){
  this.apiSrv.delete(`/households/${id}`).subscribe({
    next: () => {
      //clear the selected household
      this.householdSrv.selectHousehold(null);
      // repopulate the signal in the householduser service
      this.householdSrv.loadHouseholds();
      // send a notification
      this.notify.success(`Huishouden ${name} is verwijderd`);
      // redirect
      this.router.navigate(['/onboarding']);
    }
  })
}


}
