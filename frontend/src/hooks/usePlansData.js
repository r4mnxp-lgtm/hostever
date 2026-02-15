import { useState, useEffect } from 'react';
import { initialPlans } from '@/config/plansConfig';
import { v4 as uuidv4 } from 'uuid';

export const usePlansData = () => {
    const [plans, setPlans] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-plans-data');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure vpsEconomy exists in structure if loading old data
                if (!parsed.vpsEconomy) {
                    return { ...parsed, vpsEconomy: initialPlans.vpsEconomy };
                }
                return parsed;
            }
            return initialPlans;
        } catch {
            return initialPlans;
        }
    });

    useEffect(() => {
        localStorage.setItem('avyra-plans-data', JSON.stringify(plans));
    }, [plans]);

    const savePlan = (plan, type, location) => {
        setPlans(currentPlans => {
            const category = currentPlans[type] || {};
            const regionList = category[location] || [];
            
            const index = regionList.findIndex(p => p.id === plan.id);
            let newRegionList;

            if (index > -1) {
                newRegionList = [...regionList];
                newRegionList[index] = plan;
            } else {
                newRegionList = [...regionList, { ...plan, id: uuidv4() }];
            }

            return {
                ...currentPlans,
                [type]: {
                    ...category,
                    [location]: newRegionList
                }
            };
        });
    };

    const deletePlan = (planId, type, location) => {
        setPlans(currentPlans => {
            const category = currentPlans[type] || {};
            const regionList = category[location] || [];
            
            return {
                ...currentPlans,
                [type]: {
                    ...category,
                    [location]: regionList.filter(p => p.id !== planId)
                }
            };
        });
    };

    return { plans, savePlan, deletePlan };
};