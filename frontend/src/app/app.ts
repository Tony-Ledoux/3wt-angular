import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from "./layout/toaster-component/toaster-component";
import { Modal } from "./layout/modal/modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // 
}
