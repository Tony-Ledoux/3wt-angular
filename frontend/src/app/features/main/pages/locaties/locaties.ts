import { Component, computed, inject, signal } from '@angular/core';
import { InventoryService } from '../../services/inventory-service';
import { JsonPipe } from '@angular/common';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { SectionCard } from '@app/shared/components/section-card/section-card';
import { PillComponent } from '@app/shared/components/pill-component/pill-component';
import { SectionCardHeader } from "@app/shared/directives/section-card-header";
import { ButtonComponent } from '@app/shared/components/button/button';
import { NoDeviceFound } from "@app/shared/images/no-device-found/no-device-found";
import { ModalService } from '@app/core/services/modal/modal-service';
import { AddStoragelocationForm } from '../../components/add-storagelocation-form/add-storagelocation-form';
import { storageDevice } from '@app/core/types/device';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locaties',
  imports: [JsonPipe, PageHeader, SectionCard, PillComponent, SectionCardHeader, ButtonComponent, NoDeviceFound],
  templateUrl: './locaties.html',
  styleUrl: './locaties.css',
})
export class Locaties {
  private routerSrv = inject(Router);
  inventorySrv = inject(InventoryService);
  devices = computed(() => this.inventorySrv.household_devices());
  private notifySrv = inject(NotifyService);
  private modalSrv = inject(ModalService)
  
  get_icon(deviceType: number): string {
    switch (deviceType) {
      case 1:
        return 'fa fa-icicles text-brand-primary';
      case 2:
        return 'fa fa-temperature-low text-brand-primary';
      default:
        return 'fa fa-jar text-brand-primary'
    }
  }

  get_inventory_count(dev:storageDevice){
    const inventory = this.inventorySrv.inventory().filter(x=>x.storagelocation.id === dev.id);
    return inventory.length;
  }

  handleNewStorageLocationClick() {
    this.modalSrv.open("Oplaglocatie toevoegen", AddStoragelocationForm)
      .setCloseBackdropClick(false)
      .setShowActionButton(false)
      .setData(
        {
          choices: this.inventorySrv.deviceOptionList,
          exitsting: this.devices(),
          household_id: this.inventorySrv.hh_id
        })
      .setEventCallback((eventName, data: storageDevice) => {
        if (eventName === "submitted") {
          // update the devicelist
          this.inventorySrv.addStorageDevice(data);
          //close modal
          this.modalSrv.close();
        }
      })
      .show()
  }

  handleStorageLocationRemoveClick(id:number){
    const device = this.devices().find(x=>x.id ===id)!;
    this.modalSrv.open("opslaglocatie verwijderen?",`Ben je zeker dat je <strong>${device?.name}</strong> wil verwijderen?`)
      .setType('danger')
      .setIcon('fa fa-dumpster-fire')
      .setConfirmText(`Ja, ${device?.name} verwijderen`)
      .setConfirmCallback(()=>{
        this.inventorySrv.removeStorageDevice(device);
      })
      .show();
  }
  handleClickOnInventory(){
    this.modalSrv.open("Naar inventaris?","Wil je naar de inventaris?")
    .setConfirmCallback(()=>{
      this.routerSrv.navigate(['app','inventory']);
    })
    .show();
  }
}
