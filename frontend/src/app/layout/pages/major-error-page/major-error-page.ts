import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-major-error-page',
  imports: [],
  templateUrl: './major-error-page.html',
  styleUrl: './major-error-page.css',
})
export class MajorErrorPage {

 reload() { window.location.reload(); }

}
