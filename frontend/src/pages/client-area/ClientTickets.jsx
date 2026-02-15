import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClientTicketsData } from '@/hooks/useClientTicketsData';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TicketRow = ({ ticket, index }) => {
    const statusConfig = {
        open: { text: 'Aberto', color: 'bg-blue-500' },
        in_progress: { text: 'Em Andamento', color: 'bg-yellow-500' },
        closed: { text: 'Fechado', color: 'bg-gray-500' },
    };

    return (
        <motion.tr
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border-b hover:bg-gray-50"
        >
            <td className="px-6 py-4 font-medium text-gray-900">
                <Link to={`/client-area/tickets/${ticket.id}`} className="hover:text-orange-600">
                    #{ticket.id.slice(0, 8).toUpperCase()}
                </Link>
            </td>
            <td className="px-6 py-4">{ticket.subject}</td>
            <td className="px-6 py-4">{ticket.department}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusConfig[ticket.status].color}`}>
                    {statusConfig[ticket.status].text}
                </span>
            </td>
            <td className="px-6 py-4">{new Date(ticket.lastUpdate).toLocaleString('pt-BR')}</td>
            <td className="px-6 py-4 text-right">
                <Button asChild variant="outline" size="sm">
                    <Link to={`/client-area/tickets/${ticket.id}`}>Ver Ticket</Link>
                </Button>
            </td>
        </motion.tr>
    );
};

const ClientTickets = () => {
    const { user } = useAuth();
    const { tickets } = useClientTicketsData(user?.id);
    const sortedTickets = [...tickets].sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

    return (
        <>
            <Helmet>
                <title>Meus Tickets - Área do Cliente</title>
            </Helmet>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-gray-900"
                    >
                        Tickets de Suporte
                    </motion.h1>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Button asChild className="hero-gradient text-white">
                            <Link to="/client-area/tickets/new">
                                <PlusCircle className="w-4 h-4 mr-2" /> Abrir Novo Ticket
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                    {sortedTickets.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Ticket ID</th>
                                    <th scope="col" className="px-6 py-3">Assunto</th>
                                    <th scope="col" className="px-6 py-3">Departamento</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Última Atualização</th>
                                    <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTickets.map((ticket, index) => (
                                    <TicketRow key={ticket.id} ticket={ticket} index={index} />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-12">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum ticket encontrado</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Você ainda não abriu nenhum ticket. Clique no botão acima para começar.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ClientTickets;