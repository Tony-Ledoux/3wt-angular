import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit, OnDestroy {
  menuOpen = signal<boolean>(false);
  private static instances: Menu[] = [];

  ngOnInit(): void {
    Menu.instances.push(this);
  }
  ngOnDestroy(): void {
    const index = Menu.instances.indexOf(this);
    if (index > -1) {
      Menu.instances.splice(index, 1);
    }
  }
  toggleMenu() {
    const newState = !this.menuOpen();

    // Als we het menu openen, sluiten we eerst alle andere menu's
    if (newState) {
      Menu.closeAllMenusExcept(this);
    }

    this.menuOpen.set(newState);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  private static closeAllMenusExcept(exception: Menu) {
    this.instances.forEach(instance => {
      if (instance !== exception) {
        instance.closeMenu();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.inline-block')) {
      this.closeMenu();
    }
  }
  static closeAllMenus() {
    this.instances.forEach(instance => {
      instance.closeMenu();
    });
  }
}