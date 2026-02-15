import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClientTicketsData } from '@/hooks/useClientTicketsData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Send, User, Headphones as Headset } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';

const TicketMessage = ({ message }) => {
    const isClient = message.sender === 'client';
    return (
        <div className={`flex items-start gap-4 ${isClient ? 'justify-end' : 'justify-start'}`}>
            {!isClient && <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0"><Headset className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-lg p-4 rounded-2xl ${isClient ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p>{message.content}</p>
                <p className={`text-xs mt-2 ${isClient ? 'text-orange-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleString('pt-BR')}
                </p>
            </div>
            {isClient && <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-white" /></div>}
        </div>
    );
};

const ClientTicketDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { getTicketById, addMessageToTicket } = useClientTicketsData(user?.id);
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const [newMessage, setNewMessage] = useState('');
    const ticket = getTicketById(id);

    if (!ticket) {
        return <div>Ticket não encontrado ou você não tem permissão para visualizá-lo.</div>;
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const message = {
            id: uuidv4(),
            sender: 'client',
            timestamp: new Date().toISOString(),
            content: newMessage,
        };
        addMessageToTicket(id, message);
        setNewMessage('');
        showToast({ title: "Mensagem enviada!", variant: "success" });
    };

    const statusConfig = {
        open: { text: 'Aberto', color: 'bg-blue-500' },
        in_progress: { text: 'Em Andamento', color: 'bg-yellow-500' },
        closed: { text: 'Fechado', color: 'bg-gray-500' },
    };

    return (
        <>
            <Helmet>
                <title>Ticket #{ticket.id.slice(0, 8)} - Área do Cliente</title>
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link to="/client-area/tickets" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para todos os tickets
                </Link>

                <div className="bg-white rounded-2xl shadow-lg">
                    <header className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
                            <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${statusConfig[ticket.status].color}`}>
                                {statusConfig[ticket.status].text}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Aberto em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                    </header>

                    <div className="p-6 space-y-6 h-[50vh] overflow-y-auto">
                        {ticket.messages.map(msg => (
                            <TicketMessage key={msg.id} message={msg} />
                        ))}
                    </div>

                    {ticket.status !== 'closed' && (
                        <footer className="p-6 border-t border-gray-200">
                            <div className="flex items-start space-x-4">
                                <Textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua resposta..."
                                    className="flex-1"
                                    rows={3}
                                />
                                <Button onClick={handleSendMessage} className="hero-gradient text-white">
                                    <Send className="w-4 h-4 mr-2" /> Enviar
                                </Button>
                            </div>
                        </footer>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default ClientTicketDetails;