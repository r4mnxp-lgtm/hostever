
import React from 'react';
import { Users, Server, DollarSign, TrendingUp } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-green-600 font-bold flex items-center bg-green-50 px-2 py-1 rounded">
                <TrendingUp className="w-3 h-3 mr-1" /> {trend}
            </div>
        </div>
    </div>
);

const AdminDashboardHome = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 font-sora">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard title="Receita Mensal" value="R$ 45.230" icon={DollarSign} trend="+12%" />
                <KPICard title="Novos Clientes" value="24" icon={Users} trend="+4" />
                <KPICard title="Servidores Ativos" value="156" icon={Server} trend="+8" />
                <KPICard title="Ticket Médio" value="R$ 189" icon={DollarSign} trend="+2%" />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">Atividade Recente</h2>
                <div className="space-y-4">
                   {[1,2,3].map(i => (
                       <div key={i} className="flex items-center gap-4 text-sm pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                           <div className="w-2 h-2 rounded-full bg-[#FFA500]"></div>
                           <span className="text-gray-600">Novo pedido de VPS Cloud 4GB por <strong>Cliente X</strong></span>
                           <span className="ml-auto text-gray-400 text-xs">Há 2 horas</span>
                       </div>
                   ))}
                </div>
            </div>
        </div>
    );
};
export default AdminDashboardHome;
