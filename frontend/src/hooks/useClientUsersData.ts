import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialClientUsers = [
    {
        id: uuidv4(),
        name: 'Cliente Exemplo',
        email: 'cliente@exemplo.com',
        password: 'senha123',
        cpf: '111.111.111-11',
        birthDate: '1995-05-10',
    },
    {
        id: uuidv4(),
        name: 'Cliente Teste',
        email: 'teste@avyra.com.br',
        password: 'teste',
        cpf: '222.222.222-22',
        birthDate: '1988-11-20',
    }
];

export const useClientUsersData = () => {
    const [clientUsers, setClientUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-client-users');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (!parsed.find(u => u.email === 'teste@avyra.com.br')) {
                    return [...parsed, ...initialClientUsers.filter(u => !parsed.find(p => p.email === u.email))];
                }
                return parsed;
            }
        } catch (error) {
            console.error("Failed to parse client users from localStorage", error);
        }
        return initialClientUsers;
    });

    useEffect(() => {
        localStorage.setItem('avyra-client-users', JSON.stringify(clientUsers));
    }, [clientUsers]);

    const getClientNameById = (clientId) => {
        const client = clientUsers.find(u => u.id === clientId);
        return client ? client.name : 'Cliente Desconhecido';
    };

    return { clientUsers, getClientNameById };
};