import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, BookOpen, Layers, MessageSquareText, CreditCard } from 'lucide-react';
import logo from '../assets/logo_v2.png';
import mobileLogo from '../assets/logo_v2-1.png';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-indigo-800 text-white shadow-md'
            : 'text-indigo-100 hover:bg-indigo-900 hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: Users, label: '학생 정보 관리', to: '/students' },
        { icon: Layers, label: '수강/반 관리', to: '/enrollment' },
        { icon: MessageSquareText, label: '상담 일지', to: '/grades' },
        { icon: CreditCard, label: '수납 관리', to: '/payments' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-indigo-700 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="px-4 py-5 flex items-center justify-center border-b border-indigo-800 bg-indigo-800">
                    <img src={logo} alt="Liz English Logo" className="w-full h-auto max-h-20 object-contain bg-white/10 rounded-lg p-2 backdrop-blur-sm" />
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">Menu</div>
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            active={location.pathname === item.to || (item.to === '/students' && location.pathname === '/')}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-indigo-800 bg-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">L</div>
                        <div>
                            <p className="text-sm font-medium">Liz Teacher</p>
                            <p className="text-xs text-indigo-300">liz@english.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="bg-white shadow-md lg:hidden h-16 flex items-center px-4 justify-between z-20 relative">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={mobileLogo} alt="Liz English Logo" className="h-10 w-auto object-contain" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
