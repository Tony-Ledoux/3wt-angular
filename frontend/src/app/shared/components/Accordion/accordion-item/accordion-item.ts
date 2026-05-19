import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  standalone: true, 
  imports: [],
  templateUrl: './accordion-item.html',
  styleUrl: './accordion-item.css',
})
export class AccordionItem {
  status = input<'primary' | 'success' | 'warning' | 'danger' | 'neutral'>('neutral');
  
  statusStyles = computed(() => {
    const status = this.status();

    const mappings = {
      primary: {
        border: 'border-brand-primary',
        header: 'bg-brand-primary-light text-brand-primary-dark',
        badge: 'bg-brand-primary text-white'
      },
      success: {
        border: 'border-status-success',
        header: 'bg-status-success-light text-status-success',
        badge: 'bg-status-success text-white'
      },
      warning: {
        border: 'border-brand-accent',
        header: 'bg-brand-accent-light text-brand-accent',
        badge: 'bg-brand-accent text-white'
      },
      danger: {
        border: 'border-status-danger',
        header: 'bg-status-danger-light text-status-danger',
        badge: 'bg-status-danger text-white'
      },
      neutral: {
        border: 'border-app-border',
        header: 'bg-app-bg text-app-text-main',
        badge: 'bg-app-border-dark text-app-text-body'
      }
    };

    return mappings[status] || mappings.neutral;
  });
  
  isOpen = model(false); 
  title = input<string>('Default');
  badge = input<number>(0);
  icon = input<string>('△');
  hasBadge = input<boolean>(false);

  toggle() {
    this.isOpen.update(value => !value);
  }
}
