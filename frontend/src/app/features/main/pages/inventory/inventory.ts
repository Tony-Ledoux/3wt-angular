import { Component, computed, inject } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { DatePipe, JsonPipe } from '@angular/common';
import { PageHeader } from "@app/shared/components/page-header/page-header";
import { InventoryItem } from '@app/core/types/inventory-item';
import { SectionCard } from '@app/shared/components/section-card/section-card';
import { SectionCardHeader } from '@app/shared/directives/section-card-header';
import { PillComponent } from '@app/shared/components/pill-component/pill-component';
import { AccordionItem } from '@app/shared/components/Accordion/accordion-item/accordion-item';
import { ButtonComponent } from '@app/shared/components/button/button';
import { ModalService } from '@app/core/services/modal/modal-service';
import { EditForm } from '../../components/inventory/edit-form/edit-form';

export interface StoragelocationGroup {
  storagelocation: {
    id: number;
    name: string;
  };
  expired: InventoryItem[];
  almost_expired: InventoryItem[];
  fresh: InventoryItem[];
}

interface ExpirySection {
  key: 'expired' | 'almost_expired' | 'fresh';
  title: string;
  status: 'danger' | 'warning' | 'success';
}



@Component({
  selector: 'app-inventory',
  imports: [JsonPipe, PageHeader, SectionCard, SectionCardHeader, PillComponent, AccordionItem, ButtonComponent, DatePipe],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  ABOUT_TO_EXPIRE_DAYS = 2;
  MS_PER_DAY = 24 * 60 * 60 * 1000;

  readonly expirySections: ExpirySection[] = [
    { key: 'expired', title: 'Vervallen', status: 'danger' },
    { key: 'almost_expired', title: 'Bijna Vervallen', status: 'warning' },
    { key: 'fresh', title: 'Vers', status: 'success' }
  ];

  inventortSrv = inject(InventoryService);
  modalSrv = inject(ModalService);
  mainCollection = computed<StoragelocationGroup[]>(() => {
    const inventory = this.inventortSrv.inventory();
    const locations = new Map<number, StoragelocationGroup>();
    for (const item of inventory) {
      const storagelocationId = item.storagelocation.id;
      if (!locations.has(storagelocationId)) {
        locations.set(storagelocationId, {
          storagelocation: item.storagelocation,
          expired: [],
          almost_expired: [],
          fresh: [],
        })
      }

      const locationGroup = locations.get(storagelocationId);
      if (!locationGroup) {
        continue;
      }

      const daysUntilExpiry = this.getDaysUntilExpiry(item.expiryDate ?? null);

      if (daysUntilExpiry === null) {
        locationGroup.fresh.push(item);
      } else if (daysUntilExpiry < 0) {
        locationGroup.expired.push(item);
      } else if (daysUntilExpiry <= this.ABOUT_TO_EXPIRE_DAYS) {
        locationGroup.almost_expired.push(item);
      } else {
        locationGroup.fresh.push(item);
      }
    }

    return Array.from(locations.values()).map((location) => ({
      ...location,
      expired: this.sortByExpiryDate(location.expired),
      aboutToExpire: this.sortByExpiryDate(location.almost_expired),
      fresh: this.sortByExpiryDate(location.fresh),
    }));
  })

  private getDaysUntilExpiry(expiryDate: string | null): number | null {
    if (expiryDate === null) {
      return null;
    }

    const today = this.startOfToday();
    const expiry = this.parseDateOnly(expiryDate);

    return Math.ceil((expiry.getTime() - today.getTime()) / this.MS_PER_DAY);
  }

  private sortByExpiryDate(items: InventoryItem[]): InventoryItem[] {
    return [...items].sort((a, b) => {
      if (a.expiryDate === null && b.expiryDate === null) {
        return 0;
      }

      if (a.expiryDate === null) {
        return 1;
      }

      if (b.expiryDate === null) {
        return -1;
      }

      return (
        this.parseDateOnly(a.expiryDate!).getTime() -
        this.parseDateOnly(b.expiryDate!).getTime()
      );
    });
  }

  private parseDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private startOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  handleUseClick(action: string, item: InventoryItem) {
    if (action === 'deleteAll') {
      this.modalSrv.open("Item verwijderen", `Ben je zeker dat je ${item.product.productName} wil verwijderen?`).setType('danger').show();
    }
    if (action === 'use') {
      this.modalSrv.open("Item gebruiken", EditForm).setData({ item, household: this.inventortSrv.hh_id }).show();
    }
  }
}
