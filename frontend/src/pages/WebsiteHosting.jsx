import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, Server, Shield, Zap, Check, Mail, Database, HardDrive, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useLeadForm } from '@/contexts/LeadFormContext';

const newHostingPlans = {
    br: [
        {
            id: 'essential-br',
            name: 'Plano Essencial',
            price: '8,33',
            description: 'Para quem está começando.',
            ssd: '2GB NVMe',
            db: '5 MySQL',
            email: '5 Contas',
            features: [ '1 Domínio', 'SSL Grátis', 'cPanel' ],
            checkoutUrl: '#',
            popular: false,
        },
        {
            id: 'professional-br',
            name: 'Plano Profissional',
            price: '14,82',
            description: 'Para sites em crescimento.',
            ssd: '5GB NVMe',
            db: '10 MySQL',
            email: '50 Contas',
            features: [ '1 Domínio', 'Subdomínios Ilimitados', 'SSL Grátis' ],
            checkoutUrl: '#',
            popular: true,
        },
        {
            id: 'business-br',
            name: 'Plano Business',
            price: '33,56',
            description: 'Performance máxima.',
            ssd: '10GB NVMe',
            db: '15 MySQL',
            email: 'Ilimitadas',
            features: [ '1 Domínio', 'Recursos Dedicados', 'SSL Grátis' ],
            checkoutUrl: '#',
            popular: false,
        },
    ],
    us: [
        {
            id: 'essential-us',
            name: 'Plano Essencial',
            price: '6,99',
            description: 'Start your journey.',
            ssd: '5GB NVMe',
            db: '5 MySQL',
            email: '10 Accounts',
             features: [ '1 Domain', 'Free SSL', 'cPanel' ],
            checkoutUrl: '#',
            popular: false,
        },
        {
            id: 'professional-us',
            name: 'Plano Profissional',
            price: '12,99',
            description: 'Growing traffic.',
            ssd: '10GB NVMe',
            db: '10 MySQL',
            email: '50 Accounts',
            features: [ '1 Domain', 'Unlimited Subdomains', 'Free SSL' ],
            checkoutUrl: '#',
            popular: true,
        },
    ],
};

