import { useState, useEffect, useCallback } from 'react';

const LEADS_STORAGE_KEY = 'avyra_leads_data';

const getInitialLeads = () => {
    try {
        const storedData = localStorage.getItem(LEADS_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to parse leads from localStorage", error);
    }
    return [];
};

export const useLeadsData = () => {
    const [leads, setLeads] = useState(getInitialLeads);

    useEffect(() => {
        try {
            localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
        } catch (error) {
            console.error("Failed to save leads to localStorage", error);
        }
    }, [leads]);

    const addLead = useCallback((newLead) => {
        setLeads(prevLeads => [...prevLeads, newLead]);
    }, []);

    const deleteLead = useCallback((leadId) => {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    }, []);

    return { leads, addLead, deleteLead };
};