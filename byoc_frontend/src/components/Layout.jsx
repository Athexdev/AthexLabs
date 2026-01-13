import React from 'react';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
