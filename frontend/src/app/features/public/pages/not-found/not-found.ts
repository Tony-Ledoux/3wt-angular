import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/shared/components/button/button';

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  router = inject(Router)

  goToHome(){
    this.router.navigate(['/']);
  }

}
