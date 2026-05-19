import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'danger_action' | 'success_action'| 'icon'|'success';
export type ButtonSize = 'xs'|'sm' | 'md' | 'lg';
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
  fullWidth = input<boolean>(false); 
  icon = input<string>();

  buttonClasses = computed(() => {
    const variants = {
      // Primary: Brand primary -> Brand primary dark
      primary: 'bg-brand-primary text-white hover:bg-brand-primary-dark shadow-sm justify-center',
      
      // Secondary: App border -> App border dark
      secondary: 'bg-app-border text-app-text-body hover:bg-app-border-dark shadow-sm justify-center',
      
      // Danger: Status danger -> (hoewel geen dark variant in theme, gebruiken we status-danger)
      danger: 'bg-status-danger text-white hover:opacity-90 shadow-sm justify-center',
      
      // Ghost: Transparent -> App bg
      ghost: 'bg-transparent text-app-text-muted hover:bg-app-bg justify-center',
      
      // Success: Status success
      success: 'bg-status-success text-white hover:opacity-90 shadow-sm justify-center',
      
      // Danger Action: Text danger -> BG danger light
      danger_action: 'bg-transparent text-status-danger hover:bg-status-danger-light justify-start text-left font-normal hover:font-bold transition-all',
      
      // Success Action: Text success -> BG success light
      success_action: 'bg-transparent text-status-success hover:bg-status-success-light justify-start text-left font-normal hover:font-bold transition-all',
      
      // Icon: Text light -> Text body / BG app bg
      icon: 'bg-transparent text-app-text-light hover:text-app-text-body hover:bg-app-bg justify-center transition-colors'
    };

    const sizes = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2'
    };

    const currentVariant = this.variant();
    const widthClass = this.fullWidth() ? 'w-full' : 'w-auto';
    
    let roundedClass = 'rounded-lg';
    if (currentVariant === 'danger_action' || currentVariant === 'success_action') {
      roundedClass = 'rounded-md';
    } else if (currentVariant === 'icon') {
      roundedClass = 'rounded-full';
    }

    const sizeClass = currentVariant === 'icon' ? sizes.icon : sizes[this.size()];

    return `${variants[currentVariant]} ${sizeClass} ${widthClass} ${roundedClass}`;
  });
}
