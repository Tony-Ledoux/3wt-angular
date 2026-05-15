import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { delay, finalize, switchMap, take, timer } from 'rxjs';
import { ModalService } from '@app/core/modal-service';
import { FullscreenSpinnerService } from '../spinner/fullscreen-spinner-service';
import { DynamicConfig } from '@app/core/types/dynamic-config';

@Injectable({
  providedIn: 'root',
})
export class DatabaseSettings {
  private api = inject(ApiService);
  private modal = inject(ModalService);
  private spinner = inject(FullscreenSpinnerService)
  private _settings = signal<DynamicConfig[] | null>(null);
  readonly settings = this._settings.asReadonly();

  constructor() {
    this.init()
  }

  private init() {
    this.spinner.show();
    console.log('start database settings loading');
    this.api.get<DynamicConfig[]>('/settings')
      .pipe(
        take(1),
        delay(1000),
        finalize(() => this.spinner.hide())
      ).subscribe({
        next: (data) => {
          this._settings.set(data);
          console.log('database settings geladen ', data)
        },
        error: (err) => {
          this.modal.open('Error', 'Kon dynamische settings niet ophalen, contacteer de administrator')
            .setType('danger')
            .setIcon('fa fa-bomb')
            .setConfirmText("oké")
            .setCloseBackdropClick(false)
            .setCancelActionButton(false)
            .setConfirmCallback(() => window.location.reload()) //destroys the angular app
            .show();
          console.error(err);
        }
      });
  }
}
