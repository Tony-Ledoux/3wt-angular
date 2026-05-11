import { Injectable, signal } from '@angular/core';

export type ToastType = 'success'| 'error'| 'warning' | 'info';

export interface Toast {
  id: number;
  message:string;
  type: ToastType;
  duration?: number;
  dismissable?: boolean;
  icon?:string;
  isLeaving?:boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  remove(id:number){
    this.toasts.update(t=>t.map(toast=> toast.id === id ? {...toast, isLeaving:true}:toast));
    setTimeout(()=>{
      this.toasts.update(t=>t.filter(toastsItem =>toastsItem.id !== id));
    }, 300)
  }

  show(message:string, type:ToastType='info', duration = 3000, dismissable=false, icon?:string){
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration,
      dismissable,
      icon
    }
    this.toasts.update(t=> [...t.slice(-4),toast]);

    if(duration > 0){
      setTimeout(()=>this.remove(toast.id),duration);
    }
  }

  success(msg: string, duration?:number, dismissable?:boolean, icon?:string){this.show(msg,'success', duration, dismissable, icon);}
  error(msg:string,duration?:number,dismissable?:boolean, icon?:string){this.show(msg,'error',duration,dismissable, icon);}
  warning(msg:string,duration?:number,dismissable?:boolean, icon?:string){this.show(msg,'warning',duration,dismissable, icon);}
  info(msg:string,duration?:number,dismissable?:boolean, icon?:string){this.show(msg,'info',duration,dismissable, icon);}
}
