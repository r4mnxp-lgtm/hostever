import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClientTicketsData } from '@/hooks/useClientTicketsData';
import { useClientUsersData } from '@/hooks/useClientUsersData';
import { MessageSquare } from 'lucide-react';

const TicketRow = ({ ticket, clientName, index }) => {
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
                <Link to={`/manage-tickets/${ticket.id}`} className="hover:text-orange-600">
                    #{ticket.id.slice(0, 8).toUpperCase()}
                </Link>
            </td>
            <td className="px-6 py-4">{ticket.subject}</td>
            <td className="px-6 py-4">{clientName}</td>
            <td className="px-6 py-4">{ticket.department}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusConfig[ticket.status].color}`}>
                    {statusConfig[ticket.status].text}
                </span>
            </td>
            <td className="px-6 py-4">{new Date(ticket.lastUpdate).toLocaleString('pt-BR')}</td>
            <td className="px-6 py-4 text-right">
                <Button asChild variant="outline" size="sm">
                    <Link to={`/manage-tickets/${ticket.id}`}>Ver Ticket</Link>
                </Button>
            </td>
        </motion.tr>
    );
};

const ManageTickets = () => {
    const { tickets } = useClientTicketsData(); // No clientId, gets all tickets
    const { getClientNameById } = useClientUsersData();
    const sortedTickets = [...tickets].sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

    return (
        <>
            <Helmet>
                <title>Gerenciar Tickets - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Tickets de Suporte</h1>
                <p className="text-gray-600">Visualize e responda os tickets de todos os clientes.</p>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                {sortedTickets.length > 0 ? (
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ticket ID</th>
                                <th scope="col" className="px-6 py-3">Assunto</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Departamento</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Última Atualização</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTickets.map((ticket, index) => (
                                <TicketRow key={ticket.id} ticket={ticket} clientName={getClientNameById(ticket.clientId)} index={index} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center p-12">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum ticket encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Ainda não há tickets abertos pelos clientes.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageTickets;