
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, Activity, LogOut, LayoutDashboard, ChevronDown,
  Cloud, Zap, Briefcase, Server, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cloudDropdownOpen, setCloudDropdownOpen] = useState(false);
  const [dedicatedDropdownOpen, setDedicatedDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'executive') return '/executive-dashboard';
    return '/client-dashboard';
  };

  const cloudServices = [
    {
      title: 'VPS Cloud',
      description: 'Infraestrutura escalável com discos NVMe',
      path: '/vps-cloud',
      icon: Cloud,
      badge: 'Mais Popular',
      features: ['Alta performance', 'Discos NVMe', 'Backup diário']
    },
    {
      title: 'VPS OPA Suite',
      description: 'Servidores otimizados para OPA Suite',
      path: '/servidor-opa',
      icon: Zap,
      badge: null,
      features: ['Otimizado', 'Suporte dedicado', 'Auto-scaling']
    },
    {
      title: 'VPS IXC',
      description: 'Ambiente preparado para IXC Soft',
      path: '/servidor-ixc',
      icon: Briefcase,
      badge: null,
      features: ['Pré-configurado', 'Alta disponibilidade', 'Monitoramento 24/7']
    },
  ];

  const dedicatedServices = [
    {
      title: 'Servidores Dedicados',
      description: 'Máquinas físicas exclusivas',
      path: '/dedicated-server',
      icon: Server,
      badge: 'Profissional',
      features: ['Hardware dedicado', 'Full Root', 'IP dedicado']
    },
    {
      title: 'Colocation',
      description: 'Hospede seu servidor conosco',
      path: '/colocation',
      icon: Building2,
      badge: null,
      features: ['Seu hardware', 'Data center seguro', 'Energia redundante']
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm font-sans h-[80px] flex items-center transition-all duration-200">
         <div className="max-w-[1440px] mx-auto px-4 lg:px-8 w-full flex justify-between items-center h-full">
            <Link to="/" className="flex-shrink-0 mr-12 flex items-center group">
               <img src="/logo.png" alt="HostEver" className="h-9 w-auto object-contain block" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-grow justify-start">
               {/* Servidores Cloud Dropdown */}
               <div className="relative group">
                 <button 
                   className="text-[14px] font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 text-gray-600 hover:text-[#FFA500] hover:bg-[#FFA500]/5"
                   onMouseEnter={() => setCloudDropdownOpen(true)}
                   onMouseLeave={() => setCloudDropdownOpen(false)}
                 >
                   Servidores Cloud
                   <ChevronDown className="w-3 h-3" />
                 </button>
                 
                 <AnimatePresence>
                   {cloudDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       transition={{ duration: 0.2 }}
                       className="absolute left-0 top-full mt-2 w-[420px] bg-white rounded-xl shadow-2xl border border-gray-200 py-3 overflow-hidden z-[110]"
                       onMouseEnter={() => setCloudDropdownOpen(true)}
                       onMouseLeave={() => setCloudDropdownOpen(false)}
                     >
                       {cloudServices.map((service) => {
                         const Icon = service.icon;
                         return (
                           <Link
                             key={service.path}
                             to={service.path}
                             className="group/item flex flex-col gap-2 px-5 py-5 hover:bg-gradient-to-r hover:from-[#FFA500]/5 hover:to-[#FFA500]/10 transition-all duration-300 border-b border-gray-100 last:border-0 relative"
                           >
                             {service.badge && (
                               <div className="absolute top-5 right-5">
                                 <span className="text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-white rounded-full uppercase tracking-wide">
                                   {service.badge}
                                 </span>
                               </div>
                             )}
                             <div className="flex items-center gap-3 pr-20">
                               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA500]/10 to-[#FFA500]/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                 <Icon className="w-6 h-6 text-[#FFA500]" />
                               </div>
                               <div className="flex-1">
                                 <div className="font-bold text-gray-900 text-base group-hover/item:text-[#FFA500] transition-colors">
                                   {service.title}
                                 </div>
                                 <div className="text-sm text-gray-500 mt-0.5">
                                   {service.description}
                                 </div>
                               </div>
                             </div>
                             <div className="flex flex-wrap gap-1.5 ml-[60px]">
                               {service.features.map((feature, idx) => (
                                 <span key={idx} className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                                   {feature}
                                 </span>
                               ))}
                             </div>
                           </Link>
                         );
                       })}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>

               {/* Servidores Dedicados Dropdown */}
               <div className="relative group">
                 <button 
                   className="text-[14px] font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 text-gray-600 hover:text-[#FFA500] hover:bg-[#FFA500]/5"
                   onMouseEnter={() => setDedicatedDropdownOpen(true)}
                   onMouseLeave={() => setDedicatedDropdownOpen(false)}
                 >
                   Servidores Dedicados
                   <ChevronDown className="w-3 h-3" />
                 </button>
                 
                 <AnimatePresence>
                   {dedicatedDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       transition={{ duration: 0.2 }}
                       className="absolute left-0 top-full mt-2 w-[420px] bg-white rounded-xl shadow-2xl border border-gray-200 py-3 overflow-hidden z-[110]"
                       onMouseEnter={() => setDedicatedDropdownOpen(true)}
                       onMouseLeave={() => setDedicatedDropdownOpen(false)}
                     >
                       {dedicatedServices.map((service) => {
                         const Icon = service.icon;
                         return (
                           <Link
                             key={service.path}
                             to={service.path}
                             className="group/item flex flex-col gap-2 px-5 py-5 hover:bg-gradient-to-r hover:from-[#FFA500]/5 hover:to-[#FFA500]/10 transition-all duration-300 border-b border-gray-100 last:border-0 relative"
                           >
                             {service.badge && (
                               <div className="absolute top-5 right-5">
                                 <span className="text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r from-[#FFA500] to-[#FFD700] text-white rounded-full uppercase tracking-wide">
                                   {service.badge}
                                 </span>
                               </div>
                             )}
                             <div className="flex items-center gap-3 pr-20">
                               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA500]/10 to-[#FFA500]/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                 <Icon className="w-6 h-6 text-[#FFA500]" />
                               </div>
                               <div className="flex-1">
                                 <div className="font-bold text-gray-900 text-base group-hover/item:text-[#FFA500] transition-colors">
                                   {service.title}
                                 </div>
                                 <div className="text-sm text-gray-500 mt-0.5">
                                   {service.description}
                                 </div>
                               </div>
                             </div>
                             <div className="flex flex-wrap gap-1.5 ml-[60px]">
                               {service.features.map((feature, idx) => (
                                 <span key={idx} className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                                   {feature}
                                 </span>
                               ))}
                             </div>
                           </Link>
                         );
                       })}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>

               <Link 
                  to="/sobre-nos" 
                  className="text-[14px] font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-[#FFA500] hover:bg-[#FFA500]/5"
               >
                  Sobre nós
               </Link>

               <Link 
                  to="/status" 
                  className={`text-[14px] font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                      location.pathname === '/status' 
                      ? 'text-[#FFA500] bg-[#FFA500]/5' 
                      : 'text-gray-600 hover:text-[#FFA500] hover:bg-[#FFA500]/5'
                  }`}
               >
                  <Activity className="w-4 h-4 mr-2" />
                  Status
               </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
                 {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-[#FFA500] hover:bg-[#FFA500] font-bold rounded-lg px-4 h-10 shadow-md flex items-center gap-2 transition-colors">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">{user.name?.split(' ')[0] || 'Conta'}</span>
                                <ChevronDown className="w-3 h-3 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 border-gray-100 shadow-xl rounded-xl">
                            <div className="px-3 py-2.5 text-sm font-bold text-[#FFB833] border-b border-gray-50 mb-1">
                                {user.email}
                                <span className="block text-xs font-normal text-gray-500 mt-0.5 capitalize">{user.role === 'client' ? 'Cliente' : user.role}</span>
                            </div>
                            <DropdownMenuItem asChild>
                                <Link to={getDashboardLink()} className="cursor-pointer font-medium">
                                    <LayoutDashboard className="w-4 h-4 mr-2 text-[#FFA500]" /> Painel de Controle
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-50" />
                            <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 font-medium">
                                <LogOut className="w-4 h-4 mr-2" /> Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 ) : (
                    <div className="hidden lg:flex items-center gap-3">
                        <Button variant="ghost" className="text-gray-600 hover:text-[#FFA500] hover:bg-[#FFA500]/5 font-bold text-[13px] uppercase tracking-wide h-10 px-5 rounded-lg" asChild>
                            <Link to="/login">Entrar</Link>
                        </Button>
                        <Button className="bg-[#FFA500] hover:bg-[#FFA500] font-bold uppercase rounded-lg px-6 h-10 text-[12px] tracking-widest shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" asChild>
                            <Link to="/area-do-cliente">Área do Cliente</Link>
                        </Button>
                    </div>
                 )}
                
                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className="lg:hidden text-[#FFB833] p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
         </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                className="lg:hidden bg-white border-t border-gray-100 overflow-hidden absolute w-full left-0 top-[80px] z-[90] shadow-xl flex flex-col font-sans"
              >
                 <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="font-bold text-gray-900 py-2 px-2">Servidores Cloud</div>
                      {cloudServices.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link 
                            key={service.path}
                            to={service.path} 
                            className="flex items-center gap-3 pl-4 pr-2 py-2 rounded-lg hover:bg-gray-50 hover:text-[#FFA500]"
                          >
                            <Icon className="w-5 h-5 text-[#FFA500]" />
                            <span className="font-medium">{service.title}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-gray-900 py-2 px-2">Servidores Dedicados</div>
                      {dedicatedServices.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link 
                            key={service.path}
                            to={service.path} 
                            className="flex items-center gap-3 pl-4 pr-2 py-2 rounded-lg hover:bg-gray-50 hover:text-[#FFA500]"
                          >
                            <Icon className="w-5 h-5 text-[#FFA500]" />
                            <span className="font-medium">{service.title}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <Link to="/sobre-nos" className="block font-bold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 hover:text-[#FFA500]">
                      Sobre nós
                    </Link>

                    <Link to="/status" className="block font-bold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 hover:text-[#FFA500]">
                      <Activity className="w-5 h-5 inline mr-2" />
                      Status
                    </Link>
                    
                    <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                        {user ? (
                            <Button asChild className="w-full bg-[#FFA500] h-12 text-base"><Link to={getDashboardLink()}>Acessar Painel</Link></Button>
                        ) : (
                            <>
                                <Button variant="outline" asChild className="w-full justify-start h-12 text-base border-gray-200"><Link to="/login">Entrar</Link></Button>
                                <Button asChild className="w-full bg-[#FFA500] h-12 text-base"><Link to="/area-do-cliente">Área do Cliente</Link></Button>
                            </>
                        )}
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
      </header>
    </>
  );
};
export default Header;