const HostingPlanRow = ({ plan, onSelect, currencySymbol }) => {
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const handleSelect = () => {
        if (plan.checkoutUrl && plan.checkoutUrl !== '#') {
            window.open(plan.checkoutUrl, '_blank');
        } else {
            showToast({
                title: "🚧 Link de pagamento não configurado!",
                description: "Este plano ainda não está pronto para compra.",
                variant: "destructive"
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="group bg-white border border-gray-100 rounded-xl p-4 md:p-6 mb-4 hover:border-[#84cc16] hover:shadow-lg transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 font-sora"
        >
             <div className="lg:w-1/4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#84cc16]/10 p-2 rounded-lg text-[#84cc16]">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#84cc16] transition-colors">
                            {plan.name}
                        </h3>
                        {plan.popular && (
                            <span className="inline-block bg-[#84cc16] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1">
                                Recomendado
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-gray-500 text-xs">{plan.description}</p>
            </div>

            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 border-y lg:border-y-0 lg:border-x border-gray-50 py-4 lg:py-0 lg:px-8">
                <div>
                    <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        <HardDrive className="w-3 h-3 mr-1.5" /> Espaço
                    </span>
                    <span className="block font-bold text-gray-700 text-sm md:text-base">{plan.ssd}</span>
                </div>
                <div>
                    <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        <Database className="w-3 h-3 mr-1.5" /> Banco
                    </span>
                    <span className="block font-bold text-gray-700 text-sm md:text-base">{plan.db}</span>
                </div>
                <div>
                    <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        <Mail className="w-3 h-3 mr-1.5" /> Email
                    </span>
                    <span className="block font-bold text-gray-700 text-sm md:text-base">{plan.email}</span>
                </div>
                <div>
                     <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        <Shield className="w-3 h-3 mr-1.5" /> SSL
                    </span>
                    <span className="block font-bold text-gray-700 text-sm md:text-base">Grátis</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between gap-4 lg:w-1/5 lg:pl-4">
                <div className="text-center lg:text-right w-full md:w-auto lg:w-full">
                    <span className="text-xs text-gray-400 font-medium mr-1">Mensal</span>
                    <div className="flex items-baseline justify-center lg:justify-end">
                        <span className="text-sm font-semibold text-gray-400 mr-0.5">{currencySymbol}</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                    </div>
                </div>
                
                <Button 
                    onClick={handleSelect}
                    className="w-full bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold uppercase tracking-wide h-10 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                    Assinar <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </motion.div>
    );
};

const WebsiteHosting = () => {
    const { openLeadForm } = useLeadForm();
    const [location, setLocation] = useState('br');

    const hostingPlans = newHostingPlans[location] || [];
    const currencySymbol = location === 'br' ? 'R$' : 'US$';

    const features = [
        { icon: Zap, title: "Alta Performance", description: "Servidores otimizados com SSDs para máxima velocidade." },
        { icon: Shield, title: "Segurança Reforçada", description: "Proteção contra malware e backups automáticos." },
        { icon: Mail, title: "E-mail Profissional", description: "Crie contas de e-mail com seu próprio domínio." },
        { icon: Server, title: "cPanel Incluso", description: "Gerencie seu site com o painel de controle mais popular do mundo." },
    ];

    return (
        <>
            <Helmet>
                <title>Hospedagem de Sites - HostEver</title>
                <meta name="description" content="Hospedagem de sites rápida, segura e confiável com servidores no Brasil e EUA." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen">
                <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 text-center overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-gray-50/50"></div>
                     {/* Green Data Center Image for Hero */}
                    <div className="absolute inset-0 z-0 opacity-15">
                        <img-replace alt="Futuristic green data center hallway with servers" className="w-full h-full object-cover" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-flex items-center justify-center p-3 bg-[#84cc16]/10 rounded-2xl mb-6 text-[#84cc16]">
                                <Globe className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 font-sora">
                                Hospedagem de <span className="text-[#84cc16]">Sites</span>
                            </h1>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-sora">
                                A base sólida que seu site precisa para crescer. Rápida, segura e com suporte que você pode confiar.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                         {/* Location Toggle */}
                        <div className="flex justify-center mb-12">
                            <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex items-center space-x-2">
                                <Button onClick={() => setLocation('br')} variant="ghost" className={cn("rounded-full flex items-center gap-2 px-6 py-2 font-bold font-sora", location === 'br' ? 'bg-[#84cc16] text-white shadow-md hover:bg-[#65a30d] hover:text-white' : 'text-gray-500 hover:bg-gray-50')}>
                                    <img src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/0b00037f43e65b1bcf5e3bfb42a9101c.png" alt="Bandeira do Brasil" className="w-5 h-5 rounded-full object-cover"/>
                                    Brasil
                                </Button>
                                <Button onClick={() => setLocation('us')} variant="ghost" className={cn("rounded-full flex items-center gap-2 px-6 py-2 font-bold font-sora", location === 'us' ? 'bg-[#84cc16] text-white shadow-md hover:bg-[#65a30d] hover:text-white' : 'text-gray-500 hover:bg-gray-50')}>
                                    <img src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/4c5b116d93679f37ea30251c2bafcaee.png" alt="Bandeira dos EUA" className="w-5 h-5 rounded-full object-cover"/>
                                    EUA
                                </Button>
                            </div>
                        </div>

                         {/* Table Headers */}
                         <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-gray-100 rounded-t-xl text-xs font-bold uppercase tracking-wider text-gray-500 font-sora">
                            <div className="w-1/4">Plano</div>
                            <div className="flex-grow grid grid-cols-4 gap-8 px-8">
                                <div>Espaço</div>
                                <div>Banco de Dados</div>
                                <div>Contas de E-mail</div>
                                <div>Segurança</div>
                            </div>
                            <div className="w-1/5 pl-4 text-center">Preço</div>
                         </div>

                        <div className="space-y-4 lg:space-y-0 lg:bg-white lg:border-x lg:border-b lg:border-gray-100 lg:rounded-b-xl lg:p-2">
                            {hostingPlans.map(plan => (
                                <HostingPlanRow key={plan.id} plan={plan} onSelect={openLeadForm} currencySymbol={currencySymbol} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">Recursos Completos</h2>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-sora">Ferramentas poderosas para garantir o sucesso do seu projeto.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100 hover:border-[#84cc16]/30 transition-colors font-sora"
                                >
                                    <div className="w-16 h-16 bg-[#84cc16]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#84cc16]">
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-[#111827] text-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-sora">
                        <h2 className="text-3xl font-bold text-white mb-6">Precisa de mais poder?</h2>
                        <p className="text-lg text-gray-400 mb-8">Para projetos maiores, nossos planos de VPS e Servidores Dedicados são a escolha perfeita.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 rounded-full font-bold">
                                <a href="/servidor-vps">Conhecer VPS <ArrowRight className="ml-2 w-4 h-4" /></a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 rounded-full font-bold">
                                <a href="/servidores-dedicados">Ver Dedicados <ArrowRight className="ml-2 w-4 h-4" /></a>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default WebsiteHosting;