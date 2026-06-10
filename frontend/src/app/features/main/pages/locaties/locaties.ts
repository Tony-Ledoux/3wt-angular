import { Component, inject } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-locaties',
  imports: [JsonPipe],
  templateUrl: './locaties.html',
  styleUrl: './locaties.css',
})
export class Locaties {
  inventorySrv = inject(InventoryService);
}
