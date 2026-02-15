
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ClientSupportTickets = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const [data] = await db.query('SELECT * FROM tickets');
            setTickets(data);
        };
        fetch();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Suporte Técnico</h1>
                <Button className="bg-[#FFA500]"><Plus className="w-4 h-4 mr-2" /> Abrir Ticket</Button>
            </div>
            
            <div className="space-y-4">
                {tickets.map(t => (
                    <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-gray-400">#{t.id}</span>
                                <h3 className="font-bold text-gray-800">{t.subject}</h3>
                            </div>
                            <p className="text-xs text-gray-500">Atualizado em {t.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {t.priority === 'high' ? 'Alta' : 'Normal'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                {t.status === 'open' ? 'Aberto' : 'Fechado'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ClientSupportTickets;
