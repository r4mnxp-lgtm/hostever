import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Zap, Cpu, HardDrive, Shield, Server, Globe, LifeBuoy, Wifi, Network, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation, Trans } from 'react-i18next';
import { usePlansData } from '@/hooks/usePlansData';
import { useLeadForm } from '@/contexts/LeadFormContext';

const TraderPlanRow = ({ plan, location, t }) => {
    const portInfo = location === 'br' ? t('vpsCloud.plan.portBR') : t('vpsCloud.plan.portUS');
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="group bg-white border border-gray-100 rounded-xl p-4 md:p-6 mb-4 hover:border-hostever-secondary hover:shadow-lg transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 font-sora"
      >
        <div className="lg:w-1/4">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-hostever-secondary/10 p-2 rounded-lg text-hostever-secondary">
                    <Server className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-hostever-secondary transition-colors">
                        {plan.name}
                    </h3>
                    {plan.popular && (
                        <span className="inline-block bg-hostever-secondary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1">
                            Recomendado
                        </span>
                    )}
                </div>
            </div>
            <p className="text-gray-500 text-xs line-clamp-2">Ideal para MetaTrader e ProfitChart</p>
        </div>
    
        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 border-y lg:border-y-0 lg:border-x border-gray-50 py-4 lg:py-0 lg:px-8">
            <div>
                <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    <Cpu className="w-3 h-3 mr-1.5" /> vCPU
                </span>
                <span className="block font-bold text-gray-700 text-sm md:text-base">{plan.specs.vcpu}</span>
            </div>
            <div>
                <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    <Zap className="w-3 h-3 mr-1.5" /> RAM
                </span>
                <span className="block font-bold text-gray-700 text-sm md:text-base">{plan.specs.ram}</span>
            </div>
            <div>
                <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    <HardDrive className="w-3 h-3 mr-1.5" /> SSD
                </span>
                <span className="block font-bold text-gray-700 text-sm md:text-base">{plan.specs.ssd}</span>
            </div>
            <div>
                 <span className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    <Network className="w-3 h-3 mr-1.5" /> Link
                </span>
                <span className="block font-bold text-gray-700 text-sm md:text-base">{portInfo}</span>
            </div>
        </div>
    
        <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between gap-4 lg:w-1/5 lg:pl-4">
            <div className="text-center lg:text-right w-full md:w-auto lg:w-full">
                <span className="text-xs text-gray-400 font-medium mr-1">{t('plans.monthly')}</span>
                <div className="flex items-baseline justify-center lg:justify-end">
                    <span className="text-sm font-semibold text-gray-400 mr-0.5">{location === 'br' ? 'R$' : '$'}</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{plan.price.split(',')[0]}</span>
                     {plan.price.includes(',') && <span className="text-sm font-bold text-gray-500">,{plan.price.split(',')[1]}</span>}
                </div>
            </div>
            
            <Button 
                asChild
                className="w-full bg-hostever-secondary hover:bg-hostever-secondary/90 text-white font-bold uppercase tracking-wide h-10 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
                 <a href={plan.checkoutUrl} target="_blank" rel="noopener noreferrer">
                    Contratar <ChevronRight className="w-4 h-4 ml-1" />
                 </a>
            </Button>
        </div>
      </motion.div>
    );
};


