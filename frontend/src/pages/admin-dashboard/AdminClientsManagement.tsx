
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AdminClientsManagement = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 font-sora">Gerenciar Clientes</h1>
                <Button className="bg-[#FFA500]">Adicionar Cliente</Button>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input className="pl-10" placeholder="Buscar por nome, email ou ID..." />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Serviços</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="p-4">
                                <div className="font-bold text-gray-800">Cliente HostEver</div>
                                <div className="text-xs text-gray-500">cliente@hostever.com</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">3 Ativos</td>
                            <td className="p-4"><span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">Ativo</span></td>
                            <td className="p-4 text-right"><Button variant="ghost" size="sm">Editar</Button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminClientsManagement;
