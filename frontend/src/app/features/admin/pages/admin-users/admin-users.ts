import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ModalService } from '@app/core/modal-service';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { ButtonComponent } from '@app/shared/components/button/button';

@Component({
  selector: 'app-admin-users',
  imports: [JsonPipe, ButtonComponent],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers {
  apiSrv = inject(ApiService);
  modalSrv = inject(ModalService)
  notifySrv = inject(NotifyService);
  households = signal<any[]>([]);

  constructor(){
   this.loadData();
  }

  loadData(){
    this.apiSrv.get<any[]>('/admin/households').subscribe({
      next: (data)=>{
        this.households.set(data);
      }
    });
  }

  onRemoveClick(id:number){
    const naam = this.households().find(x=>x.id === id);
    this.modalSrv.open("Huishouden verwijderen?",`Wil je ${naam.name} verwijderen?`)
    .setType('danger')
    .setConfirmCallback(()=>this.RemoveHousehold(id,naam))
    .show()
  }

  private RemoveHousehold(id:number, name:any){
    this.apiSrv.delete(`/admin/households/${id}`).subscribe({
      next:()=>{
        this.households.update(p=>p.filter(x=>x.id !== id));
        this.notifySrv.success(`${name.name} is verwijderd`)
      }
    })
  }


}
