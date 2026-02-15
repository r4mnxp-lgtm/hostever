import React , useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Server, MessageSquare, LogOut, ChevronLeft, DollarSign, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const ClientLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const handleLogout = () => {
        logout();
        navigate('/');
        showToast({
            title: "Logout realizado com sucesso!",
            variant: "success",
        });
    };

    const navLinkClass = ({ isActive }) =>
      `flex items-center px-4 py-3 text-gray-200 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-white font-semibold'
          : 'hover:bg-gray-700 hover:text-white'
      }`;

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 sticky top-0 h-screen">
                <div className="flex items-center justify-center mb-10 h-20">
                    <img src="/logo.png" alt="HostEver" className="h-9 w-auto" />
                </div>
                <div className="text-center mb-8">
                    <p className="text-lg font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <nav className="flex-grow space-y-2">
                    <NavLink to="/client-area/dashboard" className={navLinkClass}>
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/client-area/services" className={navLinkClass}>
                        <Server className="mr-3 h-5 w-5" />
                        Meus Serviços
                    </NavLink>
                    <NavLink to="/client-area/tickets" className={navLinkClass}>
                        <MessageSquare className="mr-3 h-5 w-5" />
                        Suporte
                    </NavLink>
                    <NavLink to="/client-area/financial" className={navLinkClass}>
                        <DollarSign className="mr-3 h-5 w-5" />
                        Financeiro
                    </NavLink>
                    <NavLink to="/client-area/smart-hands" className={navLinkClass}>
                        <HardHat className="mr-3 h-5 w-5" />
                        Smart Hands
                    </NavLink>
                </nav>
                <div className="mt-auto">
                    <Button onClick={() => navigate('/')} variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white mb-2">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Site
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-300 hover:bg-red-500/20 hover:text-red-400">
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-6 sm:p-10">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;