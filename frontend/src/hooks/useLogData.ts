import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useLogData = () => {
    const [logs, setLogs] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-logs');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('avyra-logs', JSON.stringify(logs));
    }, [logs]);

    const addLog = (logEntry) => {
        const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            ...logEntry,
        };
        setLogs(currentLogs => [newLog, ...currentLogs]);
    };

    return { logs, addLog };
};