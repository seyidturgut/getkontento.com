import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Settings, 
  FileText, 
  LogOut,
  X,
  CheckSquare,
  UserCog,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUiStore } from '../store/useUiStore';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === '/app/dashboard'} 
    className={({ isActive }) =>
      `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
       ${isActive 
         ? 'bg-[#FF5A2F]/10 text-[#FF5A2F] shadow-[0_0_15px_rgba(255,90,47,0.15)] border border-[#FF5A2F]/20' 
         : 'text-slate-400 hover:bg-[#2A2F38] hover:text-slate-200 hover:translate-x-1'
       }`
    }
  >
    <span className="group-hover:scale-110 transition-transform duration-200">
      {icon}
    </span>
    {label}
  </NavLink>
);

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-[#1A1D23] border-r border-[#2A2F38] 
          transition-transform duration-300 ease-out shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-[#2A2F38]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5A2F] flex items-center justify-center shadow-lg shadow-[#FF5A2F]/20">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-100 tracking-tight text-lg">GetKontento</span>
                <span className="text-[10px] text-[#4EC9B0] uppercase tracking-wider font-semibold">SEO Platform</span>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            
            <div className="space-y-2">
              <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Menü</div>
              <NavItem to="/app/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem to="/app/analysis" icon={<Search size={20} />} label="SEO Audit" />
              <NavItem to="/app/content" icon={<FileText size={20} />} label="İçerikler" />
              <NavItem to="/app/tasks" icon={<CheckSquare size={20} />} label="Görevler" />
              <NavItem to="/app/account" icon={<UserCog size={20} />} label="Hesap Ayarları" />
            </div>

            {isAdmin && (
              <div className="space-y-2 pt-4 border-t border-[#2A2F38]">
                <div className="px-4 text-xs font-semibold text-[#FF5A2F] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Shield size={12} />
                  Admin Paneli
                </div>
                <NavItem to="/app/admin/clients" icon={<Users size={20} />} label="Müşteri Yönetimi" />
                <NavItem to="/app/admin/settings" icon={<Settings size={20} />} label="Sistem Ayarları" />
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#2A2F38] bg-[#15171C]">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-slate-400 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;