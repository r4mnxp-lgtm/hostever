import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Activity, FileText, LifeBuoy, ChevronRight, CheckCircle2, Mail, X, TrendingUp, DollarSign, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ClientDashboardHome = () => {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(true);
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('E-mail de verificação reenviado com sucesso! Verifique sua caixa de entrada.');
      } else {
        alert('Erro ao reenviar e-mail. Tente novamente mais tarde.');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setResending(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {!user?.email_verified && showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 rounded-2xl shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 mb-1 text-lg">Confirme seu e-mail</h3>
                  <p className="text-sm text-amber-800 mb-4 leading-relaxed">
                    Enviamos um e-mail de confirmação para <strong className="text-amber-900">{user?.email}</strong>. 
                    Por favor, verifique sua caixa de entrada e confirme seu e-mail para ter acesso completo à plataforma.
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md"
                  >
                    {resending ? 'Reenviando...' : 'Reenviar E-mail'}
                  </Button>
                </div>
              </div>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-amber-600 hover:text-amber-800 transition-colors rounded-lg hover:bg-amber-100 p-2 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFB833] to-[#FFA500] bg-clip-text text-transparent mb-2">
              Olá, {user?.name?.split(' ')[0] || 'Cliente'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">Bem-vindo ao seu painel de controle HostEver.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/client-dashboard/support">
              <Button 
                variant="outline" 
                className="border-2 border-gray-200 hover:border-[#FFB833] hover:bg-[#FFB833] hover:text-white transition-all duration-200 font-semibold"
              >
                <LifeBuoy className="w-4 h-4 mr-2" />
                Abrir Ticket
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gradient-to-r from-[#FFB833] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF8C00] text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200">
                <Sparkles className="w-4 h-4 mr-2" />
                Nova Contratação
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-none overflow-hidden bg-gradient-to-br from-white to-blue-50/50 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Server className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full border border-green-200">Ativo</span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">3</div>
                <div className="text-sm font-medium text-gray-600">Serviços Ativos</div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-green-600 font-semibold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +1 este mês
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-none overflow-hidden bg-gradient-to-br from-white to-orange-50/50 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200">Pendente</span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">1</div>
                <div className="text-sm font-medium text-gray-600">Fatura em Aberto</div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-orange-600 font-semibold">
                    <DollarSign className="w-3 h-3 mr-1" />
                    R$ 149,90
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-none overflow-hidden bg-gradient-to-br from-white to-purple-50/50 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <LifeBuoy className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">0</div>
                <div className="text-sm font-medium text-gray-600">Tickets Abertos</div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500 font-semibold">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                    Tudo resolvido
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-none overflow-hidden bg-gradient-to-br from-white to-green-50/50 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                  100%
                </div>
                <div className="text-sm font-medium text-gray-600">Uptime Mensal</div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-green-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Excelente desempenho
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-none bg-white">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#FFB833] to-[#FFA500] bg-clip-text text-transparent flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#FFB833]" />
                    Meus Serviços
                  </CardTitle>
                  <Link to="/client-dashboard/services">
                    <Button variant="ghost" size="sm" className="text-[#FFB833] hover:text-[#FFA500] hover:bg-orange-50">
                      Ver Todos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    { name: 'VPS Cloud Pro', ip: '192.168.1.10', location: 'São Paulo', status: 'online', cpu: '45%', ram: '62%' },
                    { name: 'VPS Cloud Business', ip: '192.168.1.20', location: 'São Paulo', status: 'online', cpu: '28%', ram: '41%' }
                  ].map((service, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Server className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{service.name}</h4>
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono space-y-1">
                              <div>IP: {service.ip} • {service.location}</div>
                              <div className="flex gap-3">
                                <span>CPU: {service.cpu}</span>
                                <span>RAM: {service.ram}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link to="/client-dashboard/services">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-[#FFB833] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF8C00] text-white font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Gerenciar
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#FFB833] to-[#FFA500] text-white shadow-xl border-none overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Status do Sistema</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm font-semibold">Todos os sistemas operacionais</span>
                  </div>
                  <Link to="/status">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-white text-[#FFB833] hover:bg-gray-100 font-semibold shadow-md"
                    >
                      Ver Status Page
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="text-lg font-bold text-gray-900">Últimas Novidades</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-transparent border-l-4 border-[#FFA500] pl-4 py-3 rounded-r-lg">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">Novo Data Center em SP</h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      Expandimos nossa infraestrutura com conexão direta ao IX.br...
                    </p>
                    <Link to="/blog" className="text-xs text-[#FFA500] font-bold hover:underline inline-flex items-center">
                      Ler mais
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardHome;
