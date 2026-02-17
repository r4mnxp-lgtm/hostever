import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialTickets = [
    {
        id: uuidv4(),
        clientId: 'some-client-id',
        subject: 'Problema de conectividade no Servidor Dedicado',
        department: 'Suporte Técnico',
        relatedService: 'some-service-id',
        status: 'open',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        lastUpdate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        messages: [
            {
                id: uuidv4(),
                sender: 'client',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                content: 'Olá, estou enfrentando problemas de conectividade no meu servidor dedicado. A latência parece estar muito alta.'
            },
            {
                id: uuidv4(),
                sender: 'support',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                content: 'Olá! Recebemos sua solicitação e nossa equipe já está investigando a causa da alta latência. Manteremos você atualizado.'
            }
        ]
    },
    {
        id: uuidv4(),
        clientId: 'some-client-id',
        subject: 'Dúvida sobre fatura',
        department: 'Financeiro',
        relatedService: null,
        status: 'closed',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        lastUpdate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        messages: [
            {
                id: uuidv4(),
                sender: 'client',
                timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
                content: 'Gostaria de saber se é possível alterar a data de vencimento da minha fatura.'
            },
            {
                id: uuidv4(),
                sender: 'support',
                timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
                content: 'Claro! Para qual data você gostaria de alterar?'
            },
            {
                id: uuidv4(),
                sender: 'client',
                timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
                content: 'Para o dia 15 de cada mês, por favor.'
            },
            {
                id: uuidv4(),
                sender: 'support',
                timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
                content: 'Alteração realizada com sucesso! Sua próxima fatura já terá o vencimento no dia 15. Estamos fechando este ticket, mas se precisar de algo mais, é só chamar!'
            }
        ]
    }
];

export const useClientTicketsData = (clientId) => {
    const [allTickets, setAllTickets] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-client-tickets');
            if (saved) {
                const parsed = JSON.parse(saved);
                const clientUsers = JSON.parse(localStorage.getItem('avyra-client-users') || '[]');
                const defaultClientId = clientUsers[0]?.id;

                return parsed.map(ticket => ({
                    ...ticket,
                    clientId: ticket.clientId || defaultClientId
                }));
            }
        } catch (error) {
            console.error("Failed to parse client tickets from localStorage", error);
        }
        
        const clientUsers = JSON.parse(localStorage.getItem('avyra-client-users') || '[]');
        const defaultClientId = clientUsers[0]?.id;
        return initialTickets.map(t => ({...t, clientId: defaultClientId}));
    });

    useEffect(() => {
        localStorage.setItem('avyra-client-tickets', JSON.stringify(allTickets));
    }, [allTickets]);

    const tickets = clientId ? allTickets.filter(t => t.clientId === clientId) : allTickets;

    const addTicket = (newTicket) => {
        setAllTickets(prevTickets => [newTicket, ...prevTickets]);
    };

    const getTicketById = (ticketId) => {
        return allTickets.find(t => t.id === ticketId);
    };

    const addMessageToTicket = (ticketId, message) => {
        setAllTickets(prevTickets => 
            prevTickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return {
                        ...ticket,
                        messages: [...ticket.messages, message],
                        lastUpdate: new Date().toISOString(),
                        status: 'in_progress',
                    };
                }
                return ticket;
            })
        );
    };

    const updateTicketStatus = (ticketId, status) => {
        setAllTickets(prevTickets =>
            prevTickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return { ...ticket, status, lastUpdate: new Date().toISOString() };
                }
                return ticket;
            })
        );
    };

    return { tickets, addTicket, getTicketById, addMessageToTicket, updateTicketStatus };
};