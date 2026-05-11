import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user/user';

@Component({
  selector: 'app-onboarding',
  imports: [],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding {
  user = inject(UserService);
  
  

}
