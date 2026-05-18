import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { ApiService } from '@app/core/services/api/api-service';
import { DatabaseSettings } from '@app/core/services/config/database-settings';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { FullscreenSpinnerService } from '@app/core/services/spinner/fullscreen-spinner-service';
import { Household, HouseholdUserType, HouseholdWithUsersType } from '@app/core/types/householdUserType';
import { catchError, finalize, lastValueFrom, take } from 'rxjs';
import { CreateHousehold } from '../onboarding/components/create-household/create-household';
import { JoinForm } from '../onboarding/components/join-form/join-form';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {
  private readonly STORAGE_KEY = 'selected_household_id';
  private api = inject(ApiService);
  private settings = inject(DatabaseSettings);
  private modal = inject(ModalService);
  private notify = inject(NotifyService);
  private _households = signal<HouseholdUserType[] | null>(null); //read-write
  households = this._households.asReadonly();
  private _selected_household = signal<HouseholdUserType | null>(null);
  readonly selected_household = this._selected_household.asReadonly();
  num_households = computed<number>(() => {
    const data = this.households() ?? [];
    return data.length
  })

  num_owner_of_households = computed(() => {
    const households = this.households() ?? []
    return households.filter(h => h.isowner).length ?? 0
  });

  houshold_slots_left = computed(() => {
    return this.settings.getNumber("MaxHouseholdsPerUser", 1) - this.num_households()
  });

  canCreateHousehold = computed(() => {
    const owned = this.num_owner_of_households();
    const total = this.num_households();

    const maxOwned = this.settings.getNumber("MaxUserOwns", 2);
    const maxTotal = this.settings.getNumber("MaxHouseholdsPerUser", 5);

    console.log(`Check: Owned(${owned}/${maxOwned}) Total(${total}/${maxTotal})`);

    return owned < maxOwned && total < maxTotal;
  })

  canJoinHouseholds = computed(() => {
    const total = this.num_households();
    const maxTotal = this.settings.getNumber("MaxHouseholdsPerUser", 5);
    return total < maxTotal
  });

  readonly isOwner = computed(() => {
    return this.selected_household()?.isowner ?? false;
  })


  constructor() { // this class a singleton because it is provided in the root and lives for the full duration of the app.
    this.loadHouseholds();
  }

  // function used by Guard
  async validateSelectedHoushold() {
    const storeId = localStorage.getItem(this.STORAGE_KEY);
    if (!storeId) {
      return false;
    }
    try {
      const val = await lastValueFrom(this.api.get<HouseholdUserType>(`/users/households/${storeId}`));
      this._selected_household.set(val)
      return true
    } catch (error) {
      this.notify.error("Jij bent geen lid van dit huishouden", 5000, false);
      //clear the localStorage
      localStorage.removeItem(this.STORAGE_KEY);
      return false;
    }
  }

   loadHouseholds() {
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
          .setConfirmCallback(() => window.location.reload()) //nuclear option this destroys and reloads the whole app
          .show();
        console.error(err);
      }
    });
  }

  selectHousehold(householdId: number | null): void {
    const households = this.households()
    if (households === null || householdId === null) {
      this._selected_household.set(null);
      localStorage.removeItem(this.STORAGE_KEY);
      return;

    }
    const household = households.find(h => h.householdId === householdId);
    if (household) {
      console.log(household)
      this._selected_household.set(household);
      localStorage.setItem(this.STORAGE_KEY, householdId.toString())
    } else {
      this._selected_household.set(null);
      localStorage.removeItem(this.STORAGE_KEY);
    }

  }

  updateSelectedHouseholdDetails(data:HouseholdUserType){
    this._selected_household.update(p=>{
      if(p === null) return p;
      return {
        ...p,
        householdName:data.householdName,
        address: data.address
      } 
    })
    this.loadHouseholds();
  }

  leaveHouseHold(id: number) {
    console.log("leave clicked", id)
    const householdName = this.households()?.find(h => h.householdId === id)?.householdName ?? "";
    this.api.delete(`/users/households/${id}`).pipe(take(1)).subscribe({
      next: () => {
        this._households.update(p => p?.filter(h => h.householdId !== id) ?? []);
        this.notify.success(`huishouden ${householdName} is verwijderd`)
      },
      error: (err) => {
        this.notify.error("er liep iets fout")
      }
    })
  }

  createHoushold(name: string, address: string) {
    this.api.post<HouseholdUserType>('/users/setup', { name, address })
      .pipe(take(1))
      .subscribe({
        next: (val) => {
          this.notify.success(`${val.householdName} is aangemaakt`)
          //update housholds
          this._households.update((p) => { return [...(p ?? []), val] })
        },
        error: (err) => {
          this.notify.error('er gebeurde een fout', 5000)
        }
      });
  }

  joinHousehold(name: string, invite: string) {

    this.api.post<HouseholdUserType>('/users/households/join', { name, inviteCode: invite })
      .pipe(take(1), finalize(() => { this.modal.close() }))
      .subscribe({
        next: (resp) => {
          this.notify.success(`Je bent toegevoegd aan huishouden ${resp.householdName}`)
          //update the households
          this._households.update((p) => [...(p ?? []), resp])
        },
        error: (err) => {
          //check if 404 or 409
          if (err instanceof (HttpErrorResponse)) {
            this.notify.error(`${err.error}`, 5000)
            console.log(err.error)
          }
        },
      });
  }

  removeHousehold(id: number) {
    const householdName = this.households()?.find(h => h.householdId === id)?.householdName ?? '';
    this.api.delete(`/households/${id}`).subscribe({
      next: () => {
        this.notify.success(`Huishouden ${householdName} is verwijderd`)
        this._households.update(p => [...(p?.filter(p => p.householdId !== id) ?? [])])
      }, error: (err) => {
        this.notify.error(`Huishouden ${householdName} kan niet verwijderd worden`);
        console.error(err)
      }
    });

  }

  handleCreateNewHousehold() {
    this.modal.open('Aanmaken', CreateHousehold)
      .setCloseBackdropClick(false)
      .setCancelActionButton(false)
      .setShowActionButton(false)
      .setIcon('fa fa-users')
      .show()
  }

  handleJoinNewHousehold() {
    this.modal.open('Toevoegen?', JoinForm)
      .setCloseBackdropClick(false)
      .setCancelActionButton(false)
      .setShowActionButton(false)
      .setIcon('fa fa-users')
      .show()
  }


}
