
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cloud, Cpu, Zap, HardDrive, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlansData } from '@/hooks/usePlansData';
import LocationSelector from '@/components/LocationSelector';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

const VpsCard = ({ plan, popular, selectedLocation }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "bg-white rounded-3xl p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 group",
      popular 
        ? "border-2 border-hostever-secondary shadow-[0_20px_50px_-12px_rgba(15,157,223,0.25)] z-10" 
        : "border border-gray-100 hover:border-hostever-secondary/50 hover:shadow-xl"
  )}>
    {popular && (
        <div className="absolute top-0 right-0 bg-hostever-secondary text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest font-sora">
            Popular
        </div>
    )}
    
    <div className="mb-6">
       <div className={cn(
           "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300",
           popular ? "bg-hostever-secondary text-white" : "bg-hostever-secondary/10 text-hostever-secondary group-hover:bg-hostever-secondary group-hover:text-white"
       )}>
          <Cloud className="w-7 h-7" />
       </div>
       <h3 className="text-2xl font-bold text-gray-900 font-sora mb-2">{plan.name}</h3>
       <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">NVMe Performance</p>
    </div>
    
    <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-baseline">
            <span className="text-sm font-semibold text-gray-400 mr-1">R$</span>
            <span className="text-4xl font-extrabold text-gray-900 font-sora tracking-tight">{plan.price}</span>
            <span className="text-gray-500 text-xs font-medium ml-1">/mês</span>
        </div>
    </div>

    <div className="space-y-4 mb-8 flex-grow">
        <div className="flex items-center text-sm text-gray-600 font-medium">
            <Cpu className="w-5 h-5 mr-3 text-hostever-secondary" /> 
            <span className="font-bold text-gray-900 mr-1">{plan.specs.vcpu}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 font-medium">
            <Zap className="w-5 h-5 mr-3 text-hostever-secondary" /> 
            <span className="font-bold text-gray-900 mr-1">{plan.specs.ram}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 font-medium">
            <HardDrive className="w-5 h-5 mr-3 text-hostever-secondary" /> 
            <span className="font-bold text-gray-900 mr-1">{plan.specs.ssd}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 font-medium">
            <Shield className="w-5 h-5 mr-3 text-hostever-secondary" /> 
            Anti-DDoS <span className="text-hostever-secondary text-xs bg-hostever-secondary/10 px-2 py-0.5 rounded-full ml-2">PRO</span>
        </div>
    </div>

    <PlanCheckoutButton 
      plan={plan} 
      planType="vps" 
      location={selectedLocation || 'br'} 
    />
  </motion.div>
);

const VpsCloud = () => {
  const { plans } = usePlansData();
  const [selectedLocation, setSelectedLocation] = useState('br');
  
  // Filtering based on location
  const vpsPlans = plans.vps?.[selectedLocation] || [];

  return (
    <>
      <Helmet>
        <title>VPS Cloud Performance - HostEver</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 font-sans">
        
        {/* Header Section */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-hostever-darker">
            {/* Custom Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1506399558188-acca6f8cbf41" 
                    alt="Rows of green server racks" 
                    className="w-full h-full object-cover opacity-30" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hostever-darker via-hostever-darker/80 to-transparent"></div>
            </div>

            <div className="container-page relative z-10 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                     <div className="inline-flex items-center gap-2 bg-hostever-secondary/10 text-hostever-secondary border border-hostever-secondary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 font-sora backdrop-blur-sm">
                        <Cloud className="w-4 h-4" /> Cloud Computing
                     </div>
                     <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight font-sora">
                        VPS Cloud <span className="text-transparent bg-clip-text bg-gradient-to-r from-hostever-secondary to-hostever-accent">Performance</span>
                     </h1>
                     <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        Instâncias virtuais de alta velocidade com armazenamento NVMe puro. Latência mínima e escalabilidade instantânea para levar seu negócio ao próximo nível.
                     </p>
                </motion.div>
            </div>
        </section>

        <section className="py-24 -mt-16 relative z-20">
            <div className="container-page">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sora">Escolha a Localização</h2>
                  <LocationSelector 
                    selectedLocation={selectedLocation} 
                    onSelectLocation={setSelectedLocation} 
                  />
                </div>

                {/* Using AnimatePresence for smooth transitions between plan lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    <AnimatePresence mode="popLayout">
                        {vpsPlans.length > 0 ? (
                            vpsPlans.map((plan) => (
                                <VpsCard 
                                    key={plan.id}
                                    plan={plan}
                                    popular={plan.popular}
                                    selectedLocation={selectedLocation}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                Nenhum plano disponível para esta região no momento.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>

        <section className="py-20 bg-white">
            <div className="container-page text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-16 font-sora">Por que escolher nossa <span className="text-hostever-secondary">Cloud?</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     <div className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100">
                         <div className="w-16 h-16 bg-hostever-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-hostever-secondary group-hover:bg-hostever-secondary group-hover:text-white transition-colors">
                             <Zap className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3 font-sora">NVMe Ultra Speed</h3>
                         <p className="text-gray-500 leading-relaxed">Discos 10x mais rápidos que SSDs comuns, garantindo leitura e escrita instantâneas para bancos de dados.</p>
                     </div>
                     <div className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100">
                         <div className="w-16 h-16 bg-hostever-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-hostever-secondary group-hover:bg-hostever-secondary group-hover:text-white transition-colors">
                             <Shield className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3 font-sora">Proteção DDoS Layer 7</h3>
                         <p className="text-gray-500 leading-relaxed">Seu servidor blindado contra ataques volumétricos e de aplicação. Tráfego limpo entregue diretamente no seu IP.</p>
                     </div>
                     <div className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100">
                         <div className="w-16 h-16 bg-hostever-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-hostever-secondary group-hover:bg-hostever-secondary group-hover:text-white transition-colors">
                             <Cpu className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3 font-sora">KVM Virtualization</h3>
                         <p className="text-gray-500 leading-relaxed">Recursos 100% dedicados e isolados. O que você contrata é o que você recebe, sem overselling de CPU ou RAM.</p>
                     </div>
                </div>
            </div>
        </section>

      </div>
    </>
  );
};

export default VpsCloud;
