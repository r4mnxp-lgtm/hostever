import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Building, Shield, Zap, Lock, Server, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Colocation = () => {
  return (
    <>
      <Helmet>
        <title>Colocation Tier III - HostEver</title>
        <meta name="description" content="Hospede seu hardware em nosso Data Center Tier III em São Paulo." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 font-sans">
        
        {/* Header Section */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#0f172a]">
            {/* Custom Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/110dd27d0d5dc0e5739a52bcd6279d5d.png" 
                    alt="Datacenter rack room" 
                    className="w-full h-full object-cover opacity-30" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
            </div>

            <div className="container-page relative z-10 text-center">
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                     <div className="inline-flex items-center gap-2 bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 font-sora backdrop-blur-sm">
                        <Building className="w-4 h-4" /> Data Center SP
                     </div>
                     <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight font-sora">
                        Colocation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-emerald-400">Tier III</span>
                     </h1>
                     <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        Traga seu hardware para nossa infraestrutura de classe mundial. Energia, refrigeração e conectividade redundantes para máxima disponibilidade.
                     </p>
                 </motion.div>
            </div>
        </section>

        <section className="py-24 -mt-16 relative z-20">
            <div className="container-page flex justify-center">
                <div className="w-full max-w-lg">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-[#FFA500] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-[#FFA500] text-white text-xs font-bold px-6 py-2 rounded-bl-2xl uppercase tracking-widest font-sora">
                            Personalizável
                        </div>

                        <div className="w-20 h-20 bg-[#FFA500]/10 rounded-2xl flex items-center justify-center mb-8 text-[#FFA500]">
                            <Server className="w-10 h-10" />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-gray-900 font-sora mb-2">Colocation Flex</h3>
                        <p className="text-gray-500 mb-8">Espaço escalável de acordo com sua necessidade.</p>
                        
                        <div className="mb-10 pb-8 border-b border-gray-100">
                             <div className="flex items-baseline mb-2">
                                <span className="text-sm font-semibold text-gray-400 mr-2">A partir de</span>
                                <span className="text-sm font-semibold text-gray-400 mr-1">R$</span>
                                <span className="text-5xl font-extrabold text-gray-900 font-sora tracking-tight">249,99</span>
                                <span className="text-gray-500 text-xs font-medium ml-1">/mês</span>
                            </div>
                        </div>

                        <div className="space-y-5 mb-10">
                            <div className="flex items-center text-gray-700">
                                <Check className="w-5 h-5 mr-4 text-[#FFA500]" /> 
                                <span className="font-bold">1KVA a 10KVA</span> <span className="text-gray-500 ml-1">de Potência</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Check className="w-5 h-5 mr-4 text-[#FFA500]" /> 
                                <span className="font-bold">1U a 44U (Rack Full)</span> <span className="text-gray-500 ml-1">de Espaço</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Check className="w-5 h-5 mr-4 text-[#FFA500]" /> 
                                <span className="font-bold">Energia A+B</span> <span className="text-gray-500 ml-1">Redundante</span>
                            </div>
                             <div className="flex items-center text-gray-700">
                                <Check className="w-5 h-5 mr-4 text-[#FFA500]" /> 
                                <span className="font-bold">Link Dedicado</span> <span className="text-gray-500 ml-1">Incluso</span>
                            </div>
                        </div>

                        <Button className="w-full bg-[#FFA500] hover:bg-[#FFA500] text-white font-bold h-14 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-[#FFA500]/20 font-sora transition-all hover:scale-[1.02]">
                            Solicitar Cotação
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="py-20 bg-white">
            <div className="container-page">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                     <div>
                         <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#FFA500]">
                             <Shield className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3 font-sora">Segurança Física 24/7</h3>
                         <p className="text-gray-500 leading-relaxed">Acesso biométrico, CFTV e vigilância armada presencial. Seu equipamento protegido 24 horas por dia.</p>
                     </div>
                     <div>
                         <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#FFA500]">
                             <Zap className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3 font-sora">Energia Ininterrupta</h3>
                         <p className="text-gray-500 leading-relaxed">Redundância tripla com Nobreaks e Geradores a Diesel. SLA de 100% de disponibilidade elétrica.</p>
                     </div>
                     <div>
                         <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#FFA500]">
                             <Lock className="w-8 h-8" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-3 font-sora">Privacidade Total</h3>
                         <p className="text-gray-500 leading-relaxed">Apenas você tem acesso lógico aos seus servidores. Gaiolas privativas disponíveis para racks full.</p>
                     </div>
                </div>
            </div>
        </section>

      </div>
    </>
  );
};

export default Colocation;