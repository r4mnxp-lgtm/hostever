import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Zap, Gauge, Server, Gamepad, Building, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AntiDdos = () => {
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

  const handleNotImplemented = () => {
    showToast({
      title: "🚧 Estamos em desenvolvimento!",
      duration: 3000,
    });
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
      icon: Server,
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
        <title>Proteção Anti-DDoS - Avyra Data Centers</title>
        <meta name="description" content="Proteção Anti-DDoS de alta capacidade para servidores de jogos, empresas e provedores. Mitigação em tempo real contra todos os tipos de ataques." />
      </Helmet>
      <div className="bg-gray-50">
        <section className="bg-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <Shield className="w-16 h-16 mx-auto hero-gradient text-white p-3 rounded-2xl mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Proteção <span className="gradient-text">Anti-DDoS</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mitigação avançada e de alta capacidade para manter seu negócio online e seguro, não importa o tamanho do ataque.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Defesa Robusta e Inteligente</h2>
                <p className="text-xl text-gray-600 mt-4">Nossa solução oferece proteção completa contra as ameaças mais complexas.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                  <div className="bg-white p-6 rounded-xl h-full shadow-lg card-hover">
                    <feature.icon className="w-10 h-10 text-orange-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Proteção para Todos os Segmentos</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Seja qual for o seu negócio, a indisponibilidade causada por ataques DDoS pode gerar perdas financeiras e de reputação. Nossa solução é flexível e se adapta a diferentes necessidades.
                    </p>
                    <div className="space-y-6">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                    <useCase.icon className="w-6 h-6" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-900">{useCase.title}</h4>
                                    <p className="text-gray-600">{useCase.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                    <img-replace alt="Gráfico de um ataque DDoS sendo mitigado pela rede da Avyra" className="rounded-2xl shadow-xl" />
                </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Fique um passo à frente das ameaças</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Não espere um ataque para pensar em segurança. Proteja sua infraestrutura hoje mesmo com a solução Anti-DDoS da Avyra.</p>
              <Button onClick={handleNotImplemented} size="lg" className="hero-gradient text-white">
                Fale com um Especialista em Segurança
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AntiDdos;