
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Shield, Zap, Server, Globe, ArrowRight, Network, Wifi, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DataCenters = () => {
  return (
    <>
      <Helmet>
        <title>Data Centers Globais - HostEver</title>
        <meta name="description" content="Infraestrutura global em Miami e São Paulo com baixa latência e alta disponibilidade." />
      </Helmet>

      <div className="bg-white min-h-screen font-sans overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1695668548342-c0c1ad479aee" 
               alt="Data Center Corridor" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#FFB833]/95 to-[#FFA500]/80 mix-blend-multiply"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                 <Globe className="w-4 h-4 text-[#FFA500] mr-2" />
                 <span className="text-sm font-bold uppercase tracking-widest">Infraestrutura Global</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-sora">
                Conectividade sem <br/><span className="text-[#FFA500]">Fronteiras</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                Operamos em pontos estratégicos para garantir a menor latência e a maior estabilidade para suas aplicações críticas.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-24 bg-gray-50 relative">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 -mt-32 relative z-20">
                 
                 {/* São Paulo */}
                 <motion.div 
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-[#FFA500]/10 transition-all duration-300 border border-gray-100 group"
                 >
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <img src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/444c147d46e25c753d13030f23c9ba25.png" alt="Brasil" className="w-12 h-auto rounded shadow-sm" />
                          <div>
                             <h3 className="text-2xl font-bold text-[#FFB833] font-sora">São Paulo</h3>
                             <p className="text-[#FFA500] font-bold text-xs uppercase tracking-widest">Brasil (BR)</p>
                          </div>
                       </div>
                       <MapPin className="w-8 h-8 text-gray-200 group-hover:text-[#FFA500] transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                       Localizado no coração financeiro da América Latina, nosso Data Center em SP oferece conexão direta ao PTT-SP (IX.br), garantindo latência inferior a 5ms para a maioria dos provedores nacionais.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Wifi className="w-4 h-4 text-[#FFA500]"/> Baixa Latência</div>
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Shield className="w-4 h-4 text-[#FFA500]"/> Anti-DDoS BR</div>
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Zap className="w-4 h-4 text-[#FFA500]"/> Tier III Design</div>
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Network className="w-4 h-4 text-[#FFA500]"/> Conexão IX.br</div>
                    </div>
                    <Button className="w-full bg-[#FFB833] hover:bg-[#2c3b5a] text-white font-bold h-12 rounded-xl uppercase tracking-widest shadow-lg" asChild>
                       <Link to="/servidores-dedicados">Ver Servidores no Brasil</Link>
                    </Button>
                 </motion.div>

                 {/* Miami */}
                 <motion.div 
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-[#FFA500]/10 transition-all duration-300 border border-gray-100 group"
                 >
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <img src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/8c04d80d0c1ea9bb77309796c8d4a217.png" alt="USA" className="w-12 h-auto rounded shadow-sm" />
                          <div>
                             <h3 className="text-2xl font-bold text-[#FFB833] font-sora">Miami</h3>
                             <p className="text-[#FFA500] font-bold text-xs uppercase tracking-widest">Estados Unidos (US)</p>
                          </div>
                       </div>
                       <MapPin className="w-8 h-8 text-gray-200 group-hover:text-[#FFA500] transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                       Gateway das Américas. Nossa estrutura em Miami oferece o melhor custo-benefício com hardware de ponta e conectividade premium com rotas otimizadas para o Brasil e América Latina.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Server className="w-4 h-4 text-[#FFA500]"/> Hardware Recente</div>
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Shield className="w-4 h-4 text-[#FFA500]"/> 10Tbps+ Mitigation</div>
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Zap className="w-4 h-4 text-[#FFA500]"/> Tier IV Design</div>
                       <div className="flex items-center gap-2 text-sm text-gray-600"><Network className="w-4 h-4 text-[#FFA500]"/> Global Transit</div>
                    </div>
                    <Button className="w-full bg-[#FFA500] hover:bg-[#FFA500] text-white font-bold h-12 rounded-xl uppercase tracking-widest shadow-lg shadow-[#FFA500]/20" asChild>
                       <Link to="/servidor-vps">Ver Servidores em Miami</Link>
                    </Button>
                 </motion.div>

              </div>
           </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-[#FFB833] font-sora mb-4">Padrão Mundial de Qualidade</h2>
                 <p className="text-gray-600 max-w-2xl mx-auto">Não importa a localização, nossa exigência técnica permanece a mesma.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { icon: Lock, title: "Segurança Física", desc: "Controle de acesso biométrico, CFTV 24/7 e segurança armada em todas as instalações." },
                    { icon: Zap, title: "Energia Redundante", desc: "Sistemas UPS N+1 e geradores a diesel com autonomia estendida para garantia de uptime." },
                    { icon: Network, title: "Carrier Neutral", desc: "Múltiplas operadoras de trânsito IP conectadas via fibra óptica redundante." }
                 ].map((item, idx) => (
                    <motion.div 
                       key={idx}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       viewport={{ once: true }}
                       className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                       <div className="w-14 h-14 bg-[#FFA500]/10 rounded-xl flex items-center justify-center text-[#FFA500] mb-6">
                          <item.icon className="w-7 h-7" />
                       </div>
                       <h3 className="text-xl font-bold text-[#FFB833] mb-3">{item.title}</h3>
                       <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </>
  );
};

export default DataCenters;
