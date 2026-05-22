import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@app/core/services/api/api-service';
import { ProductCategory } from '@app/core/types/productCategories';
import { ButtonComponent } from '@app/shared/components/button/button';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { LabeledSelectbox, SelectOptions } from "@app/shared/components/form/labled-selectbox/labeled-selectbox";

@Component({
  selector: 'app-storage-rule-form',
  imports: [JsonPipe, LabeledSelectbox, LabeledInput, ButtonComponent, FormsModule],
  templateUrl: './storage-rule-form.html',
  styleUrl: './storage-rule-form.css',
})
export class StorageRuleForm {
  apiSrv = inject(ApiService);
  data = input<{options:SelectOptions[],category: ProductCategory}>();
  ruleAdded = output<any>();
  rule = signal({categoryId:0,deviceType:0, multiplier:null})
  
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
        this.rule.update(p=>({...p, deviceType:options[0].value}))
      }
    });
  }

  onSubmit(){
    //ToDO find error in backend
    this.rule().categoryId = this.data()?.category?.id ?? 0;
    this.apiSrv.post(`/admin/storage-rule/${this.rule().categoryId}`,{
      deviceType:this.rule().deviceType,
      multiplier:this.rule().multiplier
    }).subscribe({
      next: (data)=>{
        this.ruleAdded.emit(data);
      },
      error: (err)=>{
        console.log(err)
      }
    });
  }
}
