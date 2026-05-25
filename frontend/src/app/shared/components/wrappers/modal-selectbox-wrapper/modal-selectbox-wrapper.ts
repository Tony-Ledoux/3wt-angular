import { Component, input, output, signal } from '@angular/core';
import { LabeledSelectbox } from "../../form/labled-selectbox/labeled-selectbox";

@Component({
  selector: 'app-modal-selectbox-wrapper',
  imports: [LabeledSelectbox],
  templateUrl: './modal-selectbox-wrapper.html',
  styleUrl: './modal-selectbox-wrapper.css',
})
export class ModalSelectboxWrapper {
  data = input<any>();
  output = output<string|number|null>();
  onChange(event:string|number){
    this.output.emit(event);
  }
}
