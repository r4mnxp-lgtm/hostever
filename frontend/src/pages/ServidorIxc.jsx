import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Database, Cpu, Zap, HardDrive, Check, ChevronRight } from 'lucide-react';
import PlanCheckoutButton from '@/components/PlanCheckoutButton';

const IxcCard = ({ plan, recommended }) => (
  <div className={`bg-white border rounded-2xl p-8 transition-all duration-300 flex flex-col h-full relative overflow-hidden group hover:shadow-xl ${recommended ? 'border-primary shadow-lg ring-1 ring-primary' : 'border-gray-100'}`}>
    {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
            Recomendado
        </div>
    )}
    
    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary mb-6">
        <Database className="w-6 h-6" />
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
    <p className="text-gray-500 text-sm mb-6">Ideal para até {plan.clients} clientes</p>
    
    <div className="mb-8">
        <span className="text-4xl font-extrabold text-gray-900">R${plan.price}</span>
        <span className="text-gray-400 text-sm">/mês</span>
    </div>

    <div className="space-y-4 mb-8 flex-grow">
        <div className="flex items-center text-gray-700 font-medium">
            <Cpu className="w-4 h-4 mr-3 text-primary" /> {plan.specs.cpu}
        </div>
        <div className="flex items-center text-gray-700 font-medium">
            <Zap className="w-4 h-4 mr-3 text-primary" /> {plan.specs.ram}
        </div>
        <div className="flex items-center text-gray-700 font-medium">
            <HardDrive className="w-4 h-4 mr-3 text-primary" /> {plan.specs.ssd}
        </div>
    </div>

    <PlanCheckoutButton 
      plan={plan} 
      planType="servidor-ixc" 
      location="br" 
    />
  </div>
);

const ServidorIxc = () => {
  return (
    <>
      <Helmet>
        <title>Servidor IXC Soft - Avyra</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        {/* Header Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                         <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <Database className="w-4 h-4" /> IXC Certified
                         </div>
                         <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Servidor <span className="text-primary">IXC Soft</span>
                         </h1>
                         <p className="text-xl text-gray-500 mb-8 max-w-lg font-light">
                            Hospedagem especializada para seu sistema de gestão. Performance e segurança para seus dados críticos.
                         </p>
                    </div>
                    <div className="lg:w-1/2">
                         <img alt="Data Center Rack" className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl" src="https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=2000" />
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <IxcCard plan={{ name: "IXC Starter", clients: "1.500", price: "99,90", specs: { cpu: "2 vCPU High Freq", ram: "4 GB RAM", ssd: "80 GB NVMe" } }} />
                    <IxcCard plan={{ name: "IXC Standard", clients: "3.000", price: "179,90", specs: { cpu: "4 vCPU High Freq", ram: "8 GB RAM", ssd: "120 GB NVMe" } }} recommended={true} />
                    <IxcCard plan={{ name: "IXC Advanced", clients: "5.000", price: "259,90", specs: { cpu: "6 vCPU High Freq", ram: "12 GB RAM", ssd: "200 GB NVMe" } }} />
                </div>
            </div>
        </section>

      </div>
    </>
  );
};

export default ServidorIxc;