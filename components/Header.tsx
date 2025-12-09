import React from 'react';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUiStore } from '../store/useUiStore';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  return (
    <header className="h-20 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between
      bg-[#0D0F12]/80 backdrop-blur-md border-b border-[#2A2F38] transition-colors duration-300">
      
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-100 hover:bg-[#2A2F38] rounded-lg lg:hidden transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Global Search Bar (Hidden on small mobile) */}
        <div className="hidden md:flex items-center relative group">
          <Search className="absolute left-3 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="GetKontento içinde ara..." 
            className="bg-[#1A1D23] border border-[#2A2F38] text-slate-200 text-sm rounded-full pl-10 pr-4 py-2.5 w-64 focus:outline-none focus:w-80 focus:border-[#FF5A2F]/50 focus:ring-4 focus:ring-[#FF5A2F]/10 transition-all duration-300 placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#2A2F38] rounded-full transition-all duration-200 group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-[#FF5A2F] rounded-full ring-2 ring-[#0D0F12] animate-pulse"></span>
        </button>
        
        {/* Divider */}
        <div className="h-8 w-px bg-[#2A2F38] hidden sm:block"></div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-200 group-hover:text-[#FF5A2F] transition-colors">
              {user?.name || 'GetKontento Kullanıcısı'}
            </p>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
            </p>
          </div>
          
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-[#1A1D23] border border-[#2A2F38] flex items-center justify-center text-[#FF5A2F] overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-[#FF5A2F]/50 transition-all">
               <span className="font-bold text-lg">
                 {(user?.name || 'G').charAt(0).toUpperCase()}
               </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#4EC9B0] w-3.5 h-3.5 border-2 border-[#0D0F12] rounded-full"></div>
          </div>
          
          <ChevronDown size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;