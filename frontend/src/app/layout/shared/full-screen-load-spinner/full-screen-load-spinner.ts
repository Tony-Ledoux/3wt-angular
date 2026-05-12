import { Component, inject } from '@angular/core';
import { FullscreenSpinnerService } from '@app/core/services/spinner/fullscreen-spinner-service';

@Component({
  selector: 'app-full-screen-load-spinner',
  imports: [],
  templateUrl: './full-screen-load-spinner.html',
  styleUrl: './full-screen-load-spinner.css',
})
export class FullScreenLoadSpinner {
  spinner = inject(FullscreenSpinnerService);
  
}
