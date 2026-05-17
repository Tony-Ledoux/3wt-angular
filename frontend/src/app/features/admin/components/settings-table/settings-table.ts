import { Component, input, output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicConfig } from '@app/core/types/dynamic-config';

@Component({
  selector: 'app-settings-table',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings-table.html',
})
export class SettingsTable {
   settings = input.required<DynamicConfig[]>();
  saveRequested = output<DynamicConfig[]>();

  // We vervangen de computed door een gewoon signal dat we handmatig updaten
  isFormValid = signal(true);

  // Deze methode wordt aangeroepen bij elke toetsaanslag/wijziging
  onValueChange() {
    const allValid = this.settings().every(s => this.validateSetting(s) === null);
    this.isFormValid.set(allValid);
  }

  validateSetting(setting: DynamicConfig): string | null {
    const val = setting.value?.trim();

    if (!val || val.length === 0) {
      return 'Dit veld is verplicht';
    }

    if (this.isNumericSetting(setting)) {
      if (isNaN(Number(val))) {
        return 'Alleen cijfers zijn toegestaan';
      }
    }

    return null;
  }

  private isNumericSetting(setting: DynamicConfig): boolean {
    const numericKeywords = ['Max', 'Limit', 'Count', 'Length'];
    return numericKeywords.some(kw => setting.key.includes(kw));
  }

  onSave() {
    if (this.isFormValid()) {
      this.saveRequested.emit(this.settings());
    }
  }
}
