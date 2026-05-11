import { Component, computed, input, model, signal } from '@angular/core';


@Component({
  selector: 'app-accordion-item',
  imports: [],
  templateUrl: './accordion-item.html',
  styleUrl: './accordion-item.css',
})
export class AccordionItem {
 status = input<'success' | 'warning' | 'danger' | 'default'>('default');
 
 statusStyles = computed(()=>{
   const s = this.status();
   const styles = {
     success: {
       header: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
       badge: 'bg-emerald-600 text-white',
       border: 'border-emerald-200'
      },
      warning: {
        header: 'bg-amber-50 hover:bg-amber-100 text-amber-700',
        badge: 'bg-amber-600 text-white',
        border: 'border-amber-200'
      },
      danger: {
        header: 'bg-red-50 hover:bg-red-100 text-red-700',
        badge: 'bg-red-600 text-white',
        border: 'border-red-200'
      },
      default: {
        header: 'bg-slate-50 hover:bg-slate-100 text-slate-700',
        badge: 'bg-slate-600 text-white',
        border: 'border-slate-200'
      }
    };
    return styles[s];
  });
  
  
  isOpen=model(false) // model combines input and output
  title = input<string>('Default');
  badge = input<number>(0);
  icon = input<string>('△')
  hasBadge = input<boolean>(false);

  toggle(){
    this.isOpen.update(value => !value);
  }
}
