import { Component, inject, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { HouseholdService } from '../../services/household-service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly apiSrv = inject(ApiService);
  private readonly householdSrv = inject(HouseholdService)
  products = signal<any[]>([]);

  constructor(){
    this.load_data();
  }

  private load_data(){
    this.apiSrv.get<any[]>(`/products/household/${this.householdSrv.selected_household()?.householdId!}`).subscribe({
      next: (data)=> {
        console.log(data)
      },
      error: (err)=>{
        console.error(err)
      }
    });
  }

}
