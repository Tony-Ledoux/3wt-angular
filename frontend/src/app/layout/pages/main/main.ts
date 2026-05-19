import { Component,  signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
   // Reactive state using Signals
  isSidebarOpen = signal(true);


  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
