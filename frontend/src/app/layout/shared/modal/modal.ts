import { Component, computed, effect, inject, input } from '@angular/core';

import { ButtonComponent } from '@app/shared/components/button/button';
import { CommonModule } from '@angular/common';
import { ModalIcon, ModalService } from '@app/core/modal-service';


@Component({
  selector: 'internal-app-modal',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  protected modalService = inject(ModalService);

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
