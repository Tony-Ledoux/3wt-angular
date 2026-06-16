import { Component, computed, inject, OnInit } from '@angular/core';
import { HouseholdService } from '../../services/household-service';
import { InventoryService } from '../../services/inventory-service';
import { InventoryItem } from '@app/core/types/inventory-item';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { SectionCard } from '@app/shared/components/section-card/section-card';
import { SectionCardHeader } from '@app/shared/directives/section-card-header';
import { PillComponent } from '@app/shared/components/pill-component/pill-component';
import { ButtonComponent } from '@app/shared/components/button/button';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeader, SectionCard, SectionCardHeader, PillComponent, ButtonComponent, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard {
  ABOUT_TO_EXPIRE_DAYS = 3
  private inventorySrv = inject(InventoryService);
  private routerSrv = inject(Router);
  numDevices = computed<number>(() => {
    const devices = this.inventorySrv.household_devices();
    return devices.length;
  })
  numItems = computed<number>(() => this.inventorySrv.inventory().length)
  expired = computed<InventoryItem[]>(() => this.inventorySrv.inventory().filter(item => {
    if (!item.expiryDate) return false;
    const date = this.parseDateOnly(item.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }))
  almostExpired = computed<InventoryItem[]>(() => this.inventorySrv.inventory().filter(item => {
    if (!item.expiryDate) return false;
    const date = this.parseDateOnly(item.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + this.ABOUT_TO_EXPIRE_DAYS); // change 3 to any number of days
    return date >= today && date <= cutoff;
  }));

  private parseDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  goToInventory(){
    this.routerSrv.navigate(['app', 'inventory'])
  }
}
