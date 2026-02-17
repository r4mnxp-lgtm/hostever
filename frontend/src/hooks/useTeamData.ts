import { useState, useEffect } from 'react';
import { initialTeam } from '@/config/teamConfig';
import { v4 as uuidv4 } from 'uuid';

const DATA_VERSION = '1.1';

export const useTeamData = () => {
    const [team, setTeam] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-team-data');
            if (saved) {
                const { version, data } = JSON.parse(saved);
                if (version === DATA_VERSION) {
                    return data.map(member => ({ ...member, id: member.id || uuidv4() }));
                }
            }
        } catch {
            // fallback to initial if parse fails
        }
        return initialTeam;
    });

    useEffect(() => {
        const dataToSave = {
            version: DATA_VERSION,
            data: team
        };
        localStorage.setItem('avyra-team-data', JSON.stringify(dataToSave));
    }, [team]);

    const saveTeamMember = (memberToSave) => {
        setTeam(currentTeam => {
            const index = currentTeam.findIndex(m => m.id === memberToSave.id);
            if (index > -1) {
                const newTeam = [...currentTeam];
                newTeam[index] = memberToSave;
                return newTeam;
            } else {
                return [...currentTeam, { ...memberToSave, id: uuidv4() }];
            }
        });
    };
    
    const deleteTeamMember = (memberId) => {
        setTeam(currentTeam => currentTeam.filter(m => m.id !== memberId));
    };

    return { team, saveTeamMember, deleteTeamMember };
};