import { Component, input, output } from '@angular/core';
import { HouseholdUserType } from '@app/core/types/householdUserType';

@Component({
  selector: 'app-household-management-card',
  imports: [],
  templateUrl: './household-management-card.html',
  styleUrl: './household-management-card.css',
})
export class HouseholdManagementCard {
// Inputs via Signals
  household = input.required<HouseholdUserType>();
  isSelected = input<boolean>(false);

  // Outputs via modern output()
  select = output<number>();
  leave = output<number>();
  remove = output<number>();

  onCardClick() {
    this.select.emit(this.household().householdId);
  }

  onLeaveClick(event: Event) {
    event.stopPropagation(); // Essentieel: voorkom dat de kaart ook 'geselecteerd' wordt
    this.leave.emit(this.household().householdId);
  }

  onRemoveClick(event: Event){
    event.stopPropagation();
    this.remove.emit(this.household().householdId);
  }
}
