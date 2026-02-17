
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, Target, Heart, CheckCircle2 } from 'lucide-react';

const OurStory = () => {
  return (
    <>
      <Helmet>
        <title>Nossa História - HostEver</title>
        <meta name="description" content="Conheça a trajetória da HostEver, nossa missão e os valores que nos guiam." />
      </Helmet>

      <div className="bg-white min-h-screen font-sans overflow-x-hidden">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-[#FFB833] overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#FFB833] to-[#1a2335]"></div>
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
           
           <div className="container mx-auto px-4 relative z-10 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                 <span className="text-[#FFA500] font-bold uppercase tracking-widest text-sm mb-4 block">Desde 2018</span>
                 <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-sora">
                    Construindo a <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-white">Base da Inovação</span>
                 </h1>
                 <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
                    Nossa jornada para democratizar o acesso a infraestrutura de alta performance na América Latina.
                 </p>
              </motion.div>
           </div>
        </section>

        {/* The Story */}
        <section className="py-24">
           <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-16 items-center">
                 <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-[#FFB833] mb-6 font-sora">Como tudo começou</h2>
                    <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                       <p>
                          A HostEver nasceu da frustração. Em 2018, nossos fundadores, engenheiros de sistemas experientes, enfrentavam um dilema comum no mercado brasileiro: escolher entre performance exorbitante ou preços acessíveis com qualidade duvidosa.
                       </p>
                       <p>
                          Não aceitamos esse compromisso. Decidimos construir o provedor que gostaríamos de contratar. Começamos com um único rack e uma obsessão: entregar a menor latência possível com hardware que não deixasse ninguém na mão.
                       </p>
                       <p>
                          Hoje, operamos Data Centers Tier III em São Paulo e Miami, atendendo mais de 10.000 clientes que confiam em nossa infraestrutura para manter seus sonhos online.
                       </p>
                    </div>
                 </div>
                 <div className="md:w-1/2 relative">
                    <div className="absolute inset-0 bg-[#FFA500] rounded-3xl transform rotate-3 opacity-10"></div>
                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" alt="Office Life" className="relative rounded-3xl shadow-2xl" />
                 </div>
              </div>
           </div>
        </section>

        {/* Mission/Vision */}
        <section className="py-24 bg-gray-50">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { icon: Target, title: "Missão", desc: "Prover infraestrutura robusta e transparente, eliminando barreiras técnicas para o crescimento de nossos clientes." },
                    { icon: Award, title: "Visão", desc: "Ser a referência absoluta em confiabilidade e atendimento humano no mercado de hosting nacional." },
                    { icon: Heart, title: "Valores", desc: "Transparência radical, excelência técnica, e empatia total com o negócio do cliente." }
                 ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                       <div className="w-12 h-12 bg-[#FFA500]/10 text-[#FFA500] rounded-xl flex items-center justify-center mb-6">
                          <item.icon className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-bold text-[#FFB833] mb-3 font-sora">{item.title}</h3>
                       <p className="text-gray-600">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#FFB833] text-center mb-16 font-sora">Marcos da Nossa História</h2>
              <div className="max-w-3xl mx-auto border-l-2 border-gray-100 pl-8 space-y-12">
                 {[
                    { year: '2018', title: 'A Fundação', desc: 'Início das operações focadas em VPS de baixo custo.' },
                    { year: '2020', title: 'Expansão Internacional', desc: 'Abertura do PoP Miami com rota otimizada para o Brasil.' },
                    { year: '2022', title: 'Data Center SP', desc: 'Inauguração da infraestrutura própria em São Paulo (Tier III).' },
                    { year: '2023', title: '10k Clientes', desc: 'Marco histórico de clientes ativos na plataforma.' },
                 ].map((item, idx) => (
                    <div key={idx} className="relative">
                       <div className="absolute -left-[41px] top-0 w-5 h-5 bg-[#FFA500] rounded-full border-4 border-white shadow-sm"></div>
                       <span className="text-sm font-bold text-[#FFA500]">{item.year}</span>
                       <h3 className="text-xl font-bold text-[#FFB833] mt-1 mb-2">{item.title}</h3>
                       <p className="text-gray-600">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#FFB833] text-white text-center">
           <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold font-sora mb-6">Faça parte do nosso futuro</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                 Traga seu projeto para a HostEver e cresça com quem entende de infraestrutura.
              </p>
              <Button className="bg-[#FFA500] hover:bg-white hover:text-[#FFA500] text-white font-bold h-14 px-8 rounded-xl uppercase tracking-widest shadow-xl" asChild>
                 <Link to="/servidor-vps">Conhecer Planos</Link>
              </Button>
           </div>
        </section>
      </div>
    </>
  );
};

export default OurStory;
