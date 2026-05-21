import { afterEveryRender, afterNextRender, Component, computed, contentChild, ElementRef, inject, input } from '@angular/core';
import { SectionCardHeader } from '@app/shared/directives/section-card-header';

export type SectionCardType = 'default' | 'danger' | 'dashed';

@Component({
  selector: 'app-section-card',
  imports: [],
  templateUrl: './section-card.html',
  styleUrl: './section-card.css',
})
export class SectionCard {


  private el = inject(ElementRef);
  title = input<string>();
  icon = input<string>();
  type = input<SectionCardType>('default');

  hasAction = contentChild(SectionCardHeader)

  showHeader = computed(() => { return this.title() || this.icon() || this.hasAction() });

  containerClasses = () => {
    const base = 'shadow-sm border rounded-xl p-6 transition-colors mb-2';

    switch (this.type()) {
      case 'danger':
        return `${base} bg-status-danger-light border-status-danger`;
      case 'dashed':
        return `${base} bg-app-card border-app-border border-2 border-dashed`;
      default:
        return `${base} bg-app-card border-app-border`;
    }
  };

  iconContainerClasses = () => {
    const base = 'p-2 rounded-lg';

    switch (this.type()) {
      case 'danger':
        return `${base} bg-status-danger-light text-status-danger`;
      case 'dashed':
        return `${base} bg-brand-primary-light text-brand-primary`;
      default:
        return `${base} bg-brand-secondary-light text-brand-secondary`;
    }
  };


   constructor() {
    console.warn('Tof dat je dit component gebruikt, vergeet niet om de directive "SectionCardHeader" toe te voegen aan je imports of het werkt niet goed!')
  }

  
}
