
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_SERVICES = [
    { id: '1', name: 'Website', status: 'operational' },
    { id: '2', name: 'Painel do Cliente', status: 'operational' },
    { id: '3', name: 'API Virtualizor', status: 'operational' },
    { id: '4', name: 'Rede - São Paulo (BR)', status: 'operational' },
    { id: '5', name: 'Rede - Miami (USA)', status: 'operational' },
];

export const useStatusData = () => {
    const [services, setServices] = useState(() => {
        try {
            const saved = localStorage.getItem('hostever-status-services');
            return saved ? JSON.parse(saved) : INITIAL_SERVICES;
        } catch { return INITIAL_SERVICES; }
    });

    const [incidents, setIncidents] = useState(() => {
        try {
            const saved = localStorage.getItem('hostever-status-incidents');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => { localStorage.setItem('hostever-status-services', JSON.stringify(services)); }, [services]);
    useEffect(() => { localStorage.setItem('hostever-status-incidents', JSON.stringify(incidents)); }, [incidents]);

    const updateServiceStatus = (id, status) => {
        setServices(current => current.map(s => s.id === id ? { ...s, status } : s));
    };

    const addIncident = (incident) => {
        setIncidents(current => [{ ...incident, id: uuidv4(), date: new Date().toISOString() }, ...current]);
    };

    const deleteIncident = (id) => {
        setIncidents(current => current.filter(i => i.id !== id));
    };

    return { services, incidents, updateServiceStatus, addIncident, deleteIncident };
};
