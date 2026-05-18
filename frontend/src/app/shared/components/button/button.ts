import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'danger_action' | 'success_action'| 'icon'|'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  disabled = input<boolean|null>(false);
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<ButtonType>('button');
  fullWidth = input<boolean>(false); // Nieuw: voor menu-items
  icon = input<string>();


  buttonClasses = computed(() => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm justify-center',
      secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-sm justify-center',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm justify-center',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 justify-center',
      success: `bg-green-500 text-white hover:bg-green-700 shadow-sm justify-center`,
      // Toegevoegd: font-normal en hover:font-bold
      danger_action: 'bg-transparent text-red-600 hover:bg-red-50 justify-start text-left font-normal hover:font-bold transition-all',
      success_action: 'bg-transparent text-green-500 hover:bg-green-50 justify-start text-left font-normal hover:font-bold transition-all',
      icon: 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100 justify-center transition-colors'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2'
    };

    const currentVariant = this.variant();
    const widthClass = this.fullWidth() ? 'w-full' : 'w-auto';
    
    // Dynamische rounding
    let roundedClass = 'rounded-lg';
    if (currentVariant === 'danger_action' || currentVariant === 'success_action') {
      roundedClass = 'rounded-md';
    } else if (currentVariant === 'icon') {
      roundedClass = 'rounded-full';
    }

    // Kies de juiste size class: gebruik 'icon' padding als variant 'icon' is
    const sizeClass = currentVariant === 'icon' ? sizes.icon : sizes[this.size()];

    return `${variants[currentVariant]} ${sizeClass} ${widthClass} ${roundedClass}`;
  });

}


