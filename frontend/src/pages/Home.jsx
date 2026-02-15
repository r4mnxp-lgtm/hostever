
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Server, Cpu, Shield, Zap, Headphones, ArrowRight, CheckCircle2, Sparkles, Database, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Removed useLeadForm dependency if it's not strictly needed or handled elsewhere, assuming simplified flow for now
// If context is required, ensure it wraps App.jsx. For simplicity, linking to contact page.

const ProductCard = ({ icon: Icon, title, description, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-3xl flex flex-col transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(15,157,223,0.1)] hover:-translate-y-2 border border-gray-100 group h-full hover:border-[#FFA500]/30"
  >
    <div className="w-16 h-16 bg-[#FFA500]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFA500] transition-colors duration-300">
      <Icon className="w-8 h-8 text-[#FFA500] group-hover:text-white transition-colors duration-300" />
    </div>
    
    <h3 className="text-2xl font-bold text-[#FFB833] mb-4 font-sora tracking-tight group-hover:text-[#FFA500] transition-colors">{title}</h3>
    <p className="text-gray-500 flex-grow mb-8 leading-relaxed text-[15px] font-sans text-justify">{description}</p>
    
    <Link to={link} className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#FFA500] hover:text-[#FFB833] transition-colors mt-auto group/link">
      Explorar Solução <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
    </Link>
  </motion.div>
);

const FeatureItem = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-start gap-5 p-4 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
  >
    <div className="w-12 h-12 bg-[#FFA500]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#FFA500]">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-[#FFB833] font-sora mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const TestimonialCard = ({ name, role, company, text, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg relative"
    >
        <Quote className="w-10 h-10 text-[#FFA500]/10 absolute top-6 right-6" />
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        <p className="text-gray-600 mb-6 italic leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500] font-bold font-sora">
                {name.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-[#FFB833]">{name}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{role}, {company}</div>
            </div>
        </div>
    </motion.div>
);

const Home = () => {
  const products = [
    { 
        icon: Cpu, 
        title: "VPS Cloud", 
        description: "Servidores Virtuais Privados com discos NVMe de última geração, garantindo I/O superior para bancos de dados e aplicações web. Escalabilidade vertical instantânea e root access total.", 
        link: "/products", 
        delay: 0.1 
    },
    { 
        icon: Zap, 
        title: "VPS OPA Suite", 
        description: "Servidores otimizados e certificados para rodar o sistema OPA Suite. Performance garantida para seu ERP, com suporte especializado na infraestrutura.", 
        link: "/products", 
        delay: 0.2 
    },
    { 
        icon: Database, 
        title: "VPS IXC", 
        description: "Ambiente preparado e otimizado para provedores que utilizam IXC Soft. Alta disponibilidade e segurança para manter sua operação sempre online.", 
        link: "/products", 
        delay: 0.3 
    },
    { 
        icon: Server, 
        title: "Servidores Dedicados", 
        description: "Poder computacional bruto com hardware Bare Metal exclusivo. Sem hypervisor, sem vizinhos ruidosos. Ideal para grandes infraestruturas.", 
        link: "/products", 
        delay: 0.4 
    },
  ];
  
  const testimonials = [
      {
          name: "Carlos Mendes",
          role: "CTO",
          company: "TechFin Solutions",
          text: "A migração para a HostEver foi um divisor de águas. O suporte técnico é incrivelmente ágil e a estabilidade dos servidores VPS superou nossas expectativas.",
          delay: 0.1
      },
      {
          name: "Fernanda Lima",
          role: "Gerente de TI",
          company: "E-comm Brasil",
          text: "Precisávamos de uma solução robusta para Black Friday e a HostEver entregou. Latência baixíssima e zero downtime durante os picos de acesso.",
          delay: 0.2
      },
      {
          name: "Roberto Almeida",
          role: "Diretor",
          company: "GameServer Host",
          text: "A proteção Anti-DDoS é real. Sofremos ataques constantes na concorrência, mas aqui nossa infraestrutura nem sente. Recomendadíssimo para games.",
          delay: 0.3
      }
  ];

  return (
    <>
      <Helmet>
        <title>HostEver - Infraestrutura Cloud e Servidores Dedicados Premium</title>
        <meta name="description" content="Hospedagem de alta performance com Data Centers no Brasil. VPS, Dedicados e Colocation com proteção Anti-DDoS e suporte 24/7." />
      </Helmet>

      <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
        
        {/* Top Banner */}
        <div className="bg-[#FFB833] text-white py-3 relative z-50 border-b border-white/5">
           <div className="container mx-auto px-4 flex items-center justify-center text-xs md:text-sm tracking-wide">
              <span className="flex items-center font-bold text-[#FFA500] uppercase mr-3">
                 <Sparkles className="w-3.5 h-3.5 mr-1.5 fill-current animate-pulse" /> Oferta Exclusiva
              </span>
              <span className="text-gray-300 font-light truncate">
                 Migre sua infraestrutura hoje e ganhe <span className="text-white font-bold">até 50% de desconto</span> no primeiro mês.
              </span>
           </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            <div className="container mx-auto px-4 relative z-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
                    
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-flex items-center gap-2 bg-[#FFA500]/10 px-4 py-2 rounded-full text-xs font-bold text-[#FFA500] mb-6 uppercase tracking-widest border border-[#FFA500]/20 font-sans">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFA500] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFA500]"></span>
                                </span>
                                Data Centers no Brasil
                            </div>
                            
                            <h1 className="text-4xl lg:text-6xl font-extrabold text-[#FFB833] mb-6 leading-[1.1] tracking-tight font-sora">
                                O Poder da <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB833] to-[#FFA500]">
                                    Verdadeira Performance
                                </span>
                            </h1>
                            
                            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Experimente a latência ultrabaixa com nossa rede premium. Servidores VPS e Dedicados projetados para estabilidade crítica e crescimento exponencial.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                                <Button size="lg" className="bg-[#FFA500] hover:bg-[#FFA500] text-white font-bold px-8 h-12 rounded-xl text-sm uppercase tracking-widest shadow-xl shadow-[#FFA500]/20 transition-all hover:scale-105 font-sans w-full sm:w-auto" asChild>
                                    <Link to="/products">Ver Planos</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl font-bold text-[#FFB833] border-gray-200 hover:bg-gray-50 hover:border-[#FFA500] text-sm uppercase tracking-widest font-sans w-full sm:w-auto" asChild>
                                    <Link to="/nossa-historia">Conhecer a Empresa</Link>
                                </Button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm font-semibold text-gray-500 font-sans">
                                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#FFA500] mr-2"/> 99.9% Uptime SLA</div>
                                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#FFA500] mr-2"/> Proteção Anti-DDoS</div>
                                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#FFA500] mr-2"/> Suporte 24/7</div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-auto flex-shrink-0 relative hidden lg:block">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-[#FFA500]/10 via-[#FFB833]/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
                        
                        <motion.div
                             initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                             animate={{ opacity: 1, scale: 1, y: 0 }} 
                             transition={{ duration: 1, ease: "easeOut" }} 
                             className="relative z-10 w-[450px] h-[450px] mx-auto aspect-square" 
                        >
                             <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 bg-white p-4 h-full">
                                <div className="rounded-xl overflow-hidden relative h-full">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFB833]/50 via-transparent to-transparent z-10"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1577332215047-3712edf14808" 
                                        alt="Infraestrutura Data Center HostEver" 
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" 
                                    />
                                    
                                    {/* Floating Data Point */}
                                    <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-md border border-white/20 p-3 rounded-xl text-[#FFB833] shadow-lg">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Capacidade de Rede</div>
                                        <div className="text-lg font-bold font-sans text-[#FFA500]">10 Tbps+</div>
                                    </div>
                                </div>
                             </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-gray-100 bg-gray-50 relative">
             <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div className="text-center group">
                     <div className="text-4xl lg:text-5xl font-extrabold text-[#FFB833] mb-2 tracking-tight font-sora group-hover:text-[#FFA500] transition-colors">99.9%</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Uptime Garantido</div>
                 </div>
                 <div className="text-center group">
                     <div className="text-4xl lg:text-5xl font-extrabold text-[#FFB833] mb-2 tracking-tight font-sora group-hover:text-[#FFA500] transition-colors">&lt; 2ms</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Latência SP</div>
                 </div>
                 <div className="text-center group">
                     <div className="text-4xl lg:text-5xl font-extrabold text-[#FFB833] mb-2 tracking-tight font-sora group-hover:text-[#FFA500] transition-colors">Tier III</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Infraestrutura</div>
                 </div>
                 <div className="text-center group">
                     <div className="text-4xl lg:text-5xl font-extrabold text-[#FFB833] mb-2 tracking-tight font-sora group-hover:text-[#FFA500] transition-colors">24/7</div>
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Suporte Humano</div>
                 </div>
             </div>
        </section>

        {/* Products Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <span className="text-[#FFA500] font-bold uppercase tracking-widest text-xs mb-4 block">Nossas Soluções</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFB833] mb-6 tracking-tight font-sora">
                Infraestrutura para <span className="text-[#FFA500]">Escalar</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                Do desenvolvedor autônomo à grande corporação. Temos a plataforma robusta e flexível que seu projeto exige para crescer sem barreiras.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {products.map((product, index) => <ProductCard key={index} {...product} />)}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-32 bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFA500]/10 text-[#FFA500] text-xs font-bold uppercase tracking-wider mb-8 font-sans border border-[#FFA500]/20">
                    Tecnologia de Ponta
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFB833] mb-8 tracking-tight font-sora leading-tight">
                  Engenharia que define <br/><span className="text-[#FFA500]">Novos Padrões</span>
                </h2>
                <p className="text-lg text-gray-500 mb-12 leading-relaxed font-light text-justify">
                    Não somos apenas mais uma empresa de hospedagem. Somos engenheiros de infraestrutura obcecados por performance. Construímos nossa rede pensando em redundância tripla e segurança proativa.
                </p>
                
                <div className="space-y-6">
                  <FeatureItem 
                    icon={Shield} 
                    title="Proteção Anti-DDoS Avançada" 
                    description="Mitigação volumétrica e de aplicação em tempo real. Seu serviço permanece online mesmo sob ataques massivos, sem custo extra." 
                    delay={0.2} 
                  />
                  <FeatureItem 
                    icon={Zap} 
                    title="Hardware Enterprise Dell & HP" 
                    description="Renovação constante de parque. Utilizamos apenas processadores Intel Xeon Scalable e AMD EPYC com memórias DDR4/DDR5 ECC." 
                    delay={0.3} 
                  />
                  <FeatureItem 
                    icon={Headphones} 
                    title="Time de Suporte Expert" 
                    description="Esqueça o nível 1 robotizado. Fale diretamente com analistas que entendem de Linux, Windows Server e redes complexas." 
                    delay={0.4} 
                  />
                </div>
              </motion.div>

              <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFA500]/20 to-transparent rounded-[2rem] transform rotate-6 scale-105 z-0" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.8 }} 
                    viewport={{ once: true }} 
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl z-10 border border-white/10 bg-white p-2"
                  >
                    <img 
                        src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/a41906ae13024b25e714d8e2d88ba320.png" 
                        className="w-full h-auto object-cover rounded-[1.5rem]" 
                        alt="Corredor de Data Center High Tech" 
                    />
                  </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white border-t border-gray-100">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-[#FFB833] mb-4 font-sora">O que dizem <span className="text-[#FFA500]">nossos clientes</span></h2>
                 <p className="text-gray-500 max-w-2xl mx-auto">Histórias reais de empresas que escalaram sua infraestrutura com a HostEver.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                 ))}
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-[#FFB833] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFA500]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight font-sora">Pronto para a <span className="text-[#FFA500]">Evolução?</span></h2>
                <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                    Nossa equipe de especialistas está pronta para desenhar a arquitetura ideal para o seu negócio. Migração gratuita e assistida.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button asChild size="lg" className="bg-[#FFA500] hover:bg-[#FFA500] text-white h-16 px-12 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-[#FFA500]/20 hover:scale-105 transition-transform font-sans">
                        <Link to="/register">Iniciar Migração</Link>
                    </Button>
                     <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white h-16 px-12 rounded-xl font-bold uppercase tracking-widest text-sm font-sans transition-colors" asChild>
                        <Link to="/status">Ver Status</Link>
                    </Button>
                </div>
            </div>
        </section>
      </div>
    </>
  );
};
export default Home;
