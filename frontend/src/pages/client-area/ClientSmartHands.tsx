import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HardHat, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ClientSmartHands = () => {
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
                <title>Smart Hands - Área do Cliente</title>
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Solicitações de Smart Hands</h1>
                    <Button onClick={handleNotImplemented} className="hero-gradient text-white">
                        <PlusCircle className="w-4 h-4 mr-2" /> Nova Solicitação
                    </Button>
                </div>
                
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <HardHat className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800">Página em Construção</h2>
                    <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                        Em breve, você poderá solicitar serviços de Smart Hands, agendar visitas técnicas e liberar acessos ao datacenter diretamente por aqui.
                    </p>
                </div>
            </motion.div>
        </>
    );
};

export default ClientSmartHands;