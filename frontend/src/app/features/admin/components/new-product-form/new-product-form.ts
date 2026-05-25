import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCategory } from '@app/core/types/productCategories';
import { LabeledInput } from "@app/shared/components/form/labeled-input/labeled-input";
import { Autocomplete } from "@app/shared/components/autocomplete/autocomplete";
import { SectionCard } from "@app/shared/components/section-card/section-card";
import { ButtonComponent } from "@app/shared/components/button/button";
import { ApiService } from '@app/core/services/api/api-service';
import { ProductDto } from '@app/core/types/products';
import { NotifyService } from '@app/core/services/notify/notify-service';


@Component({
  selector: 'app-new-product-form',
  imports: [ReactiveFormsModule, LabeledInput, Autocomplete, SectionCard, ButtonComponent],
  templateUrl: './new-product-form.html',
  styleUrl: './new-product-form.css',
})
export class NewProductForm {
  private fb = inject(FormBuilder)
  private apiSrv = inject(ApiService);
  private readonly notifySrv = inject(NotifyService)
  readonly data = input.required<any>();
  readonly householdId = input<number|null>(null);
  created = output<ProductDto>();

  readonly categories = computed<ProductCategory[]>(()=> this.data()?.categories || []);
  // state for the chips
  selectedCategories = signal<ProductCategory[]>([]);
  selectionCount = computed(()=> this.selectedCategories().length);


  productForm = this.fb.group({
    productName: ['', Validators.required],
    defaultUnit:[null as string |null],
    shelfLifeClosedMinutes:[null as number |null],
    shelfLifeOpenedMinutes:[null as number |null],
    householdId:[null as number|null],
    isGlobal:[false],
    categoryIds: [[] as number[]],
  });

  addCategory(event:ProductCategory){
    if(!this.selectedCategories().some(x=>x.id === event.id)){
      this.selectedCategories.update(p=>[...p, event])
    }
    this.syncCategoryIds();
  }


  RemoveCategoryChip(id:number){
    this.selectedCategories.update(p=> p.filter(x=>x.id !== id));
    this.syncCategoryIds()
  }

  onSubmit(){
    // set the global and household flags if needed
    if(this.householdId() === null){
      this.productForm.patchValue({isGlobal:true, householdId:null})
    }else {
      const hId = this.householdId()!
      this.productForm.patchValue({isGlobal:false, householdId:hId})
    }
    this.apiSrv.post<ProductDto>('/products',this.productForm.value).subscribe({
      next: (data)=>{
        console.log(data)
        this.created.emit(data);
        this.notifySrv.success(`${data.productName} is toegvoegd`);
      },
      error: (err)=> {
        console.error(err)
      }
    });
  }

  private syncCategoryIds(){
    const ids = this.selectedCategories().map(cat => cat.id);
    this.productForm.patchValue({categoryIds:ids});
  }
 
}
