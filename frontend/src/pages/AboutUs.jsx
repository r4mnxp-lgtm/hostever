
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Award, Briefcase, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TimelineItem = ({ year, title, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-8 md:pl-0 md:w-1/2 ml-auto md:ml-0 md:mr-auto pr-0 md:pr-12 text-left md:text-right group"
  >
    <div className="md:group-even:ml-auto md:group-even:mr-0 md:group-even:text-left md:group-even:pl-12 md:group-even:pr-0">
      <div className="absolute left-0 md:left-full md:-translate-x-1/2 top-0 w-4 h-4 bg-[#FFA500] rounded-full border-4 border-white shadow-md z-10 group-even:md:left-0 group-even:md:translate-x-[-50%]"></div>
      <div className="mb-2">
        <span className="text-4xl font-bold text-[#FFA500]/20 font-sora">{year}</span>
      </div>
      <h3 className="text-xl font-bold text-[#FFB833] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const TeamMember = ({ name, role, image }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="h-64 overflow-hidden relative">
      <div className="absolute inset-0 bg-[#FFB833]/0 group-hover:bg-[#FFB833]/20 transition-colors z-10"></div>
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="p-6 text-center">
      <h3 className="font-bold text-[#FFB833] text-lg mb-1">{name}</h3>
      <p className="text-[#FFA500] text-sm font-medium uppercase tracking-wider">{role}</p>
    </div>
  </motion.div>
);

const AboutUs = () => {
  const history = [
    { year: '2018', title: 'A Fundação', description: 'Nascemos com a missão de simplificar a infraestrutura de cloud no Brasil, oferecendo VPS de alta performance a preços acessíveis.' },
    { year: '2020', title: 'Expansão Internacional', description: 'Inauguração do nosso PoP em Miami, estabelecendo uma rota de baixa latência exclusiva para clientes da América Latina.' },
    { year: '2021', title: 'Certificação Tier III', description: 'Nossa infraestrutura principal atinge os rigorosos padrões de disponibilidade Tier III, garantindo 99.98% de uptime.' },
    { year: '2023', title: 'Novo Data Center SP', description: 'Lançamento de nossa própria estrutura física em São Paulo, conectada diretamente ao IX.br para máxima velocidade.' },
    { year: '2024', title: '10.000 Clientes', description: 'Celebramos a confiança de 10 mil empresas que hospedam seus sonhos e negócios em nossos servidores.' },
  ];

  return (
    <>
      <Helmet>
        <title>Nossa História - HostEver</title>
        <meta name="description" content="Conheça a trajetória da HostEver, nossa equipe e os valores que nos tornaram referência em hospedagem." />
      </Helmet>

      <div className="bg-white min-h-screen font-sans overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0">
              <img 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
                 alt="HostEver Team Meeting" 
                 className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFB833]/95 via-[#FFB833]/80 to-[#FFA500]/40 mix-blend-multiply"></div>
           </div>
           
           <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <div className="h-1 w-12 bg-[#FFA500]"></div>
                  <span className="text-[#FFA500] font-bold uppercase tracking-widest text-sm">Sobre a HostEver</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-extrabold text-white mb-8 font-sora leading-tight"
                >
                   Construindo o futuro da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-white">Cloud Computing</span>.
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-100 font-light leading-relaxed mb-10"
                >
                   Mais do que servidores, entregamos a fundação tecnológica que o seu negócio precisa para escalar sem limites.
                </motion.p>

                <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   className="flex gap-4"
                >
                   <Button className="bg-[#FFA500] hover:bg-white hover:text-[#FFA500] text-white font-bold h-14 px-8 rounded-xl uppercase tracking-widest" asChild>
                      <Link to="/carreiras">Junte-se ao Time</Link>
                   </Button>
                </motion.div>
              </div>
           </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                    { number: "10k+", label: "Clientes Ativos" },
                    { number: "99.9%", label: "Uptime Garantido" },
                    { number: "24/7", label: "Suporte Técnico" },
                    { number: "2", label: "Data Centers" }
                 ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                       <h3 className="text-4xl font-bold text-[#FFB833] font-sora mb-1">{stat.number}</h3>
                       <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Pillars */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-[#FFB833] font-sora mb-4">Nossos Pilares</h2>
                 <p className="text-gray-600 max-w-2xl mx-auto">Os fundamentos que guiam cada decisão técnica e comercial na HostEver.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { icon: Target, title: "Performance Extrema", desc: "Hardware de última geração não é opcional. Investimos pesadamente para que seu site carregue instantaneamente." },
                    { icon: Heart, title: "Cliente no Centro", desc: "Não temos 'tickets', temos conversas. Nosso suporte é formado por engenheiros, não robôs de script." },
                    { icon: Award, title: "Transparência Total", desc: "Sem letras miúdas ou taxas ocultas. Você sabe exatamente o que está contratando e quanto vai pagar." }
                 ].map((item, idx) => (
                    <motion.div 
                       key={idx}
                       whileHover={{ y: -5 }}
                       className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#FFA500]/20 transition-all duration-300 group"
                    >
                       <div className="w-14 h-14 bg-[#FFB833] text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FFA500] transition-colors">
                          <item.icon className="w-7 h-7" />
                       </div>
                       <h3 className="text-xl font-bold text-[#FFB833] mb-4">{item.title}</h3>
                       <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
           <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-20">
                 <span className="text-[#FFA500] font-bold uppercase tracking-widest text-sm mb-2 block">Nossa Trajetória</span>
                 <h2 className="text-4xl font-bold text-[#FFB833] font-sora">Uma História de Inovação</h2>
              </div>

              <div className="relative max-w-4xl mx-auto">
                 {/* Vertical Line */}
                 <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2"></div>

                 <div className="space-y-12">
                    {history.map((item, idx) => (
                       <TimelineItem key={idx} index={idx} {...item} />
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="flex justify-between items-end mb-12">
                 <div>
                    <h2 className="text-3xl font-bold text-[#FFB833] font-sora mb-2">Quem Faz Acontecer</h2>
                    <p className="text-gray-600">Conheça os líderes que impulsionam nossa visão.</p>
                 </div>
                 <Button variant="ghost" className="text-[#FFA500] font-bold hover:bg-[#FFA500]/10" asChild>
                    <Link to="/carreiras">Ver Vagas Abertas <ChevronRight className="w-4 h-4 ml-1" /></Link>
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <TeamMember 
                    name="Carlos Silva" 
                    role="CEO & Founder" 
                    image="https://images.unsplash.com/photo-1560250097-0b93528c311a" 
                 />
                 <TeamMember 
                    name="Amanda Costa" 
                    role="CTO / Infraestrutura" 
                    image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
                 />
                 <TeamMember 
                    name="Ricardo Oliveira" 
                    role="Head de Suporte" 
                    image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
                 />
                 <TeamMember 
                    name="Juliana Santos" 
                    role="Customer Success" 
                    image="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                 />
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#FFB833] text-center relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFA500] rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFA500] rounded-full blur-3xl"></div>
           </div>

           <div className="container mx-auto px-4 relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 font-sora">Pronto para elevar seu nível?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                 Migre para a HostEver hoje mesmo e experimente a diferença que uma infraestrutura premium pode fazer.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button className="bg-[#FFA500] hover:bg-white hover:text-[#FFA500] text-white font-bold h-14 px-8 rounded-xl uppercase tracking-widest text-lg shadow-xl shadow-black/20" asChild>
                    <Link to="/servidor-vps">Ver Planos VPS</Link>
                 </Button>
                 <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-xl uppercase tracking-widest font-bold text-lg" asChild>
                    <Link to="/client-login">Falar com Consultor</Link>
                 </Button>
              </div>
              <p className="mt-8 text-sm text-blue-200/60 flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> Garantia de 7 dias ou seu dinheiro de volta
              </p>
           </div>
        </section>

      </div>
    </>
  );
};

export default AboutUs;
