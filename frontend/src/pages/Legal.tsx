import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Legal = () => {
  const legalSections = [
    {
      icon: Scale,
      title: 'Termos de Uso',
      description: 'Nossos Termos de Uso regem seu acesso e utilização dos serviços da Avyra. Ao usar nossos serviços, você concorda com estes termos.',
      link: '/legal/termos-de-uso',
    },
    {
      icon: Shield,
      title: 'Política de Privacidade',
      description: 'Saiba como coletamos, usamos e protegemos suas informações pessoais em conformidade com a LGPD e as melhores práticas de mercado.',
      link: '/legal/politica-de-privacidade',
    },
    {
      icon: FileText,
      title: 'Acordo de Nível de Serviço (SLA)',
      description: 'Conheça nossas garantias de uptime, performance e tempo de resposta do suporte, assegurando a qualidade dos serviços prestados.',
      link: '/contratos',
    },
  ];
  
  const companyInfo = {
      icon: Building,
      title: 'Informações da Empresa',
      content: [
        'Razão Social: Avyra Data Centers Ltda.',
        'CNPJ: 12.345.678/0001-90',
        'Endereço: Rua das Tecnologias, 1000 - São Paulo, SP',
      ]
  };

  return (
    <>
      <Helmet>
        <title>Informações Legais - Avyra</title>
        <meta name="description" content="Acesse a documentação legal da Avyra: Termos de Uso, Política de Privacidade, SLA e informações da empresa." />
      </Helmet>

      <div className="bg-background">
        <section className="pt-32 pb-16 md:pt-48 md:pb-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                Central de <span className="gradient-text">Transparência</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Acesse nossa documentação legal e conheça nossos compromissos com a segurança, privacidade e qualidade dos serviços.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {legalSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl shadow-lg p-8 flex flex-col border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center mb-6">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
                  <p className="text-muted-foreground mb-6 flex-grow">{section.description}</p>
                  <Button asChild variant="outline" className="mt-auto">
                    <Link to={section.link}>Ler Documento</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl shadow-lg p-8 border"
              >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                      <companyInfo.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{companyInfo.title}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {companyInfo.content.map((item, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
              </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Legal;