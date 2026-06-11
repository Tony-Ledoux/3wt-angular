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

@Component({
  selector: 'app-locaties',
  imports: [JsonPipe, PageHeader, SectionCard, PillComponent, SectionCardHeader, ButtonComponent, NoDeviceFound],
  templateUrl: './locaties.html',
  styleUrl: './locaties.css',
})
export class Locaties {
  inventorySrv = inject(InventoryService);
  devices = computed(() => this.inventorySrv.household_devices());
  private modalSrv = inject(ModalService)
  get_icon(deviceType:number):string{
    switch(deviceType) {
      case 1:
        return 'fa fa-icicles text-brand-primary';
      case 2:
        return 'fa fa-temperature-low text-brand-primary';
      default:
        return 'fa fa-jar text-brand-primary'
    }
  }

  handleNewStorageLocationClick(){
    this.modalSrv.open("Oplaglocatie toevoegen", AddStoragelocationForm)
    .setCloseBackdropClick(false)
    .setShowActionButton(false)
    .setData({choices:this.inventorySrv.deviceOptionList, exitsting:this.devices()})
    .show()
  }
}
