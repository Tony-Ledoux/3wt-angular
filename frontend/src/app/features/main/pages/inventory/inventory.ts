import { Component, inject } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-inventory',
  imports: [JsonPipe],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  inventortSrv = inject(InventoryService);
}
