'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'secondary';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-[#f8b84e]/40 bg-[#f8b84e]/10 text-[#ffd792]',
  secondary: 'border-[#60e1ff]/45 bg-[#60e1ff]/10 text-[#a7f0ff]'
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-wide',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
