import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Contracts = () => {
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
      title: "🚧 Esta funcionalidade ainda não foi implementada.",
      description: "O download dos contratos estará disponível em breve.",
      duration: 3000,
    });
  };

  const contracts = [
    {
      id: 'MSA-2024',
      title: 'Contrato Master de Serviços (MSA)',
      description: 'Termos e condições gerais que governam todos os serviços prestados pela Avyra.',
      version: 'v3.2',
      lastUpdate: '01/10/2024'
    },
    {
      id: 'DED-2024',
      title: 'Contrato de Servidores Dedicados',
      description: 'Termos específicos para a locação e uso de servidores dedicados.',
      version: 'v2.5',
      lastUpdate: '15/08/2024'
    },
    {
      id: 'VPS-2024',
      title: 'Contrato de VPS Cloud',
      description: 'Termos e condições aplicáveis aos serviços de Servidor Virtual Privado (VPS) na nuvem.',
      version: 'v2.8',
      lastUpdate: '15/08/2024'
    },
    {
      id: 'COLO-2024',
      title: 'Contrato de Colocation',
      description: 'Acordo para alocação de espaço e infraestrutura para hardware do cliente.',
      version: 'v4.1',
      lastUpdate: '01/06/2024'
    },
    {
      id: 'IP-2024',
      title: 'Contrato de Trânsito IP',
      description: 'Termos que regem a prestação de serviços de conectividade e trânsito de dados.',
      version: 'v1.9',
      lastUpdate: '20/05/2024'
    },
    {
      id: 'SLA-2024',
      title: 'Acordo de Nível de Serviço (SLA)',
      description: 'Define as garantias de performance, disponibilidade e suporte para os serviços.',
      version: 'v5.0',
      lastUpdate: '01/01/2024'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contratos - Avyra</title>
        <meta name="description" content="Acesse e baixe os modelos de contrato da Avyra: MSA, Servidores Dedicados, Colocation, e mais." />
      </Helmet>

      <div className="bg-background">
        <section className="bg-background pt-32 pb-16 md:pt-48 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
                Nossos <span className="gradient-text">Contratos</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transparência é um de nossos valores. Acesse abaixo os modelos de contrato padrão para nossos serviços.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {contracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl shadow-lg p-8 flex flex-col border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex-1">
                    <FileText className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">{contract.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{contract.description}</p>
                    <p className="text-sm text-muted-foreground">Versão: {contract.version}</p>
                    <p className="text-sm text-muted-foreground">Última atualização: {contract.lastUpdate}</p>
                  </div>
                  <Button onClick={handleNotImplemented} variant="outline" className="w-full mt-6">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-card p-10 rounded-2xl border"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Dúvidas sobre nossos contratos?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Nossa equipe comercial e jurídica está à disposição para esclarecer qualquer ponto.
              </p>
              <Button onClick={handleNotImplemented} size="lg" className="hero-gradient text-primary-foreground">
                Entre em Contato
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contracts;