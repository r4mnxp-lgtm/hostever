
import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Cpu, MemoryStick, HardDrive, Shield, Zap, Gauge, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { usePlansData } from '@/hooks/usePlansData';
import LocationSelector from '@/components/LocationSelector';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

const VpsGames = () => {
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const { plans } = usePlansData();
    const [selectedLocation, setSelectedLocation] = useState('br');
    const gamePlans = plans.games?.[selectedLocation] || [];

    const handleNotImplemented = () => {
        showToast({
            title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
            duration: 3000,
        });
    };
    
    const gameFeatures = [
        { icon: Gauge, title: "CPU de Alta Frequência", description: "Processadores otimizados para jogos, garantindo o máximo de FPS." },
        { icon: Shield, title: "Proteção DDoS Gamer", description: "Mitigação especializada para ataques comuns em servidores de jogos." },
        { icon: Zap, title: "Latência Ultrabaixa", description: "Conexão direta com as principais rotas de internet para um ping mínimo." },
        { icon: Users, title: "Slots Ilimitados", description: "Conecte quantos jogadores quiser, limitado apenas pelos recursos do seu plano." },
        { icon: HardDrive, title: "SSD NVMe Gen4", description: "Carregamento de mapas e assets em velocidade recorde." },
        { icon: CheckCircle, title: "Acesso Root e Fácil Instalação", description: "Instale mods, plugins e configure seu servidor com total liberdade." },
    ];

    const GamePlanCard = ({ plan, selectedLocation }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative bg-white rounded-2xl p-8 flex flex-col transition-all duration-300 border ${plan.popular ? 'border-orange-500 shadow-2xl scale-105 z-10' : 'shadow-lg hover:shadow-xl border-gray-200'}`}
        >
            {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">MAIS POPULAR</div>}
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{plan.name}</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Ideal para sua comunidade de jogos</p>
            
            <div className="text-center mb-6">
                <span className="text-gray-600 text-2xl font-bold">R$</span>
                <span className="text-5xl font-extrabold text-gray-900">{plan.price.split(',')[0]}</span>
                <span className="text-2xl font-bold text-gray-600">,{plan.price.split(',')[1]}</span>
                <span className="text-gray-500">/mês</span>
            </div>

            <PlanCheckoutButton 
              plan={plan} 
              planType="vps-games" 
              location={selectedLocation || 'br'} 
            />

            <div className="border-t border-gray-200 pt-6 space-y-4 text-gray-600 flex-grow">
                <p className="flex items-center"><Cpu className="w-5 h-5 mr-3 text-orange-500" /> <span className="font-semibold">{plan.specs.vcpu} vCPU</span> Cores (Alta Frequência)</p>
                <p className="flex items-center"><MemoryStick className="w-5 h-5 mr-3 text-orange-500" /> <span className="font-semibold">{plan.specs.ram} GB</span> RAM DDR4</p>
                <p className="flex items-center"><HardDrive className="w-5 h-5 mr-3 text-orange-500" /> <span className="font-semibold">{plan.specs.ssd} GB</span> SSD NVMe</p>
            </div>
        </motion.div>
    );

    return (
        <>
            <Helmet>
                <title>VPS para Jogos - HostEver</title>
                <meta name="description" content="Servidores VPS de alta performance otimizados para jogos. Baixa latência, alta frequência e proteção DDoS especializada." />
            </Helmet>
            <div className="bg-gray-50">
                <section className="relative bg-white py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                            <Gamepad2 className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-2xl mb-6 shadow-lg shadow-orange-500/30" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                VPS para Jogos de Alta Performance
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Leve sua experiência de jogo para o próximo nível com servidores otimizados para baixa latência e máxima estabilidade.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha a Região do Servidor</h2>
                            <LocationSelector 
                                selectedLocation={selectedLocation} 
                                onSelectLocation={setSelectedLocation} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                             <AnimatePresence mode="popLayout">
                                {gamePlans.map((plan) => (
                                    <GamePlanCard key={plan.name} plan={plan} selectedLocation={selectedLocation} />
                                ))}
                             </AnimatePresence>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Construído para <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Vencer</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Cada recurso é pensado para oferecer a melhor performance nos seus jogos favoritos.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {gameFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-start"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 mr-5 shadow-lg shadow-orange-500/20">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-orange-500/10 rounded-2xl p-8 lg:p-12 text-center border border-orange-200">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pronto para dominar o jogo?</h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Nossa equipe de gamers e especialistas está pronta para te ajudar a configurar o servidor perfeito.</p>
                            <Button onClick={handleNotImplemented} size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 shadow-xl shadow-orange-500/20">Fale com um Especialista</Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default VpsGames;
