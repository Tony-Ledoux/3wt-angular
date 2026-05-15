import { Component, inject, OnInit } from '@angular/core';
import { HouseholdService } from '../../services/household-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  household_service = inject(HouseholdService)


  ngOnInit(): void {
    console.log(this.household_service.selected_household()); //returns true?
  }
}
