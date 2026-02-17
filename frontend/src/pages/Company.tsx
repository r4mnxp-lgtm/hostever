import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Zap, Clock, Rocket, Target, Globe, MapPin, Server, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useLeadForm } from '@/contexts/LeadFormContext';
import { Link } from 'react-router-dom';
import { useCompanyData } from '@/hooks/useCompanyData';

const FeatureBlock = ({ icon: Icon, title, description }) => (
    <div className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 text-[#84cc16]">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

const Company = () => {
  const { t } = useTranslation();
  const { openLeadForm } = useLeadForm();
  const { companyData } = useCompanyData();

  const stats = [
    { number: '10+', label: "Anos de Mercado" },
    { number: '5k+', label: "Clientes Ativos" },
    { number: '99.9%', label: "Uptime Garantido" },
    { number: '24/7', label: "Suporte Humano" }
  ];

  return (
    <>
      <Helmet>
        <title>Sobre a HostEver - Infraestrutura Corporativa</title>
        <meta name="description" content={companyData.description} />
      </Helmet>

      <div className="bg-white font-sans text-gray-900">
        
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gray-900 text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                     <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-white/10 backdrop-blur-sm mb-8 border border-white/10">
                        <span className="font-bold tracking-wide uppercase text-xs text-[#84cc16]">Conheça a HostEver</span>
                     </div>
                     <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Infraestrutura que <span className="text-[#84cc16]">Impulsiona Negócios</span>
                     </h1>
                     <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Muito mais que servidores. Somos parceiros estratégicos de tecnologia para empresas que não podem parar.
                     </p>
                 </motion.div>
             </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Nossa História</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                    <p>{companyData.historyP1}</p>
                    <p>{companyData.historyP2}</p>
                    <p>{companyData.historyP3}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-10 border-t border-gray-100 pt-8">
                     <div>
                        <div className="text-3xl font-bold text-[#84cc16] mb-1">2013</div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Fundação</div>
                     </div>
                     <div>
                        <div className="text-3xl font-bold text-[#84cc16] mb-1">Tier III</div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Certificação</div>
                     </div>
                </div>

              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative">
                 <div className="absolute -inset-4 bg-gray-100 rounded-3xl -z-10 rotate-3"></div>
                 <img-replace alt="Modern corporate office meeting" className="rounded-2xl shadow-xl w-full" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-16 bg-[#84cc16]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((stat, idx) => (
                        <div key={idx}>
                            <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.number}</div>
                            <div className="text-sm font-bold uppercase tracking-wider opacity-90">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Data Centers Section (Integrated) */}
        <section className="py-24 bg-gray-50">
             <div className="max-w-7xl mx-auto px-4">
                 <div className="text-center mb-16">
                     <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Presença Global</h2>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">Data Centers estrategicamente posicionados para garantir a menor latência.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <MapPin className="w-10 h-10 text-[#84cc16] mb-6" />
                         <h3 className="text-xl font-bold text-gray-900 mb-2">São Paulo, BR</h3>
                         <p className="text-gray-500 mb-4 text-sm">Latência mínima para todo o Brasil. Conexão direta ao PTT-SP.</p>
                         <ul className="space-y-2 text-sm text-gray-600">
                             <li className="flex items-center"><Server className="w-4 h-4 mr-2 text-gray-400"/> Tier III Certified</li>
                             <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-gray-400"/> Redundância 2N+1</li>
                         </ul>
                     </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <MapPin className="w-10 h-10 text-[#84cc16] mb-6" />
                         <h3 className="text-xl font-bold text-gray-900 mb-2">Fortaleza, BR</h3>
                         <p className="text-gray-500 mb-4 text-sm">Hub de conectividade internacional. Entrada dos cabos submarinos.</p>
                         <ul className="space-y-2 text-sm text-gray-600">
                             <li className="flex items-center"><Globe className="w-4 h-4 mr-2 text-gray-400"/> Conectividade Global</li>
                             <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-gray-400"/> Alta Densidade</li>
                         </ul>
                     </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <MapPin className="w-10 h-10 text-[#84cc16] mb-6" />
                         <h3 className="text-xl font-bold text-gray-900 mb-2">Miami, US</h3>
                         <p className="text-gray-500 mb-4 text-sm">Gateway das Américas. Ideal para redundância e aplicações globais.</p>
                         <ul className="space-y-2 text-sm text-gray-600">
                             <li className="flex items-center"><Shield className="w-4 h-4 mr-2 text-gray-400"/> Proteção Anti-DDoS+</li>
                             <li className="flex items-center"><Server className="w-4 h-4 mr-2 text-gray-400"/> Hardware Recente</li>
                         </ul>
                     </div>
                 </div>
                 
                 <div className="mt-12 text-center">
                     <Button variant="outline" className="border-gray-300" asChild>
                         <Link to="/data-centers">Ver Detalhes da Infraestrutura</Link>
                     </Button>
                 </div>
             </div>
        </section>

        {/* Anti-DDoS Section (Integrated) */}
        <section className="py-24 bg-white">
             <div className="max-w-7xl mx-auto px-4">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="order-2 lg:order-1 relative">
                        <div className="absolute -inset-4 bg-gray-50 rounded-full blur-3xl -z-10"></div>
                        <img-replace alt="Security shield visualization protecting server" className="rounded-2xl shadow-lg w-full" />
                     </div>
                     <div className="order-1 lg:order-2">
                         <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#84cc16]/10 text-[#84cc16] text-xs font-bold uppercase tracking-wide mb-6">
                            <Activity className="w-4 h-4 mr-2" /> Segurança Cibernética
                         </div>
                         <h2 className="text-3xl font-bold text-gray-900 mb-6">Proteção Anti-DDoS Nativa</h2>
                         <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Não deixamos sua operação desprotegida. Todos os nossos links possuem proteção contra ataques de negação de serviço (DDoS) inclusa, com capacidade de mitigação de terabits.
                         </p>
                         <div className="space-y-4">
                            <FeatureBlock icon={Shield} title="Mitigação Always-On" description="Detecção e limpeza de tráfego malicioso em tempo real, sem intervenção manual." />
                            <FeatureBlock icon={Activity} title="Camadas 3, 4 e 7" description="Proteção abrangente desde ataques volumétricos de rede até ataques complexos na camada de aplicação." />
                         </div>
                         <div className="mt-8">
                             <Button asChild className="bg-gray-900 text-white hover:bg-gray-800">
                                 <Link to="/anti-ddos">Saiba mais sobre Segurança</Link>
                             </Button>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gray-900 text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para elevar o nível?</h2>
              <p className="text-xl text-gray-400 mb-8">Nossos consultores estão prontos para desenhar a arquitetura ideal para o seu negócio.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={openLeadForm} size="lg" className="bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold h-12 px-8">
                  Fale com um Consultor
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-12 px-8">
                  <Link to="/carreiras">Trabalhe Conosco</Link>
                </Button>
              </div>
            </div>
        </section>
      </div>
    </>
  );
};

export default Company;