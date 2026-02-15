import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Cloud, Cpu, Zap, HardDrive, Check, ChevronRight } from 'lucide-react';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

const OpaCard = ({ plan }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Cloud className="w-24 h-24 text-primary" />
    </div>
    
    <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">{plan.name}</h3>
    <p className="text-primary font-medium text-sm mb-6 relative z-10">Suporta até {plan.clients} clientes</p>
    
    <div className="mb-8 relative z-10">
        <span className="text-4xl font-extrabold text-gray-900">R${plan.price}</span>
        <span className="text-gray-500 text-sm">/mês</span>
    </div>

    <div className="space-y-4 mb-8 flex-grow relative z-10">
        <div className="flex items-center text-gray-700">
            <Check className="w-5 h-5 mr-3 text-primary" /> {plan.specs.cpu}
        </div>
        <div className="flex items-center text-gray-700">
            <Check className="w-5 h-5 mr-3 text-primary" /> {plan.specs.ram}
        </div>
        <div className="flex items-center text-gray-700">
            <Check className="w-5 h-5 mr-3 text-primary" /> {plan.specs.ssd}
        </div>
    </div>

    <PlanCheckoutButton 
      plan={plan} 
      planType="servidor-opa" 
      location="br" 
    />
  </div>
);

const ServidorOpa = () => {
  return (
    <>
      <Helmet>
        <title>Servidor OPA Suite - Avyra</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        {/* Header Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                         <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap className="w-4 h-4" /> ERP Performance
                         </div>
                         <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Servidor <span className="text-primary">OPA Suite</span>
                         </h1>
                         <p className="text-xl text-gray-500 mb-8 max-w-lg font-light">
                            Infraestrutura validada e otimizada para o sistema OPA. Garanta velocidade e estabilidade para a gestão do seu provedor.
                         </p>
                    </div>
                    <div className="lg:w-1/2">
                         <img alt="OPA System Dashboard" className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" />
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <OpaCard plan={{ name: "OPA Start", clients: "1.000", price: "89,90", specs: { cpu: "2 vCPU Performance", ram: "4 GB RAM DDR4", ssd: "60 GB NVMe" } }} />
                    <OpaCard plan={{ name: "OPA Plus", clients: "2.500", price: "169,90", specs: { cpu: "4 vCPU Performance", ram: "8 GB RAM DDR4", ssd: "100 GB NVMe" } }} />
                    <OpaCard plan={{ name: "OPA Pro", clients: "4.000", price: "249,90", specs: { cpu: "6 vCPU Performance", ram: "16 GB RAM DDR4", ssd: "160 GB NVMe" } }} />
                </div>
            </div>
        </section>

      </div>
    </>
  );
};

export default ServidorOpa;