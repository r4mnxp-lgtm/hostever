import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, Zap, Shield, TrendingUp, Network, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useLeadForm } from '@/contexts/LeadFormContext';

const IpTransit = () => {
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

  const handleNotImplemented = () => {
    showToast({
      title: "🚧 Estamos em desenvolvimento!",
      duration: 3000,
    });
  };

  const features = [
    {
      icon: Zap,
      title: 'Baixa Latência',
      description: 'Rotas otimizadas e peering direto com os principais IXPs para a menor latência possível.',
    },
    {
      icon: TrendingUp,
      title: 'Alta Disponibilidade',
      description: 'Rede multihomed com múltiplos backbones Tier 1, garantindo um SLA de 99.9% de uptime.',
    },
    {
      icon: Shield,
      title: 'Proteção DDoS',
      description: 'Mitigação de ataques DDoS em tempo real para manter sua rede segura e operacional.',
    },
    {
      icon: Network,
      title: 'Sessões BGP',
      description: 'Oferecemos sessões BGP (IPv4/IPv6) para que você possa gerenciar suas próprias rotas.',
    },
    {
      icon: Globe,
      title: 'Conectividade Global',
      description: 'Alcance global com presença nos principais pontos de troca de tráfego do Brasil e do mundo.',
    },
    {
      icon: CheckCircle,
      title: 'Flexibilidade de Faturamento',
      description: 'Opções de faturamento por capacidade (porta) ou por uso (percentil 95), adaptadas ao seu negócio.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Trânsito IP - Avyra Data Centers</title>
        <meta name="description" content="Conectividade de alta performance com o serviço de Trânsito IP da Avyra. Baixa latência, alta disponibilidade e proteção DDoS." />
      </Helmet>
      <div className="bg-gray-50">
        <section className="bg-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <Globe className="w-16 h-16 mx-auto hero-gradient text-white p-3 rounded-2xl mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trânsito <span className="gradient-text">IP</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conectividade premium, confiável e de alta performance para o seu negócio.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Conexão Direta com o Mundo</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Nosso serviço de Trânsito IP fornece acesso direto à internet global através de uma rede robusta, resiliente e de baixa latência. Ideal para provedores de internet (ISPs), empresas de conteúdo e qualquer negócio que demande conectividade de alta qualidade.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" /><span>Otimize a experiência dos seus usuários com uma conexão mais rápida e estável.</span></li>
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" /><span>Garanta a continuidade do seu negócio com uma rede de alta disponibilidade.</span></li>
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" /><span>Escale sua capacidade de banda conforme sua demanda cresce.</span></li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <img-replace alt="Visualização abstrata de uma rede global de conexões" className="rounded-2xl shadow-xl" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Características da Nossa Rede</h2>
              <p className="text-xl text-gray-600 mt-4">Performance e confiabilidade em cada pacote.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                  <div className="bg-gray-50 p-6 rounded-xl h-full card-hover">
                    <feature.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Conecte-se com a melhor performance</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Nossos engenheiros de rede estão prontos para entender sua necessidade e oferecer a melhor solução de conectividade para o seu negócio.</p>
              <Button onClick={openLeadForm} size="lg" className="hero-gradient text-white">
                Fale com um Especialista
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default IpTransit;