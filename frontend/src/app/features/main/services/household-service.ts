import { computed, inject, Injectable, signal } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { FullscreenSpinnerService } from '@app/core/services/spinner/fullscreen-spinner-service';
import { HouseholdUserType } from '@app/core/types/householdUserType';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {
  private api = inject(ApiService);
  private modal = inject(ModalService);
  private notify = inject(NotifyService);
  private spinner = inject(FullscreenSpinnerService)
  private _households = signal<HouseholdUserType[] | null>(null); //read-write
  households = this._households.asReadonly();
  private _selected_household = signal<HouseholdUserType | null>(null);
  readonly selected_household = this._selected_household.asReadonly();
  num_households = computed<number>(() => {
    const data = this.households();
    if (data === null) return -1;
    return data.length
  })

  constructor() { // this class a singleton because it is provided in the root and lives for the full duration of the app.
    this.loadHouseholds();
  }

  private loadHouseholds() {
    this.api.get<HouseholdUserType[]>('/users/me').pipe(take(1)).subscribe({
      next: (data) => {
        this._households.set(data);
      },
      error: (err) => {
        this.modal.open('Error', 'Er gebeurde een fout, pobeer opniew')
          .setType('danger')
          .setIcon('fa fa-bomb')
          .setConfirmText("oké")
          .setCloseBackdropClick(false)
          .setCancelActionButton(false)
          .setConfirmCallback(()=>window.location.reload()) //nuclear option this destroys and reloads the whole app
          .show();
        console.error(err);
      }
    });
  }

  selectHousehold(index: number): void {
    const households = this.households()
    console.log(households)
    if (households === null) return;
    if (index < -1 || index >= this.num_households()) return;
    if (index === -1) {
      //unset the selected household
      this._selected_household.set(null);
    } else {
      this._selected_household.set(households[index])
    }
  }

  createHoushold(name: string, address: string) {
    this.api.post<HouseholdUserType>('/setup', { name, address })
      .pipe(take(1))
      .subscribe({
        next: (val)=>{
          this.notify.success(`${val.householdName} is aangemaakt`)
          //update housholds
          this._households.update((p)=>{return[...(p??[]),val]})
        },
        error:(err)=>{
          this.notify.error('er gebeurde een fout',5000)
        }
      });
  }

}
