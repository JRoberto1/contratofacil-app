import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all min-h-[44px] min-w-[44px]";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const variantStyles = {
    primary: "bg-cta-gradient text-white shadow-sm hover:opacity-90 active:scale-[0.98]",
    secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 active:scale-[0.98]",
    tertiary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-[0.98]",
    outline: "border border-outline text-primary hover:bg-primary/5 active:scale-[0.98]",
    ghost: "text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:scale-[0.98]"
  };

  return (
    <button 
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
