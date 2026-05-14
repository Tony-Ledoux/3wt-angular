import { effect, Injectable, signal, Type } from '@angular/core';
export type ModalType = 'default' | 'danger' | 'success';
export type ModalIcon = string | Type<any>

export interface ModalOptions {
  closeOnBackdropClick?: boolean,
  showActionButton?: boolean,
  showCancelButton?: boolean,
  onConfirm?: () => void,
  type?: ModalType,
  icon?: ModalIcon,
  confirmText?: string
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string | Type<any>;
  type: ModalType;
  icon: ModalIcon;
  confirmText: string;
  closeOnBackdropClick: boolean;
  showActionButton: boolean;
  showCancelButton: boolean;
  onConfirm?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  state = signal<ModalState>({
    isOpen: false,
    title: '',
    content: '',
    type: 'default',
    icon: '',
    confirmText: 'Bevestigen',
    closeOnBackdropClick: true,
    showActionButton: true,
    showCancelButton: true,
  });

  private config: Partial<ModalOptions> = {}

  open(title: string, content: string | Type<any>, options: ModalOptions = {}) {
    this.config = { ...options };
    this.state.update(s => ({
      ...s,
      title,
      content
    }))
    return this;
  }

  // chain
  setTitle(title: string) {
    this.state.update((s) => ({ ...s, title }))
    return this;
  }

  setContent(content:string|Type<any>){
    this.state.update((s) => ({ ...s, content }))
    return this;
  }

  setType(type: ModalType) {
    this.config.type = type;
    return this
  }

  setIcon(icon:string){
    this.config.icon=icon;
    return this;
  }
  setConfirmText(text:string){
    this.config.confirmText=text;
    return this;
  }
  setCloseBackdropClick(flag:boolean){
    this.config.closeOnBackdropClick=flag;
    return this;
  }

  setShowActionButton(flag:boolean){
    this.config.showActionButton = flag;
    return this;
  }
  setCancelActionButton(flag:boolean){
    this.config.showCancelButton = flag;
    return this;
  }

  setConfirmCallback(cb:()=>void){
    this.config.onConfirm = cb;
    return this;
  }

  show() {
    this.state.update((s) => ({ ...s, ...this.config, isOpen: true }));
    this.config = {};
  }

  confirm() {
    this.state()?.onConfirm?.();
    this.close()
  }


  close() {
    //reset the state
    this.state.set({
      isOpen: false,
      title: '',
      content: '',
      type: 'default',
      icon: '',
      confirmText: 'Bevestigen',
      closeOnBackdropClick: true,
      showActionButton: true,
      showCancelButton: true,
    })
  }
}
