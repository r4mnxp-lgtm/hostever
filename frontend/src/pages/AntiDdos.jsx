
import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Zap, Gauge, Server, Gamepad, Building, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useLeadForm } from '@/contexts/LeadFormContext';

const AntiDdos = () => {
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
  const { companyData } = useCompanyData();
  const { openLeadForm } = useLeadForm();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      icon: Zap,
      title: 'Mitigação em Tempo Real',
      description: 'Nossa plataforma identifica e mitiga ataques em segundos, antes que eles impactem seu serviço.',
    },
    {
      icon: Gauge,
      title: 'Alta Capacidade',
      description: 'Rede com capacidade de Terabits por segundo, pronta para absorver os maiores ataques volumétricos.',
    },
    {
      icon: Shield,
      title: 'Proteção Always-On',
      description: 'Monitoramento contínuo 24/7/365 para garantir que sua aplicação esteja sempre protegida.',
    },
    {
      icon: Lock,
      title: 'Ataques de Camada 3, 4 e 7',
      description: 'Proteção completa contra uma vasta gama de vetores de ataque, desde floods UDP até ataques complexos a aplicações.',
    },
  ];
  
  const useCases = [
    {
        icon: Gamepad,
        title: 'Servidores de Jogos',
        description: 'Mantenha a baixa latência e a disponibilidade que seus jogadores exigem, mesmo sob ataque.'
    },
    {
        icon: Building,
        title: 'Empresas e E-commerce',
        description: 'Proteja suas aplicações críticas, APIs e website, garantindo a continuidade do seu negócio online.'
    },
    {
        icon: Server,
        title: 'Provedores de Internet (ISP)',
        description: 'Ofereça um link mais limpo e seguro para seus clientes, agregando valor ao seu serviço.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Proteção Anti-DDoS - HostEver</title>
        <meta name="description" content="Proteção Anti-DDoS de alta capacidade para servidores de jogos, empresas e provedores. Mitigação em tempo real contra todos os tipos de ataques." />
      </Helmet>
      
      <div className="bg-white overflow-hidden">
        
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 bg-[#FFB833] text-white overflow-hidden">
           {/* Animated Background Elements */}
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               opacity: [0.1, 0.2, 0.1]
             }}
             transition={{ duration: 8, repeat: Infinity }}
             className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA500] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
           />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6 }}
               className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-8 shadow-2xl shadow-[#FFA500]/20 border border-white/20"
             >
               <Shield className="w-16 h-16 text-[#FFA500]" />
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-5xl md:text-7xl font-extrabold mb-6 font-sora"
             >
               Proteção <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-white">Anti-DDoS</span>
             </motion.h1>
             
             <motion.p 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
             >
               Mitigação avançada e de alta capacidade para manter seu negócio online e seguro, não importa o tamanho do ataque.
             </motion.p>
           </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#FFB833] font-sora">Defesa Robusta e Inteligente</h2>
                <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Nossa solução oferece proteção completa contra as ameaças mais complexas.</p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants} className="group">
                  <div className="bg-white p-8 rounded-2xl h-full shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-[#FFA500]/20">
                    <div className="w-14 h-14 bg-[#FFA500]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FFA500] transition-colors duration-300">
                        <feature.icon className="w-7 h-7 text-[#FFA500] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#FFB833] mb-3">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.8 }} 
                  viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#FFB833] mb-6 font-sora">Proteção para Todos os Segmentos</h2>
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                        Seja qual for o seu negócio, a indisponibilidade causada por ataques DDoS pode gerar perdas financeiras e de reputação. Nossa solução é flexível e se adapta a diferentes necessidades.
                    </p>
                    <div className="space-y-8">
                        {useCases.map((useCase, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.2 }}
                              viewport={{ once: true }}
                              className="flex items-start"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-[#FFA500]/10 text-[#FFA500] rounded-xl flex items-center justify-center border border-[#FFA500]/20">
                                    <useCase.icon className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h4 className="text-lg font-bold text-[#FFB833]">{useCase.title}</h4>
                                    <p className="text-gray-500 text-sm mt-1">{useCase.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }} 
                   whileInView={{ opacity: 1, scale: 1 }} 
                   transition={{ duration: 0.8 }} 
                   viewport={{ once: true }}
                   className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFA500]/20 to-transparent rounded-3xl transform rotate-3"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31" 
                      alt="Data Center Security" 
                      className="relative rounded-3xl shadow-2xl z-10 w-full h-auto object-cover" 
                    />
                    
                    {/* Animated Metrics Overlay */}
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.5, duration: 0.5 }}
                       className="absolute bottom-8 right-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40"
                    >
                       <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs font-bold text-gray-500 uppercase">Status da Rede</span>
                       </div>
                       <div className="text-2xl font-bold text-[#FFB833]">Protegida</div>
                    </motion.div>
                </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#FFB833]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="bg-gradient-to-r from-[#FFA500] to-[#0a6ca0] rounded-3xl shadow-2xl p-8 lg:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-sora relative z-10">Fique um passo à frente das ameaças</h2>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto relative z-10 font-light">Não espere um ataque para pensar em segurança. Proteja sua infraestrutura hoje mesmo com a solução Anti-DDoS da HostEver.</p>
              
              <Button onClick={openLeadForm} size="lg" className="bg-white text-[#FFA500] hover:bg-gray-100 hover:text-[#0a6ca0] font-bold h-14 px-10 rounded-xl uppercase tracking-widest text-sm shadow-xl transition-transform hover:scale-105 relative z-10">
                Fale com um Especialista
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AntiDdos;
