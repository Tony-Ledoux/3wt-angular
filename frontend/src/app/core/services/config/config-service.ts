import { computed, inject, Injectable } from '@angular/core';
import { RUNTIME_CONFIG } from '../../config.token';
import { Auht0Config } from '../../types/app-config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _settings = inject(RUNTIME_CONFIG); // wordt statisch gezet tijdens boot
  
  readonly isLoaded = computed(() => this._settings !== null);
  readonly hasApiUrl = computed(()=> !!this._settings?.api?.url) // !! converts to strickt boolean so null, '' are false
  readonly hasAuth0= computed(()=>!!this._settings?.auth0?.domain && !!this._settings?.auth0?.client_id && !!this._settings.auth0.audience && !! this._settings.auth0.roleClaims)
  readonly hasAppMeta   = computed(() => !!this._settings?.app?.name);

  readonly validationErrors = computed(() => {
    const errors: string[] = [];
    if (!this.hasApiUrl())  errors.push('Missing api.url');
    if (!this.hasAuth0())   errors.push('Missing data in app.auth0');
    if (!this.hasAppMeta()) errors.push('Missing app.name');
    return errors;
  });

  readonly isValid = computed(() => this.validationErrors().length === 0);



  get apiUrl(): string|null{
    return this._settings?.api?.url;
  }

  get auth0(): Auht0Config|null{
    return this._settings?.auth0;
  }
  
  get appName(): string {
    return this._settings?.app?.name ?? 'undefiened';
  }

  get appVersion():string {
    return this._settings?.app?.version ?? 'V0.0';
  }
}
