import { Component, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { ModalService } from '@app/core/services/modal/modal-service';

import { HouseholdService } from '@app/features/main/services/household-service';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { ButtonComponent } from "@app/shared/components/button/button";


@Component({
  selector: 'app-create-household',
  imports: [FormsModule, LabeledInput, ButtonComponent],
  templateUrl: './create-household.html',
  styleUrl: './create-household.css',
})
export class CreateHousehold {
  private modal = inject(ModalService);
  private service = inject(HouseholdService)
  form= signal({name:null, address:null })
  errors = signal<any[]>([]);
 
  onSubmit(){
    const name = this.form().name;
    const address = this.form().address;
    if(name && address){
      this.service.createHoushold(name,address);
    }
    this.cancel();
  }

  cancel() {
    this.modal.close();
  }
}
