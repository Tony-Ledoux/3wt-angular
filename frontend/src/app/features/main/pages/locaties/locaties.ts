import { Component, computed, inject, signal } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { JsonPipe } from '@angular/common';
import { deviceDTO, deviceWithInventory } from '@app/core/types/device';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { SectionCard } from '@app/shared/components/section-card/section-card';

@Component({
  selector: 'app-locaties',
  imports: [JsonPipe, PageHeader, SectionCard],
  templateUrl: './locaties.html',
  styleUrl: './locaties.css',
})
export class Locaties {
  inventorySrv = inject(InventoryService);
  devices = computed(() => this.inventorySrv.inventory());
}
