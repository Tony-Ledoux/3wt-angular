import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { NotifyService } from '@app/core/services/notify/notify-service';
import { ProductCategory } from '@app/core/types/productCategories';
import { ButtonComponent } from '@app/shared/components/button/button';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { LabeledSelectbox, SelectOptions } from "@app/shared/components/form/labled-selectbox/labeled-selectbox";

@Component({
  selector: 'app-storage-rule-form',
  imports: [LabeledSelectbox, LabeledInput, ButtonComponent, FormsModule],
  templateUrl: './storage-rule-form.html',
  styleUrl: './storage-rule-form.css',
})
export class StorageRuleForm {
  apiSrv = inject(ApiService);
  notifySrv = inject(NotifyService);

  data = input<{options:SelectOptions[],category: ProductCategory}>();
  ruleAdded = output<any>();
  rule:any = {categoryId:0,deviceType:0, multiplier:null}
  
  isSingleOption = computed(()=>{
    return (this.data()?.options.length === 1);
  });

  singleOptionType = computed(()=>{
    return this.data()?.options?.[0]?.label || 'onbekend'
  });

  constructor(){
    effect(()=>{
      const options = this.data()?.options;
      if(options && options.length === 1){
        this.rule.deviceType=options[0].value;
      }
    });
  }

  onSubmit(){
    this.rule.categoryId = this.data()?.category?.id ?? 0;
    this.apiSrv.post(`/admin/storage-rule/${this.rule.categoryId}`,{
      deviceType:this.rule.deviceType,
      multiplier:this.rule.multiplier
    }).subscribe({
      next: (data)=>{
        this.ruleAdded.emit(data);
      },
      error: (err:HttpErrorResponse)=>{
        const errorMessage = err.error?.message || err.error || 'er gebeurde een fout'
        this.notifySrv.error(errorMessage);
      }
    });
  }
}
