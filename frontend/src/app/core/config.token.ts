// config.token.ts
import { InjectionToken } from '@angular/core';
import { AppConfig } from './types/app-config';
export const RUNTIME_CONFIG = new InjectionToken<AppConfig>('RUNTIME_CONFIG');