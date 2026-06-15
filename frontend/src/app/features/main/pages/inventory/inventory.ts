import { Component, inject } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { JsonPipe } from '@angular/common';
import { PageHeader } from "@app/shared/components/page-header/page-header";

@Component({
  selector: 'app-inventory',
  imports: [JsonPipe, PageHeader],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  inventortSrv = inject(InventoryService);
}
