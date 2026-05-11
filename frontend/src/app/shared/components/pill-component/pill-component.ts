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
  variant = input<'emerald' | 'blue' | 'amber' | 'red'| 'slate'>('emerald');
  type = input<'pill' | 'card'>('card');

  get cardStyles() {
    const variants = {
      emerald: {
        container: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        dot: 'bg-emerald-500'
      },
      blue: {
        container: 'bg-blue-50 border-blue-100 text-blue-700',
        dot: 'bg-blue-500',
      },
      amber: {
        container: 'bg-amber-50 border-amber-100 text-amber-700',
        dot: 'bg-amber-500',
      },
      red: {
        container: 'bg-red-50 border-red-100 text-red-700',
        dot: 'bg-red-500',
      },
      slate: { 
        container: 'bg-slate-50 border-slate-100 text-slate-700', 
        dot: 'bg-slate-500' 
      },
    }
    return variants[this.variant()];
  }

  get pillStyles() {
    const variants = {
      slate:   { label: 'text-slate-400', value: 'bg-slate-900 text-white' },
      emerald: { label: 'text-emerald-400', value: 'bg-emerald-900 text-white' },
      blue:    { label: 'text-blue-400', value: 'bg-blue-900 text-white' },
      amber:   { label: 'text-amber-400', value: 'bg-amber-900 text-white' },
      red:    { label: 'text-red-400', value: 'bg-red-900 text-white' },
    };
    return variants[this.variant()];
  }
}
