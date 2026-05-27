import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDto } from '@app/core/types/products';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { ButtonComponent } from "@app/shared/components/button/button";
import { afterNextRender, Component, computed, inject, input, output } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';

export interface UpdateFormOptions {
  product: ProductDto
}

@Component({
  selector: 'app-edit-product-form',
  imports: [ReactiveFormsModule, LabeledInput, ButtonComponent],
  templateUrl: './edit-product-form.html',
  styleUrl: './edit-product-form.css',
})
export class EditProductForm {

  private fb = inject(FormBuilder);
  private apiSrv = inject(ApiService);
  private notifySrv = inject(NotifyService);

  data = input<UpdateFormOptions>();
  product = computed(()=>this.data()?.product??null);
  private _updateForm!:FormGroup;
  productUpdated = output<ProductDto>();

  constructor(){
    afterNextRender(()=>{
      this._updateForm = this.initForm();
    });
  }

  onSubmit(){
    const formData = this._updateForm.value;
    console.log('on submit', formData);
    
    this.apiSrv.put<ProductDto>(`/products/${this.product()?.id}`,formData).subscribe({
      next:(data)=>{
        data.id = this.product()!.id;
        this.productUpdated.emit(data);
        this.notifySrv.success(`${data.productName} is aangepast`)
      },
      error:(err)=>{
        console.error(err);
        this.notifySrv.error(`${this.product()?.productName} kon niet aangepast worden`)
      }
    });
  }
  private initForm(): FormGroup {
    return this.fb.group({
      productName:[this.product()!.productName,Validators.required],
      defaultUnit:[this.product()!.defaultUnit],
      shelfLifeClosedMinutes:[this.product()!.shelfLifeClosedMinutes],
      shelfLifeOpenedMinutes:[this.product()!.shelfLifeOpenedMinutes],

    });
  }
  get form():FormGroup{
    if(!this._updateForm){
      this._updateForm = this.initForm()
    }
    return this._updateForm;
  }

}
