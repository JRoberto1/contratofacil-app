import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'info' | 'primary' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight";
  
  const variantStyles = {
    primary: "bg-primary-container text-white",
    success: "bg-emerlad-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-tertiary-container text-white",
    outline: "border border-outline-variant text-on-surface-variant"
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
