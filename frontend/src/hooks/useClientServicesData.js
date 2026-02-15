import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialServices = [
    {
        id: uuidv4(),
        clientId: 'some-client-id', // This should match a client's ID
        name: 'Servidor VPS - Potência',
        ip: '192.168.1.10',
        status: 'active',
        since: '15/01/2024',
        nextDue: '15/10/2025',
        specs: {
            cpu: '4 vCPU',
            ram: '12 GB RAM',
            storage: '60 GB SSD',
            bandwidth: '1 Gbps Porta'
        }
    },
    {
        id: uuidv4(),
        clientId: 'some-client-id', // This should match a client's ID
        name: 'Servidor Dedicado - Xeon E5',
        ip: '10.0.0.25',
        status: 'active',
        since: '20/05/2023',
        nextDue: '20/10/2025',
        specs: {
            cpu: 'Single Xeon E5-2690 v3',
            ram: '128GB DDR4',
            storage: '1TB NVMe M.2',
            bandwidth: '1 Gbps Porta'
        }
    }
];

export const useClientServicesData = (clientId) => {
    const [allServices, setAllServices] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-client-services');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure initial services have a clientId if they don't
                const clientUsers = JSON.parse(localStorage.getItem('avyra-client-users') || '[]');
                const defaultClientId = clientUsers[0]?.id;

                return parsed.map(service => ({
                    ...service,
                    clientId: service.clientId || defaultClientId
                }));
            }
        } catch (error) {
            console.error("Failed to parse client services from localStorage", error);
        }
        
        const clientUsers = JSON.parse(localStorage.getItem('avyra-client-users') || '[]');
        const defaultClientId = clientUsers[0]?.id;
        return initialServices.map(s => ({...s, clientId: defaultClientId }));
    });

    useEffect(() => {
        localStorage.setItem('avyra-client-services', JSON.stringify(allServices));
    }, [allServices]);

    const services = clientId ? allServices.filter(s => s.clientId === clientId) : [];

    return { services };
};