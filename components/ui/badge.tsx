'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'secondary';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  secondary: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-wide', variantClasses[variant], className)}
      {...props}
    />
  );
}
