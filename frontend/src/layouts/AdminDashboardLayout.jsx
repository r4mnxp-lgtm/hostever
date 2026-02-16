
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShoppingBag, Layers, Mail, 
  FileText, LogOut, Menu, ChevronRight, DollarSign,
  Server, Globe, Ticket, BarChart3, Shield, Activity, Box, Settings, UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AdminDashboardLayout = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin-dashboard', exact: true },
    { icon: Users, label: 'Clientes', to: '/admin-dashboard/clients' },
    { icon: Server, label: 'Serviços', to: '/admin-dashboard/services' },
    { icon: FileText, label: 'Faturas', to: '/admin-dashboard/invoices' },
    { icon: Ticket, label: 'Tickets', to: '/admin-dashboard/tickets' },
    { icon: Activity, label: 'Status', to: '/admin-dashboard/status' },
    { icon: UserCog, label: 'Administradores', to: '/admin-dashboard/admins' },
    { icon: Settings, label: 'Configurações', to: '/admin-dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#FFB833] text-white transition-transform duration-300 transform lg:translate-x-0 lg:static flex flex-col shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <img 
             src="/logo.png" 
             alt="HostEver Admin" 
             className="h-8"
          />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm group relative overflow-hidden",
                isActive 
                  ? "bg-[#FFA500] text-white shadow-lg shadow-[#FFA500]/20" 
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5 mr-3 z-10" />
                  <span className="z-10">{item.label}</span>
                  {isActive && <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#FFA500] z-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-300 hover:bg-white/5 rounded-xl transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5 mr-3" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 shadow-sm z-40 relative">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
             </button>
             <div className="hidden md:flex items-center text-sm text-gray-500">
                <span className="hover:text-[#FFA500] cursor-pointer">Admin</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="font-semibold text-[#FFB833] capitalize">
                   {location.pathname.split('/').pop() || 'Dashboard'}
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[#FFB833]">{user?.email}</div>
                <div className="text-xs text-gray-500 uppercase">{user?.role}</div>
             </div>
             <NavLink to="/admin-dashboard/account">
               <div className="w-10 h-10 bg-[#FFA500] rounded-full flex items-center justify-center text-white font-bold shadow-md hover:bg-[#FF8C00] transition-colors cursor-pointer">
                  {user?.email?.[0].toUpperCase()}
               </div>
             </NavLink>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
          {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
          <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
                <Outlet />
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
