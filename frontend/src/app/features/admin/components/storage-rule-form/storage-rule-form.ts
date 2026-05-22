import { JsonPipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@app/shared/components/button/button';
import { LabeledInput } from '@app/shared/components/form/labeled-input/labeled-input';
import { LabeledSelectbox } from "@app/shared/components/form/labled-selectbox/labeled-selectbox";

@Component({
  selector: 'app-storage-rule-form',
  imports: [JsonPipe, LabeledSelectbox, LabeledInput, ButtonComponent, FormsModule],
  templateUrl: './storage-rule-form.html',
  styleUrl: './storage-rule-form.css',
})
export class StorageRuleForm {
  data = input<any>();
  ruleAdded = output<any>();
  rule = signal({categoryId:null,deviceType:null, multiplier:null})

  onSubmit(){
    this.rule().categoryId = this.data().category.id;
    //api call
    this.ruleAdded.emit(this.rule());
    console.log(this.rule());
  }
}
