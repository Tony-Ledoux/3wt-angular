import { Component, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { ModalService } from '@app/core/modal-service';
import { FullscreenSpinnerService } from '@app/core/services/spinner/fullscreen-spinner-service';

@Component({
  selector: 'app-create-household',
  imports: [FormsModule],
  templateUrl: './create-household.html',
  styleUrl: './create-household.css',
})
export class CreateHousehold {
  private spinner = inject(FullscreenSpinnerService);
  private modal = inject(ModalService);
  householdName = signal('');

  async create() {
    const name = this.householdName();
    if (!name) return;

    this.spinner.show();
    try {
      //await this.householdService.createHousehold(name);
      console.log(this.householdName());
      this.modal.open('Succes!', 'Je huishouden is succesvol aangemaakt.');
      this.modal.close(); // Sluit de huidige create-modal
    } catch (error) {
      this.modal.open('Error', 'Er ging iets mis bij het aanmaken.');
    } finally {
      this.spinner.hide();
    }
  }

  cancel() {
    this.modal.close();
  }
}
