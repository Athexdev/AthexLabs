import React from 'react';

export const Input = ({ label, id, ...props }) => {
    return (
        <div className="flex flex-col gap-1">
            {label && <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
            <input
                id={id}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-0 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                {...props}
            />
        </div>
    );
};
