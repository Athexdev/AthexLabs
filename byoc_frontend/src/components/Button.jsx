import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, className, variant = 'primary', ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white",
        secondary: "bg-slate-700 hover:bg-slate-600 text-white",
        danger: "bg-red-600 hover:bg-red-500 text-white",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
