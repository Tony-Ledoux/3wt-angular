import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from "./layout/shared/toaster-component/toaster-component";
import { Modal } from "./layout/shared/modal/modal";
import { FullScreenLoadSpinner } from "@app/layout/shared/full-screen-load-spinner/full-screen-load-spinner";
import { UserService } from './core/services/user/user';
import { DatabaseSettings } from './core/services/config/database-settings';
import { JsonPipe } from '@angular/common';
import { MajorErrorPage } from './layout/pages/major-error-page/major-error-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, Modal, FullScreenLoadSpinner, MajorErrorPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  auth = inject(UserService); // loads the user 
  settings = inject(DatabaseSettings); //loads settings from the database
}
