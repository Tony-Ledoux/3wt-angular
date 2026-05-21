import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pill-component',
  imports: [],
  templateUrl: './pill-component.html',
  styleUrl: './pill-component.css',
})
export class PillComponent {
  label = input.required<string>();
  value = input.required<number | string>();
  variant = input<'emerald' | 'blue' | 'amber' | 'red' | 'slate'>('emerald');
  type = input<'pill' | 'card'>('card');

  get cardStyles() {
    const variants = {
      // Emerald -> Status Success
      emerald: {
        container: 'bg-status-success-light border-status-success text-status-success',
        dot: 'bg-status-success'
      },
      // Blue -> Brand Primary
      blue: {
        container: 'bg-brand-primary-light border-brand-primary text-brand-primary',
        dot: 'bg-brand-primary',
      },
      // Amber -> Brand Accent
      amber: {
        container: 'bg-brand-accent-light border-brand-accent text-brand-accent',
        dot: 'bg-brand-accent',
      },
      // Red -> Status Danger
      red: {
        container: 'bg-status-danger-light border-status-danger text-status-danger',
        dot: 'bg-status-danger',
      },
      // Slate -> App Neutral/Muted
      slate: { 
        container: 'bg-app-bg border-app-border text-app-text-muted', 
        dot: 'bg-app-text-muted' 
      },
    }
    return variants[this.variant()];
  }

  get pillStyles() {
    const variants = {
      // Emerald -> Success
      emerald: { label: 'text-status-success', value: 'bg-status-success text-white' },
      // Blue -> Primary
      blue:    { label: 'text-brand-primary', value: 'bg-brand-primary text-white' },
      // Amber -> Accent
      amber:   { label: 'text-brand-accent', value: 'bg-brand-accent text-white' },
      // Red -> Danger
      red:     { label: 'text-status-danger', value: 'bg-status-danger text-white' },
      // Slate -> Main/Muted
      slate:   { label: 'text-app-text-light', value: 'bg-app-text-main text-white' },
    };
    return variants[this.variant()];
  }
}
