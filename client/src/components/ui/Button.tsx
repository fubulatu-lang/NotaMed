import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, icon, children, className, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-label-lg rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
    
    const variants = {
      primary: 'bg-primary text-white shadow-elevation-1 hover:shadow-elevation-2',
      secondary: 'bg-primary-50 text-primary hover:bg-primary-100',
      outline: 'border-2 border-primary text-primary hover:bg-primary-50',
      ghost: 'text-primary hover:bg-primary-50',
    };

    const sizes = {
      sm: 'px-4 py-2 text-label-md',
      md: 'px-6 py-3 text-label-lg',
      lg: 'px-8 py-4 text-label-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon ? (
          <span className="w-5 h-5">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
