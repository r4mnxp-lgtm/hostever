
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Shield, ChevronRight, Gauge, Check, X, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlansData } from '@/hooks/usePlansData';
import LocationSelector from '@/components/LocationSelector';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

const ComparisonCard = ({ title, price, bandwidth, virtualization, support, isHighlight }) => (
    <div className={cn(
        "relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300",
        isHighlight 
            ? "bg-white border-hostever-secondary shadow-xl shadow-hostever-secondary/10 scale-105 z-10" 
            : "bg-gray-50 border-gray-200 opacity-90 hover:opacity-100 hover:shadow-lg"
    )}>
        {isHighlight && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-hostever-secondary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Melhor Custo-Benefício
            </div>
        )}
        
        <div className="text-center mb-6">
            <h3 className={cn("text-xl font-bold mb-2 font-sora", isHighlight ? "text-gray-900" : "text-gray-600")}>{title}</h3>
            <div className="flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-400 mr-1">R$</span>
                <span className={cn("text-4xl font-extrabold font-sora", isHighlight ? "text-hostever-secondary" : "text-gray-900")}>{price}</span>
                <span className="text-xs text-gray-500 ml-1">/mês</span>
            </div>
        </div>

        <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Link de Rede</span>
                <span className={cn("text-sm font-bold", isHighlight ? "text-hostever-secondary" : "text-gray-700")}>{bandwidth}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Virtualização</span>
                <span className="text-sm font-bold text-gray-700">{virtualization}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Suporte</span>
                <span className="text-sm font-bold text-gray-700">{support}</span>
            </div>
            <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500 font-medium">Proteção DDoS</span>
                {isHighlight ? (
                    <span className="flex items-center text-hostever-secondary font-bold text-xs bg-hostever-secondary/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Incluso
                    </span>
                ) : (
                   <span className="flex items-center text-gray-400 font-medium text-xs">
                        <X className="w-3 h-3 mr-1" /> Básico/Pago
                   </span>
                )}
            </div>
        </div>
        
        {isHighlight && (
             <Button className="w-full mt-8 bg-hostever-secondary hover:bg-hostever-secondary/90 text-white font-bold rounded-xl h-12 uppercase tracking-widest text-xs font-sora shadow-lg shadow-hostever-secondary/20">
                Contratar Agora
            </Button>
        )}
    </div>
);

const PlanCard = ({ plan, popular, selectedLocation }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 font-sora">{plan.name}</h3>
            {popular && <span className="bg-hostever-secondary/10 text-hostever-secondary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Popular</span>}
        </div>
        
        <div className="mb-6">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">R$ {plan.price}</span>
            <span className="text-gray-400 text-sm">/mês</span>
        </div>
        
        <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
                <Server className="w-4 h-4 mr-2 text-hostever-secondary" /> {plan.specs.vcpu}
            </div>
             <div className="flex items-center text-sm text-gray-600">
                <Zap className="w-4 h-4 mr-2 text-hostever-secondary" /> {plan.specs.ram}
            </div>
             <div className="flex items-center text-sm text-gray-600">
                <Gauge className="w-4 h-4 mr-2 text-hostever-secondary" /> {plan.specs.ssd}
            </div>
             <div className="flex items-center text-sm text-gray-600 font-bold">
                <Gauge className="w-4 h-4 mr-2 text-hostever-secondary" /> Porta 1 Gbps Ilimitada
            </div>
        </div>

        <PlanCheckoutButton 
          plan={plan} 
          planType="vps-economy" 
          location={selectedLocation || 'br'} 
        />
    </motion.div>
);

const VpsEconomy = () => {
    const { plans } = usePlansData();
    const [selectedLocation, setSelectedLocation] = useState('br');
    const economyPlans = plans.vpsEconomy?.[selectedLocation] || [];

    return (
        <>
            <Helmet>
                <title>VPS Economy - HostEver</title>
                <meta name="description" content="Servidores VPS baratos com alta performance. Porta de 1Gbps, SSD e Anti-DDoS incluso." />
            </Helmet>

            <div className="min-h-screen bg-white font-sans">
                {/* Hero */}
                <section className="pt-24 pb-16 bg-hostever-darker relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-hostever-secondary via-transparent to-transparent pointer-events-none"></div>
                     <div className="absolute inset-0 z-0 opacity-20">
                         <img 
                            src="https://images.unsplash.com/photo-1578728281593-a06405bf2c8e"
                            alt="Datacenter background"
                            className="w-full h-full object-cover"
                         />
                     </div>
                     
                     <div className="container-page relative z-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <span className="inline-block py-1 px-3 rounded-full bg-hostever-secondary/20 text-hostever-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-hostever-secondary/20">
                                Novo Produto
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-sora tracking-tight">
                                VPS <span className="text-hostever-secondary">Economy</span>
                            </h1>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                                A revolução do custo-benefício. Servidores KVM com performance real e preços que cabem no seu bolso.
                            </p>
                        </motion.div>
                     </div>
                </section>
                
                {/* 1Gbps Banner */}
                <div className="bg-hostever-secondary py-3 overflow-hidden">
                    <div className="container-page flex items-center justify-center text-white font-bold uppercase tracking-widest text-sm md:text-base gap-8 animate-pulse">
                        <span className="flex items-center gap-2"><Zap className="w-5 h-5 fill-white" /> 1 Gbps Porta Ilimitada</span>
                        <span className="hidden md:flex items-center gap-2"><Zap className="w-5 h-5 fill-white" /> Tráfego Ilimitado</span>
                        <span className="flex items-center gap-2"><Zap className="w-5 h-5 fill-white" /> Sem surpresas na fatura</span>
                    </div>
                </div>

                {/* Comparison Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container-page">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">Pare de pagar mais por menos</h2>
                            <p className="text-gray-500">Veja como a HostEver supera a concorrência em cada detalhe.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                            <ComparisonCard 
                                title="Concorrente A" 
                                price="29,90" 
                                bandwidth="100 Mbps" 
                                virtualization="Container (LXC)" 
                                support="Ticket (48h)" 
                                isHighlight={false} 
                            />
                            
                            <ComparisonCard 
                                title="HostEver Economy" 
                                price="14,99" 
                                bandwidth="1 Gbps Ilimitado" 
                                virtualization="KVM (Kernel Real)" 
                                support="WhatsApp / Chat" 
                                isHighlight={true} 
                            />

                            <ComparisonCard 
                                title="Concorrente B" 
                                price="35,00" 
                                bandwidth="Limitado (Franquia)" 
                                virtualization="KVM" 
                                support="Email apenas" 
                                isHighlight={false} 
                            />
                        </div>
                    </div>
                </section>

                {/* Plans Grid */}
                <section className="py-20">
                    <div className="container-page">
                        <div className="flex flex-col items-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 font-sora mb-6">Escolha seu plano</h2>
                            <LocationSelector 
                                selectedLocation={selectedLocation} 
                                onSelectLocation={setSelectedLocation} 
                            />
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-4">
                                <Shield className="w-4 h-4 text-hostever-secondary" />
                                Garantia de 7 dias
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {economyPlans.map((plan) => (
                                    <PlanCard 
                                        key={plan.id}
                                        plan={plan}
                                        popular={plan.popular}
                                        selectedLocation={selectedLocation}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
};

export default VpsEconomy;
