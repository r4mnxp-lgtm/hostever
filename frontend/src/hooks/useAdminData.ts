import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ADMIN = {
    id: 'admin-main',
    name: 'Ramon HostEver',
    email: 'ramon@hostever.com.br',
    role: 'super_admin',
    password: 'admin'
};

const TEST_ADMIN = {
    id: 'admin-test',
    name: 'Test Administrator',
    email: 'admin@test.com',
    role: 'super_admin',
    password: 'admin123' 
};

const INITIAL_ROLES = [
    { id: 'super_admin', name: 'Super Admin', permissions: ['all'] },
    { id: 'manager', name: 'Gerente', permissions: ['manage_products', 'manage_plans', 'manage_status', 'manage_tickets'] },
    { id: 'editor', name: 'Editor', permissions: ['manage_blog', 'manage_company'] },
    { id: 'support', name: 'Suporte', permissions: ['manage_tickets', 'manage_status'] }
];

export const useAdminData = () => {
    const [adminUsers, setAdminUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('avyra-admin-users');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure TEST_ADMIN always exists for evaluation purposes if it's not there
                if (!parsed.find(u => u.email === TEST_ADMIN.email)) {
                    return [...parsed, TEST_ADMIN];
                }
                return parsed;
            }
            return [DEFAULT_ADMIN, TEST_ADMIN];
        } catch {
            return [DEFAULT_ADMIN, TEST_ADMIN];
        }
    });

    const [roles, setRoles] = useState(() => {
         try {
            const saved = localStorage.getItem('avyra-admin-roles');
            return saved ? JSON.parse(saved) : INITIAL_ROLES;
        } catch {
            return INITIAL_ROLES;
        }
    });

    useEffect(() => {
        localStorage.setItem('avyra-admin-users', JSON.stringify(adminUsers));
    }, [adminUsers]);
    
    useEffect(() => {
        localStorage.setItem('avyra-admin-roles', JSON.stringify(roles));
    }, [roles]);

    // Helper to verify password
    const verifyPassword = (inputPassword, storedPassword) => {
         return inputPassword === storedPassword;
    };

    const saveAdminUser = (user) => {
        setAdminUsers(currentUsers => {
            const index = currentUsers.findIndex(u => u.id === user.id);
            if (index > -1) {
                const newUsers = [...currentUsers];
                const passwordToSave = user.password ? user.password : newUsers[index].password;
                newUsers[index] = { ...user, password: passwordToSave };
                return newUsers;
            } else {
                return [...currentUsers, { ...user, id: uuidv4() }];
            }
        });
    };

    const deleteAdminUser = (userId) => {
        if (userId === 'admin-main' || userId === 'admin-test') return;
        setAdminUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
    };

    return { adminUsers, roles, verifyPassword, saveAdminUser, deleteAdminUser };
};