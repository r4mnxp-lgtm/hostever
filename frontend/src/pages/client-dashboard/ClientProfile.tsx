
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ClientProfile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-[#FFB833] mb-6 font-sora">Meu Perfil</h1>
            <div className="bg-white p-8 rounded-xl border border-gray-100">
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                        <Input defaultValue={user?.name} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <Input defaultValue={user?.email} disabled />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                        <Input defaultValue="Minha Empresa Ltda" />
                    </div>
                    <Button className="w-full bg-[#FFB833]">Salvar Alterações</Button>
                </div>
            </div>
        </div>
    );
};
export default ClientProfile;
