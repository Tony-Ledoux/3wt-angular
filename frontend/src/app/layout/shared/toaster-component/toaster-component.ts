import { Component, inject } from '@angular/core';
import { NotifyService, ToastType } from '@app/core/services/notify/notify-service';

@Component({
  selector: 'internal-app-toaster-component',
  imports: [],
  templateUrl: './toaster-component.html',
  styleUrl: './toaster-component.css',
})
export class ToasterComponent {
  toastService = inject(NotifyService);

  getTypeClasses(type: ToastType): string {
    const base = 'border-l-4';
    const types = {
      // Succes: Gebruikt status-success en status-success-light
      success: `${base} bg-status-success-light border-status-success text-status-success`,
      
      // Error: Gebruikt status-danger en status-danger-light
      error: `${base} bg-status-danger-light border-status-danger text-status-danger`,
      
      // Warning: Gebruikt brand-accent en brand-accent-light
      warning: `${base} bg-brand-accent-light border-brand-accent text-brand-accent`,
      
      // Info: Gebruikt brand-primary en brand-primary-light
      info: `${base} bg-brand-primary-light border-brand-primary text-brand-primary`,
    };
    return types[type];
  }

  getDefaultIcon(type: ToastType): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
    };
    return icons[type];
  }

  getProgressBarColor(type: ToastType): string {
    const colors = {
      success: 'bg-status-success',
      error: 'bg-status-danger',
      warning: 'bg-brand-accent',
      info: 'bg-brand-primary',
    };
    return colors[type];
  }
}
