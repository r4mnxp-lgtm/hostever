
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Activity, FileText, LifeBuoy, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ClientDashboardHome = () => {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
           <h1 className="text-3xl font-bold text-[#FFB833] font-sora">Olá, {user?.name?.split(' ')[0] || 'Cliente'}</h1>
           <p className="text-gray-500">Bem-vindo ao seu painel de controle HostEver.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" asChild><Link to="/client-dashboard/support">Abrir Ticket</Link></Button>
           <Button className="bg-[#FFA500]" asChild><Link to="/">Nova Contratação</Link></Button>
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
           <Card className="hover:shadow-md transition-shadow border-l-4 border-l-[#FFA500]">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#FFA500]"><Server className="w-6 h-6" /></div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativo</span>
                 </div>
                 <div className="text-2xl font-bold text-[#FFB833]">3</div>
                 <div className="text-sm text-gray-500">Serviços Ativos</div>
              </CardContent>
           </Card>
        </motion.div>
        
        <motion.div variants={item}>
           <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><FileText className="w-6 h-6" /></div>
                    <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Pendente</span>
                 </div>
                 <div className="text-2xl font-bold text-[#FFB833]">1</div>
                 <div className="text-sm text-gray-500">Fatura em Aberto</div>
              </CardContent>
           </Card>
        </motion.div>

        <motion.div variants={item}>
           <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><LifeBuoy className="w-6 h-6" /></div>
                 </div>
                 <div className="text-2xl font-bold text-[#FFB833]">0</div>
                 <div className="text-sm text-gray-500">Tickets Abertos</div>
              </CardContent>
           </Card>
        </motion.div>

        <motion.div variants={item}>
           <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-50 rounded-lg text-green-500"><Activity className="w-6 h-6" /></div>
                 </div>
                 <div className="text-2xl font-bold text-[#FFB833] flex items-center gap-2">
                    100% <CheckCircle2 className="w-5 h-5 text-green-500" />
                 </div>
                 <div className="text-sm text-gray-500">Uptime Mensal</div>
              </CardContent>
           </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg text-[#FFB833]">Meus Serviços</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-gray-100">
                  {[1, 2].map(i => (
                     <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                           <div className="font-bold text-[#FFB833]">VPS Cloud Pro</div>
                           <div className="text-xs text-gray-500">IP: 192.168.1.{i}0 • São Paulo</div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                           <Link to="/client-dashboard/vps">Gerenciar <ChevronRight className="w-4 h-4 ml-1" /></Link>
                        </Button>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="bg-[#FFB833] text-white">
               <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 font-sora">Status do Sistema</h3>
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                     <span className="text-sm font-medium">Todos os sistemas operacionais</span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full" asChild>
                     <Link to="/client-dashboard/status">Ver Status Page</Link>
                  </Button>
               </CardContent>
            </Card>

            <Card>
               <CardHeader><CardTitle className="text-lg text-[#FFB833]">Últimas Novidades</CardTitle></CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="border-l-2 border-[#FFA500] pl-4">
                        <h4 className="font-bold text-sm text-[#FFB833]">Novo Data Center em SP</h4>
                        <p className="text-xs text-gray-500 mt-1">Expandimos nossa infraestrutura com conexão direta ao IX.br...</p>
                        <Link to="/client-dashboard/blog" className="text-xs text-[#FFA500] font-bold mt-2 block hover:underline">Ler mais</Link>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default ClientDashboardHome;
