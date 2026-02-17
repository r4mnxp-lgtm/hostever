
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Server, Cpu, Zap, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { productsConfig } from '@/config/productsConfig';

const ProductCard = ({ product, index }) => {
  const Icon = product.category === 'dedicated' ? Server : Cpu;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full relative group"
    >
       {/* Gradient Header */}
       <div className="h-2 bg-gradient-to-r from-[#FFB833] to-[#FFA500]"></div>
       
       <div className="p-8 flex-grow flex flex-col">
          <div className="w-14 h-14 rounded-2xl bg-[#FFB833]/10 flex items-center justify-center mb-6 text-[#FFB833] group-hover:bg-[#FFB833] group-hover:text-white transition-colors duration-300">
              <Icon className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-bold text-[#FFB833] mb-3 font-sora">{product.name.pt}</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">{product.description.pt}</p>

          <div className="space-y-4 mb-8">
             {product.specs.map((spec, i) => (
               <div key={i} className="flex items-center text-sm text-gray-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  {spec}
               </div>
             ))}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-auto">
             <div className="flex items-baseline gap-1 mb-5">
                <span className="text-sm text-gray-500 font-medium">A partir de</span>
                <span className="text-3xl font-extrabold text-[#FFB833] tracking-tight">{product.price}</span>
                <span className="text-sm text-gray-500">/mês</span>
             </div>
             
             <Button className="w-full bg-[#FFB833] hover:bg-[#FFA500] text-white font-bold h-12 rounded-lg shadow-md hover:shadow-lg transition-all" asChild>
                <Link to={product.link}>
                   Contratar Agora <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
             </Button>
          </div>
       </div>
    </motion.div>
  );
};

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Nossos Produtos - HostEver</title>
        <meta name="description" content="Servidores VPS e Dedicados de alta performance no Brasil." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen font-sans">
        {/* Hero Section */}
        <section className="bg-[#FFB833] text-white py-24 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#FFB833] via-[#FFA500] to-[#FFD700]/20"></div>
             
             <div className="container mx-auto px-4 relative z-10 text-center">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span className="inline-block py-1 px-3 rounded-full bg-[#FFA500]/20 border border-[#FFA500]/30 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                        Infraestrutura Premium
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-sora mb-6 tracking-tight">
                        Soluções de Alta Performance
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Escolha a potência ideal para o seu projeto. Hardware enterprise, uptime garantido e suporte especializado 24/7.
                    </p>
                 </motion.div>
             </div>
        </section>

        {/* Products Grid */}
        <section className="py-24 relative z-20 -mt-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productsConfig.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>

        {/* Features / Trust Section */}
        <section className="pb-24 pt-8 bg-white">
            <div className="container mx-auto px-4">
               <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-[#FFB833] font-sora mb-4">Por que escolher a HostEver?</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">Tecnologia de ponta pensada para quem não pode parar.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   <div className="text-center px-4">
                       <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#FFB833] mb-6">
                           <Zap className="w-8 h-8" />
                       </div>
                       <h3 className="text-xl font-bold text-[#FFB833] mb-3">Baixa Latência</h3>
                       <p className="text-gray-500 text-sm leading-relaxed">Rede otimizada com rotas diretas para as principais operadoras do Brasil.</p>
                   </div>
                   <div className="text-center px-4">
                       <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#FFB833] mb-6">
                           <ShieldCheck className="w-8 h-8" />
                       </div>
                       <h3 className="text-xl font-bold text-[#FFB833] mb-3">Anti-DDoS Incluso</h3>
                       <p className="text-gray-500 text-sm leading-relaxed">Proteção permanente contra ataques volumétricos e de aplicação (L7).</p>
                   </div>
                   <div className="text-center px-4">
                       <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#FFB833] mb-6">
                           <Cpu className="w-8 h-8" />
                       </div>
                       <h3 className="text-xl font-bold text-[#FFB833] mb-3">Hardware Próprio</h3>
                       <p className="text-gray-500 text-sm leading-relaxed">Não revendemos. Operamos nossa própria infraestrutura com equipamentos Dell e HP.</p>
                   </div>
               </div>
            </div>
        </section>
      </div>
    </>
  );
};

export default Products;
