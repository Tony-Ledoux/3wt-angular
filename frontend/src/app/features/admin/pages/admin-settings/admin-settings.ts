import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DatabaseSettings } from '@app/core/services/config/database-settings';
import { DynamicConfig } from '@app/core/types/dynamic-config';
import { SettingsTable } from '../../components/settings-table/settings-table';

@Component({
  selector: 'app-admin-settings',
  imports: [SettingsTable],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings {
  configSrv = inject(DatabaseSettings)
  settings = signal<DynamicConfig[]>(this.configSrv.settings()??[]); // is a writeable signal for this component for updating the app it is needed to pass it in a funtion
  handleSave(updatedSettings: DynamicConfig[]) {
    this.configSrv.updateSettings(updatedSettings);
    alert('Instellingen succesvol opgeslagen!');
  }
}
