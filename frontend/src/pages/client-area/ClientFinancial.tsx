import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, FileText, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ClientFinancial = () => {
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const handleNotImplemented = () => {
        showToast({
            title: "🚧 Em Breve!",
            description: "Esta funcionalidade está em desenvolvimento e será lançada em breve.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Financeiro - Área do Cliente</title>
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Financeiro</h1>
                
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800">Página em Construção</h2>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Estamos trabalhando para trazer uma experiência financeira completa para você, incluindo faturas, pagamentos e histórico.
                    </p>
                    <div className="mt-8 flex justify-center items-center space-x-6 text-gray-600">
                        <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-2" /> Faturas
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2" /> Histórico
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ClientFinancial;