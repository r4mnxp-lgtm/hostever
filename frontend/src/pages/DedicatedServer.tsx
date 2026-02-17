
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Shield, 
  Clock, 
  Globe, 
  Zap,
  AlertCircle
} from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import { usePlansData } from '@/hooks/usePlansData';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

const DedicatedServer = () => {
  const { plans } = usePlansData();
  const [selectedLocation, setSelectedLocation] = useState('br');
  const dedicatedServers = plans.dedicated?.[selectedLocation] || [];

  return (
    <>
      <Helmet>
        <title>Servidores Dedicados Bare Metal - HostEver</title>
        <meta name="description" content="Servidores Bare Metal com hardware exclusivo e rede premium. Controle total e performance máxima." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        
        {/* Header Section */}
        <section className="relative pt-24 pb-20 overflow-hidden bg-hostever-darker">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
                <img 
                    src="https://images.unsplash.com/photo-1521381359111-074b104d1c79" 
                    alt="Server rack with cables" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-hostever-darker via-hostever-darker/90 to-transparent"></div>
            </div>
            
            <div className="container-page relative z-10 text-white">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-3/5 text-center lg:text-left">
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                             <div className="inline-flex items-center gap-2 bg-hostever-secondary/20 text-hostever-secondary border border-hostever-secondary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 font-sans">
                                <Server className="w-4 h-4" />
                                Infraestrutura Bare Metal
                             </div>
                             
                             <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight font-sora">
                                Servidores <span className="text-hostever-secondary">Dedicados</span>
                             </h1>
                             
                             <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                                Hardware físico exclusivo. Sem compartilhamento de recursos, sem vizinhos ruidosos. Apenas performance bruta para sua aplicação crítica.
                             </p>
                             
                             <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Button className="bg-hostever-secondary hover:bg-hostever-secondary/90 text-white h-14 px-10 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all font-sans w-full sm:w-auto">
                                    Ver Opções Disponíveis
                                </Button>
                             </div>
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Bar */}
        <section className="py-12 bg-white border-b border-gray-100 shadow-sm relative z-20 -mt-8 mx-4 lg:mx-8 rounded-2xl max-w-[1400px] lg:mx-auto">
             <div className="px-6 lg:px-12">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-hostever-secondary">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-gray-900 font-sora">99.9% SLA</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Garantido</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-hostever-secondary">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-gray-900 font-sora">Anti-DDoS</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Incluso</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-hostever-secondary">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-gray-900 font-sora">Global</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Datacenters</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-hostever-secondary">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-gray-900 font-sora">24h Delivery</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Entrega Rápida</div>
                        </div>
                     </div>
                 </div>
             </div>
        </section>

        {/* Pricing Table Section */}
        <section className="py-24 container-page">
             <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold font-sora text-gray-900 mb-4">Escolha seu <span className="text-hostever-secondary">Poder de Fogo</span></h2>
                 <p className="text-gray-500 max-w-2xl mx-auto mb-10">Configurações flexíveis para atender desde servidores web até clusters de virtualização complexos.</p>
                 
                 <LocationSelector 
                   selectedLocation={selectedLocation} 
                   onSelectLocation={setSelectedLocation} 
                 />
             </div>

             <div className="w-full overflow-x-auto rounded-t-2xl shadow-xl border border-gray-100">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-hostever-secondary text-white">
                      <th className="py-5 px-6 font-bold uppercase text-xs tracking-wider">Processador</th>
                      <th className="py-5 px-6 font-bold uppercase text-xs tracking-wider">Memória</th>
                      <th className="py-5 px-6 font-bold uppercase text-xs tracking-wider">Armazenamento</th>
                      <th className="py-5 px-6 font-bold uppercase text-xs tracking-wider">Uplink</th>
                      <th className="py-5 px-6 font-bold uppercase text-xs tracking-wider">Preço</th>
                      <th className="py-5 px-6 font-bold uppercase text-xs tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence mode="popLayout">
                        {dedicatedServers.map((server) => (
                        <motion.tr 
                            key={server.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/50"
                        >
                            <td className="py-6 px-6 align-middle">
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900 text-[15px]">{server.name}</span>
                                <span className="text-xs text-gray-500 mt-1 font-medium">{server.specs.cpu}</span>
                            </div>
                            </td>
                            <td className="py-6 px-6 align-middle">
                            <span className="font-medium text-gray-700">{server.specs.ram}</span>
                            </td>
                            <td className="py-6 px-6 align-middle">
                            <span className="font-medium text-gray-700">{server.specs.ssd}</span>
                            </td>
                            <td className="py-6 px-6 align-middle">
                            <span className="font-medium text-gray-700">{server.bandwidth}</span>
                            </td>
                            <td className="py-6 px-6 align-middle">
                            <div className="flex items-baseline">
                                <span className="text-sm font-semibold text-gray-400 mr-1">R$</span>
                                <span className="text-lg font-bold text-gray-900">{server.price}</span>
                                <span className="text-xs text-gray-500 ml-1">/mensal</span>
                            </div>
                            </td>
                            <td className="py-6 px-6 align-middle text-right">
                            {server.available ? (
                                <PlanCheckoutButton 
                                  plan={server} 
                                  planType="dedicated" 
                                  location={selectedLocation || 'br'} 
                                />
                            ) : (
                                <Button 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold min-w-[100px] cursor-not-allowed"
                                disabled
                                >
                                Indisponível
                                </Button>
                            )}
                            </td>
                        </motion.tr>
                        ))}
                    </AnimatePresence>
                  </tbody>
                </table>
             </div>
             
             <div className="mt-8 flex items-start gap-3 text-sm text-gray-500 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>
                  * O tráfego de uplink pode variar de acordo com a disponibilidade da rede e políticas de uso justo. Para garantia de banda dedicada, entre em contato com nosso time de vendas para uma cotação personalizada de IP Transit.
                </p>
             </div>

        </section>

      </div>
    </>
  );
};

export default DedicatedServer;
