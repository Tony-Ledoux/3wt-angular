import { Component, inject, OnInit } from '@angular/core';
import { HouseholdService } from '../../services/household-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  householdSrv = inject(HouseholdService)


  ngOnInit(): void {
    console.log(this.householdSrv.selected_household()); //returns true?
  }
}
