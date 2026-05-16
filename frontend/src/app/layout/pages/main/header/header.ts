import { Component, EventEmitter, inject, output } from '@angular/core';
import { UserService } from '@app/core/services/user/user';
import { HouseholdService } from '@app/features/main/services/household-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  user = inject(UserService);
  household_service = inject(HouseholdService);
  
  onToggleSidebar = output<void>();
}
