import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLogData } from '@/hooks/useLogData';
import { History, LogIn, LogOut } from 'lucide-react';

const LogIcon = ({ action }) => {
    switch (action) {
        case 'login':
            return <LogIn className="w-5 h-5 text-green-500" />;
        case 'logout':
            return <LogOut className="w-5 h-5 text-red-500" />;
        default:
            return <History className="w-5 h-5 text-gray-500" />;
    }
};

const ManageLogs = () => {
    const { logs } = useLogData();

    return (
        <>
            <Helmet>
                <title>Logs de Acesso - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Logs de Acesso</h1>
                <p className="text-gray-600">Visualize o histórico de logins e logouts do sistema.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="space-y-4">
                    {logs.length > 0 ? logs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                            <div className="flex items-center gap-4">
                                <LogIcon action={log.action} />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        <span className="capitalize">{log.userType}</span>: {log.userName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Ação: <span className="font-medium capitalize">{log.action}</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <History className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum log encontrado</h3>
                            <p className="mt-1 text-sm text-gray-500">Ainda não há registros de atividade.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default ManageLogs;