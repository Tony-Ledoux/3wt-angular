import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  menuOpen = signal<boolean>(false);
  
  // Toggle functie
toggleMenu() {
  this.menuOpen.update(v => !v);
}

// Sluit menu bij klikken elders
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('[class*="relative inline-block"]')) {
    this.menuOpen.set(false);
  }
}
}