const CloudTrader = () => {
  const { t } = useTranslation();
  const { plans } = usePlansData();
  const [location, setLocation] = useState('br'); 
  const traderPlans = plans.cloudTrader || { br: [], us: [] };
  const { openLeadForm } = useLeadForm();

  const includedFeatures = [
    { icon: Server, title: t('vpsCloud.feature.root.title'), description: t('vpsCloud.feature.root.desc') },
    { icon: Shield, title: t('vpsCloud.feature.ddos.title'), description: t('vpsCloud.feature.ddos.desc') },
    { icon: Globe, title: t('vpsCloud.feature.ip.title'), description: t('vpsCloud.feature.ip.desc') },
    { icon: Zap, title: t('vpsCloud.feature.activation.title'), description: t('vpsCloud.feature.activation.desc') },
    { icon: LifeBuoy, title: t('vpsCloud.feature.support.title'), description: t('vpsCloud.feature.support.desc') },
    { icon: HardDrive, title: t('vpsCloud.feature.backups.title'), description: t('vpsCloud.feature.backups.desc') },
  ];

  const osList = [
    { name: 'Windows Server', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/58587f661678aff3bbfd6b428e901630.png', isAddon: false, description: "Windows Server operating system" },
  ];

  const faqItems = [
    { question: t('vpsCloud.faq.item1.q'), answer: t('vpsCloud.faq.item1.a') },
    { question: t('vpsCloud.faq.item2.q'), answer: t('vpsCloud.faq.item2.a') },
    { question: t('vpsCloud.faq.item3.q'), answer: t('vpsCloud.faq.item3.a') },
    { question: t('vpsCloud.faq.item4.q'), answer: t('vpsCloud.faq.item4.a') }
  ];
  
  return (
    <>
      <Helmet>
        <title>{t('nav.cloudTrader')} - HostEver</title>
        <meta name="description" content={t('nav.cloudTraderDesc')} />
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 text-center overflow-hidden bg-white">
             {/* Data Center Image for Hero */}
             <div className="absolute inset-0 z-0 opacity-15">
                 <img src="https://images.unsplash.com/photo-1558494949-ef526b0042a0" alt="Stock trading screens in a modern server room" className="w-full h-full object-cover" />
             </div>
             
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center justify-center p-3 bg-hostever-secondary/10 rounded-2xl mb-6 text-hostever-secondary">
                         <Zap className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 font-sora">
                        <span className="text-hostever-secondary">{t('nav.cloudTrader')}</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto font-sora">
                        {t('nav.cloudTraderDesc')}
                    </p>
                </motion.div>
            </div>
        </section>

        <section className="py-20 max-w-[1440px] mx-auto px-4 lg:px-8">
             {/* Location Toggle */}
             <div className="flex justify-center mb-12">
                <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex items-center space-x-2">
                    <Button onClick={() => setLocation('br')} variant="ghost" className={cn("rounded-full flex items-center gap-2 px-6 py-2 font-bold font-sora", location === 'br' ? 'bg-hostever-secondary text-white shadow-md hover:bg-hostever-secondary/90 hover:text-white' : 'text-gray-500 hover:bg-gray-50')}>
                        <img src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/0b00037f43e65b1bcf5e3bfb42a9101c.png" alt="Bandeira do Brasil" className="w-5 h-5 rounded-full object-cover"/>
                        {t('vpsCloud.location.brazil')}
                    </Button>
                    <Button onClick={() => setLocation('us')} variant="ghost" className={cn("rounded-full flex items-center gap-2 px-6 py-2 font-bold font-sora", location === 'us' ? 'bg-hostever-secondary text-white shadow-md hover:bg-hostever-secondary/90 hover:text-white' : 'text-gray-500 hover:bg-gray-50')}>
                        <img src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/4c5b116d93679f37ea30251c2bafcaee.png" alt="Bandeira dos EUA" className="w-5 h-5 rounded-full object-cover"/>
                        {t('vpsCloud.location.usa')}
                    </Button>
                </div>
            </div>

            {/* Table Headers */}
             <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-gray-100 rounded-t-xl text-xs font-bold uppercase tracking-wider text-gray-500 font-sora">
                <div className="w-1/4">Plano Trader</div>
                <div className="flex-grow grid grid-cols-4 gap-8 px-8">
                    <div>vCPU</div>
                    <div>RAM</div>
                    <div>Armazenamento</div>
                    <div>Link</div>
                </div>
                <div className="w-1/5 pl-4 text-center">Preço</div>
             </div>

            <div className="space-y-4 lg:space-y-0 lg:bg-white lg:border-x lg:border-b lg:border-gray-100 lg:rounded-b-xl lg:p-2">
                {traderPlans[location].map((plan) => (
                    <TraderPlanRow key={plan.id} plan={plan} location={location} t={t} />
                ))}
            </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sora">
                <Trans i18nKey="vpsCloud.os.title">
                  Otimizado para <span className="text-hostever-secondary">Trader</span>
                </Trans>
              </h2>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto font-sora">
                Ambiente Windows Server preparado para máxima performance em MetaTrader 4/5, ProfitChart e Tryd.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {osList.map((os) => (
                  <motion.div 
                    key={os.name} 
                    className="flex flex-col items-center gap-3 text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img src={os.logo} alt={os.description} className="h-20 w-20 object-contain" />
                    <span className="font-semibold text-gray-700 font-sora">{os.name}</span>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {includedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start font-sora"
                >
                  <div className="w-12 h-12 bg-hostever-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 mr-5 text-hostever-secondary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sora">
                Dúvidas <span className="text-hostever-secondary">Frequentes</span>
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full font-sora">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`} className="bg-gray-50 border border-gray-100 rounded-lg px-6 mb-4">
                  <AccordionTrigger className="text-lg font-bold text-gray-800 hover:no-underline hover:text-hostever-secondary">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-24 bg-[#111827] text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-sora">{t('vpsCloud.cta.title')}</h2>
             <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto font-sora">{t('vpsCloud.cta.subtitle')}</p>
             <Button onClick={openLeadForm} size="lg" className="bg-hostever-secondary hover:bg-hostever-secondary/90 text-white text-lg px-10 py-7 shadow-lg hover:scale-105 transition-all font-bold uppercase rounded-full">
                {t('vpsCloud.cta.button')}
             </Button>
           </div>
        </section>
      </div>
    </>
  );
};

export default CloudTrader;