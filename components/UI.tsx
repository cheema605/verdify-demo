'use client';

import React from 'react';

// Use React.FC to properly handle children and standard React props like 'key'
export const Card: React.FC<{ children?: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`} onClick={onClick}>
    {children}
  </div>
);

// Use React.FC for Button to handle children and variant typing correctly
export const Button: React.FC<{
  children?: React.ReactNode,
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size?: 'sm' | 'md' | 'lg',
  onClick?: () => void,
  className?: string,
  disabled?: boolean
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = "",
  disabled = false
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      outline: "bg-transparent border border-slate-200 text-slate-900 hover:bg-slate-50",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
      danger: "bg-red-500 text-white hover:bg-red-600"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </button>
    );
  };

export const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className = ""
}: {
  label?: string,
  type?: string,
  placeholder?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  disabled?: boolean,
  className?: string
}) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

// Use React.FC for Badge to handle standard children prop
export const Badge: React.FC<{ children?: React.ReactNode, variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }> = ({ children, variant = 'neutral' }) => {
  const variants = {
    neutral: "bg-slate-100 text-slate-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-800",
    info: "bg-blue-100 text-blue-800"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const Progress = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
    <div
      className="bg-indigo-600 h-full transition-all duration-500 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
);
