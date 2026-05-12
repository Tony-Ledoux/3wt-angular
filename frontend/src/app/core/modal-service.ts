import { effect, Injectable, signal, Type } from '@angular/core';
export type ModalType = 'default' | 'danger' | 'success';
export type ModalIcon = string | Type<any>

export interface ModalOptions {
  closeOnBackdropClick?:boolean,
  showActionButton?:boolean,
  showCancelButton?:boolean,
  onConfirm?:()=>void,
  type?:ModalType,
  icon?:ModalIcon,
  confirmText?:string
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal(false);
  type = signal<ModalType>('default')
  closeOnBackdropClick = signal(true);
  showActionButton = signal(true);
  showCancelButton = signal(true);
  title = signal('');
  content = signal<string|Type<any>>('');
  icon = signal<ModalIcon>('');
  confirmText = signal("Bevestigen")

  private confirmCallback: (()=>void)|null = null;

  open(title: string, content: string|any, options: ModalOptions= {}) {
    this.type.set(options.type ?? 'default');
    this.title.set(title);
    this.content.set(content);
    this.isOpen.set(true);
    this.icon.set(options.icon ?? '');
    this.closeOnBackdropClick.set(options.closeOnBackdropClick ?? true);
    this.showActionButton.set(options.showActionButton ?? true);
    this.showCancelButton.set(options.showCancelButton ?? true);
    this.confirmCallback = options.onConfirm || null;
    this.confirmText.set(options.confirmText ?? 'Bevestigen');
  }

  setCallback(cb:(()=>void)|null):void{
    this.confirmCallback = cb;
  }


  confirm(){
    if(this.confirmCallback){
      this.confirmCallback();
    }
    this.close();
  }

  close() {
    this.isOpen.set(false);
    // reset the modaltype to default
    this.type.set('default');
    this.confirmCallback = null;
  }
}
