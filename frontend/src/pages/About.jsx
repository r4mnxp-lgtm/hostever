
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Shield, Zap, Clock, Globe, Target, Award, Rocket, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const About = () => {
  const { t } = useTranslation();

  const milestones = [
    { year: '2015', title: 'A Fundação', description: 'Início das operações com foco em hosting de alta performance.' },
    { year: '2018', title: 'Expansão de Infra', description: 'Abertura do primeiro Data Center proprietário em São Paulo.' },
    { year: '2020', title: 'Rede Global', description: 'Conexão direta com pontos de troca de tráfego internacionais (IX).' },
    { year: '2023', title: 'Cloud Automation', description: 'Lançamento da plataforma de orquestração 100% automatizada.' }
  ];

  const values = [
    { icon: Target, title: 'Missão', description: 'Democratizar o acesso a infraestrutura de classe mundial para empresas brasileiras.' },
    { icon: Award, title: 'Visão', description: 'Ser referência absoluta em estabilidade e suporte humanizado na América Latina.' },
    { icon: Shield, title: 'Valores', description: 'Transparência, obcessão por uptime e compromisso inegociável com a segurança.' }
  ];

  return (
    <>
      <Helmet>
        <title>Sobre Nós - HostEver</title>
        <meta name="description" content="Conheça a HostEver. Infraestrutura robusta, time apaixonado e uma história de inovação em cloud computing." />
      </Helmet>

      <div className="min-h-screen bg-white font-sans overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1684563983781-ce52a026f139" 
               alt="HostEver Data Center" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#FFB833]/90 to-[#FFA500]/80 mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-sora">
                Construindo o Futuro <br/> da <span className="text-[#FFA500]">Infraestrutura</span>
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto opacity-90 leading-relaxed">
                Mais do que servidores, entregamos a fundação tecnológica que permite o seu negócio escalar sem limites.
              </p>
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
             <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             </div>
          </div>
        </section>

        {/* Company Story & Timeline */}
        <section className="py-24 bg-gray-50">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                 <h2 className="text-sm font-bold text-[#FFA500] uppercase tracking-widest mb-3">Nossa Jornada</h2>
                 <h3 className="text-4xl font-extrabold text-[#FFB833] font-sora">Uma História de Inovação</h3>
              </div>

              <div className="relative max-w-5xl mx-auto">
                 {/* Timeline Line */}
                 <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#FFA500]/20 hidden md:block"></div>
                 
                 <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                      >
                         <div className="flex-1 text-center md:text-right">
                            {index % 2 === 0 && (
                               <div className="md:pr-12">
                                  <h4 className="text-2xl font-bold text-[#FFB833] mb-2">{milestone.title}</h4>
                                  <p className="text-gray-600">{milestone.description}</p>
                               </div>
                            )}
                             {index % 2 !== 0 && (
                               <div className="hidden md:block md:pl-12 text-left">
                                  <h4 className="text-2xl font-bold text-[#FFB833] mb-2">{milestone.title}</h4>
                                  <p className="text-gray-600">{milestone.description}</p>
                               </div>
                            )}
                         </div>
                         
                         <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-[#FFB833] text-white font-bold border-4 border-white shadow-xl">
                            {milestone.year}
                         </div>

                         <div className="flex-1 text-center md:text-left">
                            {index % 2 !== 0 && (
                               <div className="md:pr-12 block md:hidden">
                                  <h4 className="text-2xl font-bold text-[#FFB833] mb-2">{milestone.title}</h4>
                                  <p className="text-gray-600">{milestone.description}</p>
                               </div>
                            )}
                            {index % 2 === 0 && (
                               <div className="hidden md:block md:pl-12">
                                  {/* Empty for layout balance */}
                               </div>
                            )}
                            {index % 2 !== 0 && (
                               <div className="hidden md:block md:pr-12">
                                  {/* Empty for layout balance */}
                               </div>
                            )}
                             {index % 2 === 0 && (
                               <div className="block md:hidden">
                                 {/* Content already rendered above for mobile if needed, logic adjusted for simplicity: */}
                                 {/* For mobile, we just stack, so content is always needed if not rendered in first block. 
                                     Actually simpler: render content always in a specific div for mobile below the bubble */}
                               </div>
                            )}
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="py-24 bg-white relative z-10">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100 text-center group"
                  >
                     <div className="w-20 h-20 mx-auto bg-[#FFA500]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#FFA500] transition-colors duration-300">
                        <item.icon className="w-10 h-10 text-[#FFA500] group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="text-2xl font-bold text-[#FFB833] mb-4 font-sora">{item.title}</h3>
                     <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* Team Culture */}
        <section className="py-24 bg-[#FFB833] text-white overflow-hidden">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                 >
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 font-sora">
                       Cultura de <span className="text-[#FFA500]">Excelência</span>
                    </h2>
                    <p className="text-lg opacity-80 mb-8 leading-relaxed">
                       Não contratamos apenas técnicos; contratamos solucionadores de problemas apaixonados. Nossa cultura é baseada em aprendizado contínuo, autonomia e uma obsessão saudável pela perfeição técnica.
                    </p>
                    <ul className="space-y-4 mb-10">
                       <li className="flex items-center gap-3"><CheckCircle2 className="text-[#FFA500]"/> Suporte Nível 3 Direto</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="text-[#FFA500]"/> Engenharia Certificada</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="text-[#FFA500]"/> Atendimento Humanizado 24/7</li>
                    </ul>
                    <Button variant="secondary" size="lg" className="bg-[#FFA500] hover:bg-white hover:text-[#FFB833] border border-transparent hover:border-[#FFB833] text-white font-bold rounded-xl h-14 px-8 uppercase tracking-widest transition-all">
                       Conheça Nosso Time
                    </Button>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                 >
                    <div className="absolute -inset-4 bg-[#FFA500] rounded-3xl opacity-20 blur-xl"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1531497258014-b5736f376b1b" 
                      alt="Equipe HostEver trabalhando" 
                      className="relative rounded-3xl shadow-2xl border border-white/10 w-full h-auto object-cover"
                    />
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Infrastructure & Global Presence */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="order-2 lg:order-1 relative"
                 >
                     <img 
                      src="https://images.unsplash.com/photo-1695668548342-c0c1ad479aee" 
                      alt="Global Network Map" 
                      className="rounded-3xl shadow-2xl w-full h-auto object-cover"
                    />
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xs">
                        <div className="text-4xl font-extrabold text-[#FFB833] mb-1">4+</div>
                        <div className="text-sm font-bold text-gray-500 uppercase">Regiões Globais</div>
                    </div>
                 </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="order-1 lg:order-2"
                 >
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFA500]/10 text-[#FFA500] text-xs font-bold uppercase tracking-widest mb-6">
                        Presença Global
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFB833] mb-6 font-sora">
                       Sua infraestrutura, <br/> onde seu cliente está.
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                       Operamos uma rede de baixa latência interconectada nos principais hubs de internet do mundo. Do Brasil aos EUA, garantimos que seus dados viagem pela rota mais curta e segura.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                          <Globe className="w-8 h-8 mx-auto text-[#FFA500] mb-2"/>
                          <div className="font-bold text-[#FFB833]">São Paulo, BR</div>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                          <Globe className="w-8 h-8 mx-auto text-[#FFA500] mb-2"/>
                          <div className="font-bold text-[#FFB833]">Miami, USA</div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-[#FFB833] to-[#1a2b4e] relative overflow-hidden text-center">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           <div className="container mx-auto px-4 relative z-10">
              <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 viewport={{ once: true }}
              >
                  <Rocket className="w-16 h-16 text-[#FFA500] mx-auto mb-6" />
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 font-sora">
                     Pronto para o Próximo Nível?
                  </h2>
                  <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
                     Junte-se a milhares de empresas que confiam na HostEver para manter suas operações críticas online.
                  </p>
                  <Button asChild size="lg" className="bg-[#FFA500] hover:bg-white hover:text-[#FFA500] text-white font-bold h-16 px-10 rounded-xl shadow-xl shadow-[#FFA500]/20 uppercase tracking-widest text-sm transition-all hover:scale-105">
                     <Link to="/fale-conosco">Conversar com Especialista</Link>
                  </Button>
              </motion.div>
           </div>
        </section>

      </div>
    </>
  );
};
export default About;
