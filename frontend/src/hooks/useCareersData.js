import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialJobs = [
    {
        id: uuidv4(),
        title: 'Engenheiro de Redes Sênior',
        department: 'Engenharia',
        location: 'São Paulo, SP',
        type: 'Tempo Integral',
        description: 'Projetar, implementar e gerenciar a infraestrutura de rede do nosso data center. Experiência com BGP, OSPF e firewalls é essencial.'
    },
    {
        id: uuidv4(),
        title: 'Analista de Suporte Técnico N2',
        department: 'Suporte',
        location: 'Remoto',
        type: 'Tempo Integral',
        description: 'Fornecer suporte técnico especializado para nossos clientes de servidores dedicados e cloud, resolvendo problemas complexos de sistema e rede.'
    }
];

export const useCareersData = () => {
    const [jobs, setJobs] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-careers-data');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map(job => ({ ...job, id: job.id || uuidv4() }));
            }
        } catch {
            // fallback to initial if parse fails
        }
        return initialJobs;
    });

    useEffect(() => {
        localStorage.setItem('avyra-careers-data', JSON.stringify(jobs));
    }, [jobs]);

    const saveJob = (jobToSave) => {
        setJobs(currentJobs => {
            const index = currentJobs.findIndex(j => j.id === jobToSave.id);
            if (index > -1) {
                const newJobs = [...currentJobs];
                newJobs[index] = jobToSave;
                return newJobs;
            } else {
                return [...currentJobs, { ...jobToSave, id: uuidv4() }];
            }
        });
    };
    
    const deleteJob = (jobId) => {
        setJobs(currentJobs => currentJobs.filter(j => j.id !== jobId));
    };

    return { jobs, saveJob, deleteJob };
};