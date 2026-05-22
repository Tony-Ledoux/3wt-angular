import { Component, ComponentRef, computed, effect, EventEmitter, inject, input, viewChild, ViewChild, ViewContainerRef } from '@angular/core';

import { ButtonComponent } from '@app/shared/components/button/button';
import { CommonModule } from '@angular/common';
import { ModalIcon, ModalService } from '@app/core/services/modal/modal-service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'internal-app-modal',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  protected modalService = inject(ModalService);
  private contentContainer = viewChild('modalContent', { read: ViewContainerRef });
  private componentRef:ComponentRef<any> | null = null;
  private eventSubscriptions = new Subscription();
  protected componentContent = computed(() => {
    const content = this.modalService.state().content;
    return typeof content !== 'string' ? content : null;
  });
  showActionButton = computed(() => this.modalService.state().showActionButton);
  showCancelButton = computed(() => this.modalService.state().showCancelButton);
  protected iconComponent = computed(() => {
    const icon = this.modalService.state().icon;
    // In TypeScript is een Component-klasse een functie
    return typeof icon === 'function' ? icon : null;
  });

  // Computed styling op basis van het type - AANGEPAST NAAR NIEUWE THEME
  theme = computed(() => {
    const themes = {
      default: {
        header: 'text-app-text-main',
        bgLight: 'bg-brand-primary-light', // Lichte brand primary achtergrond
        accent: 'text-brand-primary',      // Primaire brand kleur
        buttonVariant: 'primary' as const,
        icon: this.modalService.state().icon
      },
      danger: {
        header: 'text-status-danger',
        bgLight: 'bg-status-danger-light', // Lichte danger achtergrond
        accent: 'text-status-danger',      // Danger kleur
        buttonVariant: 'danger' as const,
        icon: this.modalService.state().icon
      },
      success: {
        header: 'text-status-success',
        bgLight: 'bg-status-success-light', // Lichte success achtergrond
        accent: 'text-status-success',      // Success kleur
        buttonVariant: 'success' as const,
        icon: this.modalService.state().icon
      }
    };
    return themes[this.modalService.state().type];
  });

  isComponentIcon(icon: ModalIcon): boolean {
    return typeof icon === 'function';
  }

  isClassIcon(icon: ModalIcon): boolean {
    if (typeof (icon) !== 'string') return false;
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    return !emojiRegex.test(icon);
  }

  constructor() {
    // Effect om de component dynamisch aan te maken/verwijderen
    effect(() => {
      const state = this.modalService.state();
      const content = state.content;
      const container = this.contentContainer();
      if(state.isOpen && typeof content !== 'string' && container){
        this.loadComponent(content, container);
      }else if(!state.isOpen){
        this.destroyComponent();
      }
    });

    effect(() => {
      if (this.modalService.state().isOpen) {
        // Zet scrollen uit op de body
        document.body.style.overflow = 'hidden';
      } else {
        // Zet scrollen weer aan
        document.body.style.overflow = 'auto';
      }
    });
  }

  private loadComponent(componentType: any, container: ViewContainerRef) {
    this.destroyComponent(); // Opruimen voor we een nieuwe laden
    container.clear();
    this.componentRef = container.createComponent(componentType);
    const instance = this.componentRef.instance;

    const state = this.modalService.state();
    if(state.data){
      this.componentRef.setInput('data', state.data);
    }
    if (state.onEvent) {
      Object.keys(instance).forEach(key => {
        const property = instance[key];
        // Check of de property bestaat en een subscribe methode heeft (werkt voor EventEmitter en OutputEmitterRef)
        if (property && typeof property.subscribe === 'function') {
          const sub = property.subscribe((data: any) => {
            state.onEvent!(key, data);
          });
          this.eventSubscriptions.add(sub);
        }
      });
    }
  }

  private destroyComponent() {
    this.eventSubscriptions.unsubscribe();
    this.eventSubscriptions = new Subscription();
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  handleBackdropClick() {
    if (this.modalService.state().closeOnBackdropClick) {
      this.modalService.close();
    }
  }

  isComponent(): boolean {
    return this.componentContent() !== null;
  }

  confirmAction() {
    this.modalService.confirm();
  }
}
