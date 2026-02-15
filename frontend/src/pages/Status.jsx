import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Activity, 
  Clock, 
  Server, 
  Globe, 
  Wifi, 
  Zap,
  CloudDrizzle,
  Monitor,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

const StatusBadge = ({ status }) => {
  const config = {
    operational: { color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2, text: "Operacional" },
    degraded: { color: "text-orange-600 bg-orange-50 border-orange-200", icon: AlertTriangle, text: "Degradado" },
    partial_outage: { color: "text-red-600 bg-red-50 border-red-200", icon: AlertTriangle, text: "Interrupção Parcial" },
    major_outage: { color: "text-red-700 bg-red-100 border-red-300", icon: XCircle, text: "Fora do Ar" },
    investigating: { color: "text-hostever-secondary bg-hostever-secondary/10 border-hostever-secondary/20", icon: Activity, text: "Investigando" },
    completed: { color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2, text: "Resolvido" },
  };
  
  const current = config[status] || config.operational;
  const Icon = current.icon;

  return (
    <div className={cn("flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", current.color)}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {current.text}
    </div>
  );
};

const ServiceGroup = ({ title, icon: Icon, services }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center">
      <div className="p-2 rounded-lg bg-hostever-secondary/10 shadow-sm border border-hostever-secondary/20 mr-3 text-hostever-secondary">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-bold text-hostever-primary font-sora">{title}</h3>
    </div>
    <div className="divide-y divide-gray-50">
      {services.map((service) => (
        <div key={service.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <span className="font-medium text-gray-700 font-sans text-sm">{service.name}</span>
            <div className="hidden sm:flex gap-0.5 h-1.5 w-24 ml-auto mr-4 opacity-50 group-hover:opacity-100 transition-opacity">
              {[...Array(10)].map((_, i) => {
                const barStatus = service.status;
                return (
                  <div key={i} className={cn("flex-1 rounded-full",
                    barStatus === 'operational' ? 'bg-green-400' :
                    barStatus === 'degraded' ? 'bg-orange-400' :
                    barStatus === 'partial_outage' || barStatus === 'major_outage' ? 'bg-red-400' : 'bg-gray-200'
                  )} />
                );
              })}
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
             <StatusBadge status={service.status} />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const UptimeChart = () => {
  const days = 90;
  // Simulate statuses for 90 days
  const dayStatuses = useMemo(() => {
    const statuses = [];
    for (let i = 0; i < days; i++) {
      if (i === 76) statuses.push('major_outage'); // Simulate an outage
      else if (i === 45 || i === 85) statuses.push('degraded'); // Simulate a degradation
      else statuses.push('operational');
    }
    return statuses;
  }, [days]);

  return (
    <div className="mt-4">
      <div className="flex items-end h-12 gap-[3px]">
        {dayStatuses.map((status, i) => {
          const colorClass = status === 'operational' ? 'bg-green-500' : status === 'degraded' ? 'bg-orange-400' : 'bg-red-500';
          const heightClass = status === 'operational' ? 'h-full' : status === 'degraded' ? 'h-3/4' : 'h-full';
          
          return (
            <div 
              key={i} 
              className={cn(
                "flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-help relative group",
                colorClass,
                heightClass
              )}
            >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    {status === 'operational' ? "Operacional" : status === 'degraded' ? "Lentidão" : "Interrupção"}
                </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium font-sans">
        <span>90 dias atrás</span>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operacional</div>
             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Degradação</div>
             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Interrupção</div>
        </div>
        <span>Hoje</span>
      </div>
    </div>
  );
};

const Status = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const locale = currentLang === 'pt' ? ptBR : enUS;

  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    try {
      const res = await fetch('http://localhost:3001/api/status/current');
      const data = await res.json();
      setServices(data.services || []);
      setIncidents(data.incidents || []);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    } finally {
      setLoading(false);
    }
  }

  const groupedServices = useMemo(() => {
    return {
      core: services.filter(s => ['Painel de Controle', 'Website'].includes(s.name)),
      region: services.filter(s => ['VPS Cloud', 'VPS Games'].includes(s.name)),
      infra: services.filter(s => s.name === 'Servidores Dedicados'),
      other: [],
    };
  }, [services]);

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 'issues';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-hostever-secondary animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Status do Sistema - HostEver</title>
        <meta name="description" content="Verifique o status em tempo real de nossos servidores e serviços. Transparência total." />
      </Helmet>

      <div className="min-h-screen bg-white font-sans text-gray-900">
        
        {/* Simple Clean Header */}
        <section className="bg-white border-b border-gray-100 py-12 lg:py-16">
          <div className="container-page text-center">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                 <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-hostever-secondary/10 mb-6">
                    <Activity className="w-4 h-4 text-hostever-secondary mr-2 animate-pulse" />
                    <span className="font-bold tracking-widest uppercase text-xs text-hostever-secondary">System Status</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-extrabold text-hostever-primary mb-4 font-sora">
                    Status dos Serviços
                 </h1>
                 <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                   Acompanhe em tempo real a disponibilidade de nossa infraestrutura.
                 </p>
             </motion.div>
          </div>
        </section>

        <div className="container-page py-12 max-w-5xl mx-auto relative z-10">
          {/* Subtle gradient pattern */}
          <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-hostever-secondary/5 via-transparent to-transparent"></div>
          </div>

          {/* Main Status Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "rounded-2xl p-8 shadow-xl mb-16 border flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-2xl hover:scale-[1.005]",
              overallStatus === 'operational' 
                ? "bg-gradient-to-br from-green-50 to-white border-green-200" 
                : "bg-gradient-to-br from-orange-50 to-white border-orange-200"
            )}
          >
             <div className="flex items-center gap-6">
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm",
                    overallStatus === 'operational' ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                )}>
                    {overallStatus === 'operational' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                </div>
                <div>
                  <h2 className={cn("text-2xl font-bold font-sora mb-1", overallStatus === 'operational' ? "text-hostever-primary" : "text-hostever-primary")}>
                    {overallStatus === 'operational' ? "Todos os sistemas operacionais" : "Instabilidade Detectada"}
                  </h2>
                  <p className="text-gray-500 text-sm">Última atualização: <span className="font-medium text-gray-900">{format(new Date(), "HH:mm", { locale })} UTC-3</span></p>
                </div>
             </div>
             
             <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-gray-200/50 pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Uptime Global</div>
                    <div className="text-3xl font-extrabold text-hostever-primary font-sora">99.98%</div>
                </div>
             </div>
          </motion.div>

          {/* Active Incidents Section */}
          {incidents.filter(i => i.status !== 'resolved').length > 0 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mb-16"
            >
               <h3 className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-6 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Incidentes em Andamento
               </h3>
               <div className="space-y-6">
                 {incidents.filter(i => i.status !== 'resolved').map(incident => (
                   <div key={incident.id} className="bg-white border border-orange-200 rounded-2xl p-6 shadow-lg shadow-orange-500/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                         <h4 className="text-xl font-bold text-hostever-primary font-sora">{incident.title}</h4>
                         <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide self-start md:self-auto">
                           {incident.status === 'investigating' ? 'Investigando' : 
                            incident.status === 'identified' ? 'Identificado' : 
                            incident.status === 'monitoring' ? 'Monitorando' : 'Em Andamento'}
                         </span>
                      </div>
                      <div className="space-y-8 pl-4 md:pl-6 border-l-2 border-gray-100 ml-2">
                        <div className="relative">
                          <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-gray-300 shadow-sm"></div>
                          <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wide">
                            {format(new Date(incident.started_at), "dd 'de' MMMM 'às' HH:mm", { locale })}
                          </p>
                          <p className="text-gray-700 text-base leading-relaxed">{incident.description}</p>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {/* Service Grid */}
          <div className="mb-20">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-hostever-primary font-sora flex items-center">
                    <Server className="w-5 h-5 mr-3 text-hostever-secondary" />
                    Infraestrutura & Serviços
                </h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <ServiceGroup title="Cloud Regions" icon={CloudDrizzle} services={groupedServices.region} />
                <ServiceGroup title="Network & Security" icon={ShieldCheck} services={groupedServices.infra} />
                <ServiceGroup title="Core Platform" icon={Monitor} services={groupedServices.core} />
                <ServiceGroup title="Support & Addons" icon={LifeBuoy} services={groupedServices.other} />
             </div>
          </div>

          {/* History Chart */}
          <div className="mb-20">
             <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-hostever-primary flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-hostever-secondary" /> Histórico de Disponibilidade
                    </h3>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">Sistema Saudável</span>
                 </div>
                 <UptimeChart />
             </div>
          </div>

          {/* Past Incidents */}
          <div className="border-t border-gray-100 pt-12">
             <h3 className="text-xl font-bold text-hostever-primary font-sora mb-8">Incidentes Resolvidos Recentemente</h3>
             <div className="grid gap-4">
                {incidents.filter(i => i.status === 'resolved').map(incident => (
                  <div key={incident.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-white hover:shadow-md transition-all duration-300">
                       <div className="mb-2 md:mb-0">
                          <div className="flex items-center gap-3 mb-1">
                             <CheckCircle2 className="w-4 h-4 text-green-500" />
                             <h4 className="font-bold text-hostever-primary text-sm">{incident.title}</h4>
                          </div>
                          <p className="text-gray-500 text-xs pl-7">
                            Incidente resolvido em {format(new Date(incident.resolved_at || incident.started_at), "dd/MM/yyyy", { locale })}
                          </p>
                       </div>
                       <StatusBadge status="completed" />
                  </div>
                ))}
                {incidents.filter(i => i.status === 'resolved').length === 0 && (
                  <p className="text-gray-400 text-center py-8">Nenhum incidente resolvido recentemente</p>
                )}
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Status;