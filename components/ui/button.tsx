'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-amber-400 text-gray-950 hover:brightness-110',
  outline: 'border border-gray-700 text-gray-200 hover:border-amber-400/40 hover:text-amber-100 hover:bg-gray-900',
  ghost: 'text-gray-200 hover:text-amber-100 hover:bg-gray-900'
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'rounded-full transition disabled:opacity-50 ease-out duration-200 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
