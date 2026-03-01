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
  default:
    'bg-[#f8b84e] text-[#120d05] border border-[#f8b84e]/80 shadow-[0_0_0_1px_rgba(248,184,78,0.18)] hover:shadow-[0_0_26px_rgba(248,184,78,0.35)] hover:brightness-105',
  outline:
    'border border-[#1e2a3a] bg-[#101722]/75 text-[#cfd9e8] hover:border-[#60e1ff]/55 hover:text-[#d6f6ff] hover:shadow-[0_0_22px_rgba(96,225,255,0.2)]',
  ghost: 'text-[#cfd9e8] hover:text-[#f8b84e] hover:bg-[#111826]'
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
        'rounded-full transition disabled:opacity-50 ease-out duration-220 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
