import { Component, computed, effect, inject, input } from '@angular/core';

import { ButtonComponent } from '../../shared/components/button/button';
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
    const content = this.modalService.content();
    return typeof content !== 'string' ? content : null;
  });
  showActionButton = computed(() => this.modalService.showActionButton());
  showCancelButton = computed(() => this.modalService.showCancelButton());
  protected iconComponent = computed(() => {
    const icon = this.modalService.icon();
    // In TypeScript is een Component-klasse een functie
    return typeof icon === 'function' ? icon : null;
  });

  // Computed styling op basis van het type
  theme = computed(() => {
    const themes = {
      default: {
        header: 'text-slate-900',
        bgLight: 'bg-blue-50', // Subtiele blauwe tint
        accent: 'text-blue-600',
        buttonVariant: 'primary' as const,
        icon: this.modalService.icon()
      },
      danger: {
        header: 'text-red-700',
        bgLight: 'bg-red-50', // Subtiele rode tint
        accent: 'text-red-600',
        buttonVariant: 'danger' as const,
        icon: this.modalService.icon()
      },
      success: {
        header: 'text-green-700',
        bgLight: 'bg-green-50', // Subtiele groene tint
        accent: 'text-green-600',
        buttonVariant: 'secondary' as const,
        icon: this.modalService.icon()
      }
    };
    return themes[this.modalService.type()];
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
      if (this.modalService.isOpen()) {
        // Zet scrollen uit op de body
        document.body.style.overflow = 'hidden';
      } else {
        // Zet scrollen weer aan
        document.body.style.overflow = 'auto';
      }
    });
  }

  handleBackdropClick() {
    if (this.modalService.closeOnBackdropClick()) {
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
