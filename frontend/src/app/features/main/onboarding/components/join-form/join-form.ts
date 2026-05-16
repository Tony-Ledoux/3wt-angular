import { Component, inject, signal } from '@angular/core';
import { LabeledInput } from "@app/shared/components/form/labeled-input/labeled-input";
import { ButtonComponent } from "@app/shared/components/button/button";
import { ModalService } from '@app/core/modal-service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { HouseholdService } from '@app/features/main/services/household-service';

@Component({
  selector: 'app-join-form',
  imports: [LabeledInput, ButtonComponent, FormsModule],
  templateUrl: './join-form.html',
  styleUrl: './join-form.css',
})
export class JoinForm {
  private householdService = inject(HouseholdService);
  modal = inject(ModalService);
  form=signal({name:null,invite:null})

  onSubmit(){
    const name = this.form().name ?? '';
    const code = this.form().invite?? '';
    this.householdService.joinHousehold(name,code);
  }
}
