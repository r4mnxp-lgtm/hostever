import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Cloud, Server, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductVisibilityCard = ({ title, description, icon: Icon, active, onToggle }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
            <div className={`p-2 rounded-lg ${active ? 'bg-[#84cc16]/10 text-[#84cc16]' : 'bg-gray-100 text-gray-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
        </CardHeader>
        <CardContent>
            <CardDescription className="mb-4 h-10 line-clamp-2">
                {description}
            </CardDescription>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <Switch checked={active} onCheckedChange={onToggle} />
                    <span className="text-sm font-medium text-gray-600">{active ? 'Visível no Site' : 'Oculto'}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

const ManageProducts = () => {
    const [visibility, setVisibility] = useState({
        vpsCloud: true,
        dedicated: true,
    });

    const toggle = (key) => setVisibility(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <>
            <Helmet>
                <title>Visibilidade de Produtos - HostEver Admin</title>
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Produtos</h1>
                    <p className="text-gray-600">Controle quais categorias de produtos aparecem na página inicial e no menu.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <ProductVisibilityCard 
                        title="VPS Cloud NVMe" 
                        description="Servidores virtuais de alta performance com armazenamento NVMe e processadores rápidos."
                        icon={Cloud}
                        active={visibility.vpsCloud}
                        onToggle={() => toggle('vpsCloud')}
                    />
                     <ProductVisibilityCard 
                        title="Servidores Dedicados" 
                        description="Hardware Bare Metal exclusivo para grandes infraestruturas e processamento pesado."
                        icon={Server}
                        active={visibility.dedicated}
                        onToggle={() => toggle('dedicated')}
                    />
                </div>

                <div className="bg-[#84cc16]/5 border border-[#84cc16]/20 rounded-2xl p-8 text-center sm:text-left sm:flex items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Gerenciar Preços e Planos</h3>
                        <p className="text-gray-600">Para adicionar, editar ou remover planos específicos (ex: VPS 2GB, Dedicado Xeon), acesse o gerenciador de planos.</p>
                    </div>
                    <Button asChild size="lg" className="bg-[#84cc16] hover:bg-[#65a30d] text-white shrink-0 mt-4 sm:mt-0">
                        <Link to="/manage-plans">
                            Ir para Planos <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </>
    );
};

export default ManageProducts;