//toaster-component.ts
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
      success: `${base} bg-green-100 border-green-500 text-green-800`,
      error: `${base} bg-red-100 border-red-500 text-red-800`,
      warning: `${base} bg-yellow-100 border-yellow-500 text-yellow-800`,
      info: `${base} bg-blue-100 border-blue-500 text-blue-800`,
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
  // Voeg deze methode toe aan ToasterComponent
getProgressBarColor(type: ToastType): string {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600',
  };
  return colors[type];
}
}
