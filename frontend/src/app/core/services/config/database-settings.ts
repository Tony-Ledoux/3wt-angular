import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { delay, firstValueFrom } from 'rxjs';
import { DynamicConfig } from '@app/core/types/dynamic-config';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DatabaseSettings {
  private api = inject(ApiService);
  private _errors = signal<string[]>([]);
  private _settings = signal<DynamicConfig[] | null>(null);
  readonly settings = this._settings.asReadonly();
  readonly errors = this._errors.asReadonly();


  /**
   * Functie die aangeroepen wordt in app initialize
   * hier is er nog geen toegang tot componenten
   */
  async init(): Promise<void> {
    try {
      const data = await firstValueFrom(this.api.get<DynamicConfig[]>('/settings'));
      this._settings.set(data);
      console.log('database settings geladen', data);
    } catch (err:unknown) {
      console.error(err)
      let errorMessage = 'Er is een onbekende fout opgetreden';
      if(err instanceof HttpErrorResponse){
        errorMessage = `Server fout: ${err.status} - ${err.message}`;
      } else if (err instanceof Error){
        errorMessage = err.message;
      } else if( typeof err === 'string'){
        errorMessage = err;
      }
      
      this._errors.update((p) => [...p, errorMessage]);
    }
  }

  updateSettings(settings: DynamicConfig[]) {

    this._settings.update(p => [...settings])
    this.api.put('/settings/update', this._settings()).subscribe({
      next: (d) => console.log(d)
    })
    console.log(settings);
  }

  getValue(key: string): string | undefined {
    const currentSettings = this.settings() ?? [];
    const settings = currentSettings.find(s => s.key === key);
    return settings?.value;
  }

  getNumber(key: string, defaultValue = 0): number {
    const value = this.getValue(key)
    if (value === undefined) return defaultValue;

    const result = parseInt(value, 10);
    return isNaN(result) ? defaultValue : result;
  }
}
