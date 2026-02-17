import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ManageEmails = () => {
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
            title: "🚧 Funcionalidade em desenvolvimento!",
            description: "Esta funcionalidade ainda não foi implementada. Peça no chat para priorizá-la! 🚀",
        });
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar E-mails - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar E-mails Corporativos</h1>
                <p className="text-gray-600">Crie e administre as contas de e-mail do seu domínio.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Mail className="mx-auto h-16 w-16 text-orange-500 mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Em Breve: Gestão Completa de E-mails</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                    Estamos trabalhando para trazer uma solução completa para você gerenciar seus e-mails corporativos diretamente deste painel. Crie contas, defina senhas, configure redirecionamentos e muito mais.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg text-left mb-8">
                    <div className="flex">
                        <div className="py-1"><AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" /></div>
                        <div>
                            <p className="font-bold">Ainda não disponível</p>
                            <p className="text-sm">Esta funcionalidade requer integração com um serviço de e-mail. Solicite no chat para que possamos implementá-la para você!</p>
                        </div>
                    </div>
                </div>
                <Button onClick={handleNotImplemented} className="hero-gradient text-white">
                    Solicitar Implementação
                </Button>
            </motion.div>
        </>
    );
};

export default ManageEmails;