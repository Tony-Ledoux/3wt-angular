import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDto } from '@app/core/types/products';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { ButtonComponent } from "@app/shared/components/button/button";
import { afterNextRender, Component, computed, inject, input } from '@angular/core';
import { ApiService } from '@app/core/services/api/api-service';

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

  data = input<UpdateFormOptions>();
  product = computed(()=>this.data()?.product??null);
  private _updateForm!:FormGroup;

  constructor(){
    afterNextRender(()=>{
      this._updateForm = this.initForm();
    });
  }

  onSubmit(){
    this.apiSrv.put<ProductDto>(`/products/${this.product()?.id}`,this._updateForm.value).subscribe({
      next:(data)=>{
        console.log(data);
      },
      error:(err)=>{
        console.error(err);
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
