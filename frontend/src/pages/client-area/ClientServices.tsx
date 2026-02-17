import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Server, Cpu, MemoryStick, HardDrive, Wifi, Power, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClientServicesData } from '@/hooks/useClientServicesData';
import { useAuth } from '@/contexts/AuthContext';

const ServiceCard = ({ service, index }) => {
    const statusConfig = {
        active: { text: 'Ativo', color: 'text-green-600', icon: CheckCircle },
        suspended: { text: 'Suspenso', color: 'text-red-600', icon: AlertTriangle },
    };
    const StatusIcon = statusConfig[service.status].icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.ip}</p>
                </div>
                <div className={`flex items-center text-sm font-semibold ${statusConfig[service.status].color}`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {statusConfig[service.status].text}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center"><Cpu className="w-4 h-4 mr-2 text-orange-500" /> {service.specs.cpu}</div>
                <div className="flex items-center"><MemoryStick className="w-4 h-4 mr-2 text-orange-500" /> {service.specs.ram}</div>
                <div className="flex items-center"><HardDrive className="w-4 h-4 mr-2 text-orange-500" /> {service.specs.storage}</div>
                <div className="flex items-center"><Wifi className="w-4 h-4 mr-2 text-orange-500" /> {service.specs.bandwidth}</div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
                <span>Contratado em: {service.since}</span>
                <span>Próximo Vencimento: {service.nextDue}</span>
            </div>
            <div className="flex space-x-2">
                <Button variant="outline" size="sm"><Power className="w-4 h-4 mr-2" /> Reiniciar</Button>
                <Button variant="outline" size="sm">Console</Button>
                <Button variant="outline" size="sm">Gráficos</Button>
            </div>
        </motion.div>
    );
};

const ClientServices = () => {
    const { user } = useAuth();
    const { services } = useClientServicesData(user?.id);

    return (
        <>
            <Helmet>
                <title>Meus Serviços - Área do Cliente</title>
            </Helmet>
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-gray-900 mb-8"
                >
                    Meus Serviços
                </motion.h1>
                <div className="space-y-6">
                    {services.length > 0 ? services.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} />
                    )) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                            <Server className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800">Nenhum serviço encontrado</h3>
                            <p className="text-gray-500 mt-2">Você ainda não possui serviços ativos.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ClientServices;