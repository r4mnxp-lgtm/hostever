import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Server, MessageSquare, LifeBuoy, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClientServicesData } from '@/hooks/useClientServicesData';
import { useClientTicketsData } from '@/hooks/useClientTicketsData';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const QuickLinkCard = ({ icon: Icon, title, description, to }) => (
    <Link to={to} className="bg-white p-6 rounded-2xl shadow-lg group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100">
            <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
);

const ClientDashboard = () => {
    const { user } = useAuth();
    const { services } = useClientServicesData(user?.id);
    const { tickets } = useClientTicketsData(user?.id);

    const activeServices = services.filter(s => s.status === 'active').length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    return (
        <>
            <Helmet>
                <title>Dashboard - Área do Cliente</title>
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo, {user?.name || 'Cliente'}!</h1>
                <p className="text-gray-600 mb-8">Aqui está um resumo da sua conta.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={Server} label="Serviços Ativos" value={activeServices} color="bg-green-500" />
                    <StatCard icon={MessageSquare} label="Tickets Abertos" value={openTickets} color="bg-blue-500" />
                    <StatCard icon={LifeBuoy} label="Tickets Fechados" value={closedTickets} color="bg-gray-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Acesso Rápido</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <QuickLinkCard 
                        icon={Server}
                        title="Gerenciar Meus Serviços"
                        description="Veja detalhes, gerencie e monitore seus serviços contratados."
                        to="/client-area/services"
                    />
                    <QuickLinkCard 
                        icon={MessageSquare}
                        title="Abrir Novo Ticket"
                        description="Precisa de ajuda? Nossa equipe de suporte está pronta para te atender."
                        to="/client-area/tickets/new"
                    />
                </div>
            </motion.div>
        </>
    );
};

export default ClientDashboard;