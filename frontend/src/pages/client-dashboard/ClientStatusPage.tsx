
import React from 'react';
import { useStatusData } from '@/hooks/useStatusData';
import { CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';

const StatusIndicator = ({ status }) => {
    if (status === 'operational') return <span className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full"><CheckCircle2 className="w-4 h-4 mr-2" /> Operacional</span>;
    if (status === 'degraded') return <span className="flex items-center text-yellow-600 text-sm font-bold bg-yellow-50 px-3 py-1 rounded-full"><AlertTriangle className="w-4 h-4 mr-2" /> Degradado</span>;
    return <span className="flex items-center text-red-600 text-sm font-bold bg-red-50 px-3 py-1 rounded-full"><XCircle className="w-4 h-4 mr-2" /> Fora do Ar</span>;
};

const ClientStatusPage = () => {
    const { services, incidents } = useStatusData();
    const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 'issues';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#FFB833] font-sora mb-4">Status dos Serviços</h1>
                {overallStatus === 'operational' ? (
                    <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg inline-flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="font-bold">Todos os sistemas operacionais</span>
                    </div>
                ) : (
                    <div className="bg-yellow-500 text-white p-4 rounded-xl shadow-lg inline-flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-bold">Alguns sistemas apresentam instabilidade</span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-[#FFB833] flex items-center gap-2"><Activity className="w-5 h-5 text-[#FFA500]" /> Monitoramento em Tempo Real</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {services.map(svc => (
                        <div key={svc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-700">{svc.name}</span>
                            <StatusIndicator status={svc.status} />
                        </div>
                    ))}
                </div>
            </div>

            {incidents.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#FFB833] px-2">Histórico de Incidentes</h2>
                    {incidents.map(inc => (
                        <div key={inc.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                {inc.severity === 'critical' ? <XCircle className="w-6 h-6 text-red-500 mt-1" /> : <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />}
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{inc.title}</h3>
                                    <p className="text-xs text-gray-400 mb-2">{new Date(inc.date).toLocaleString()}</p>
                                    <p className="text-gray-600">{inc.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ClientStatusPage;
