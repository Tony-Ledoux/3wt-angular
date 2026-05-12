import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from "./layout/shared/toaster-component/toaster-component";
import { Modal } from "./layout/shared/modal/modal";
import { FullScreenLoadSpinner } from "@app/layout/shared/full-screen-load-spinner/full-screen-load-spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, Modal, FullScreenLoadSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // 
}
