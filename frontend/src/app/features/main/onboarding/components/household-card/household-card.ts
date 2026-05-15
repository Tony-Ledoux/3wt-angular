import { Component, EventEmitter, input, output } from '@angular/core';
import { HouseholdUserType } from '@app/core/types/householdUserType';
import { IconComponent } from "@app/shared/components/icon-component/icon-component";

@Component({
  selector: 'app-household-card',
  imports: [IconComponent],
  templateUrl: './household-card.html',
  styleUrl: './household-card.css',
})
export class HouseholdCard {
  household = input.required<HouseholdUserType>();
  isSelected = input<boolean>(false);
  select = output<number>();
  

  onCardClick(){
    this.select.emit(this.household().householdId);
  }
}
