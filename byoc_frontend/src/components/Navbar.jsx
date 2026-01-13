import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Cloud, LogOut, User, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                    <Cloud className="w-8 h-8" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold leading-none">AthexLabs</span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">Manage Everything. Effortlessly.</span>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Link to="/billing" className="text-sm font-medium transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white">
                        Billing
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                        <User className="w-5 h-5" />
                        <span>{user.username}</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
