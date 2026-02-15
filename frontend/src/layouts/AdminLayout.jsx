import React, { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Server, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Activity,
  Package,
  FileText,
  Briefcase,
  ShieldCheck,
  Globe,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SidebarItem = ({ icon: Icon, label, to, isActive, isCollapsed }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative",
      isActive 
        ? "bg-white/10 text-white" 
        : "text-gray-400 hover:bg-white/5 hover:text-white",
      isCollapsed ? "justify-center" : "justify-start"
    )}
    title={isCollapsed ? label : undefined}
  >
    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-hostever-secondary" : "text-gray-400 group-hover:text-gray-200")} />
    {!isCollapsed && (
      <span className="ml-3 font-medium text-sm whitespace-nowrap">{label}</span>
    )}
    {isActive && !isCollapsed && (
        <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-hostever-secondary rounded-r-full" />
    )}
  </Link>
);

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
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
    navigate('/login');
    showToast({
      title: "Logout realizado",
      description: "Sua sessão foi encerrada com segurança.",
    });
  };

  const menuItems = [
    { icon: Activity, label: 'Status & Incidentes', to: '/manage-status', perm: 'manage_status' },
    { icon: Package, label: 'Gerenciar Planos', to: '/manage-plans', perm: 'manage_plans' },
    { icon: Globe, label: 'Visibilidade Produtos', to: '/manage-products', perm: 'manage_products' },
    { icon: Users, label: 'Usuários Admin', to: '/manage-users', perm: 'manage_users' },
    { icon: FileText, label: 'Blog & Conteúdo', to: '/manage-blog', perm: 'manage_blog' },
    { icon: Briefcase, label: 'Vagas & Carreiras', to: '/manage-careers', perm: 'manage_careers' },
    { icon: Database, label: 'Leads & Contatos', to: '/manage-leads', perm: 'manage_leads' },
    { icon: FileText, label: 'Gerador Propostas', to: '/manage-proposals', perm: 'manage_proposals' },
    { icon: ShieldCheck, label: 'Termos Legais', to: '/manage-legal', perm: 'manage_company' },
    { icon: Settings, label: 'Config. Empresa', to: '/manage-company', perm: 'manage_company' },
  ];

  const filteredMenu = menuItems.filter(item => hasPermission(item.perm));

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}
      </AnimatePresence>

      {/* Sidebar - Dark Blue */}
      <motion.aside
        className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 bg-hostever-primary border-r border-white/5 flex flex-col transition-all duration-300 shadow-xl lg:shadow-none text-white",
            isSidebarOpen ? "w-64" : "w-20 hidden lg:flex"
        )}
        initial={false}
        animate={{ 
            x: isMobileMenuOpen ? 0 : window.innerWidth < 1024 ? -1000 : 0,
            width: isSidebarOpen ? 256 : 80 
        }}
      >
        <div className="h-20 flex items-center justify-center border-b border-white/10 px-6">
           <Link to="/" className="flex items-center gap-2 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="HostEver Admin" 
                  className={cn("transition-all", isSidebarOpen ? "h-8" : "h-6")}
                />
           </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
            {filteredMenu.map((item) => (
                <SidebarItem 
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    isActive={location.pathname === item.to}
                    isCollapsed={!isSidebarOpen}
                />
            ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
            <div className={cn("flex items-center", isSidebarOpen ? "justify-between" : "justify-center")}>
                {isSidebarOpen && (
                    <div className="flex items-center overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-hostever-secondary to-hostever-accent flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                )}
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-400 hover:bg-white/5"
                    title="Sair"
                >
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setMobileMenuOpen(true)} 
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => setSidebarOpen(!isSidebarOpen)} 
                    className="hidden lg:flex p-2 -ml-2 text-gray-500 hover:text-hostever-primary hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
                   Painel de Controle
                </h2>
            </div>
            
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm" className="hidden sm:flex border-gray-200 text-gray-600 hover:text-hostever-primary hover:border-hostever-primary/30">
                    <Link to="/" target="_blank">
                        Ver Site <Globe className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8 relative bg-gray-50">
            <div className="max-w-7xl mx-auto">
                 {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;