import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLeadsData } from '@/hooks/useLeadsData';
import { useProductsData } from '@/hooks/useProductsData';
import { Button } from '@/components/ui/button';
import { Trash2, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ManageLeads = () => {
    const { leads, deleteLead } = useLeadsData();
    const { products } = useProductsData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const { i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? (product.name[currentLang] || product.name.pt) : 'Produto não encontrado';
    };

    const handleDelete = (leadId) => {
        deleteLead(leadId);
        showToast({
            title: "Lead Removido!",
            description: "O lead foi removido da lista.",
            variant: "destructive"
        });
    };
    
    const sortedLeads = [...leads].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
            <Helmet>
                <title>Gerenciar Leads - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Leads</h1>
                <p className="text-gray-600">Visualize e gerencie os contatos recebidos através do site.</p>
            </motion.div>
            
            {sortedLeads.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">E-mail</th>
                                <th scope="col" className="px-6 py-3">Telefone</th>
                                <th scope="col" className="px-6 py-3">Interesse</th>
                                <th scope="col" className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedLeads.map((lead, index) => (
                                <motion.tr
                                    key={lead.id}
                                    className="bg-white border-b hover:bg-gray-50"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <td className="px-6 py-4">{new Date(lead.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{lead.name}</td>
                                    <td className="px-6 py-4">{lead.email}</td>
                                    <td className="px-6 py-4">{lead.phone}</td>
                                    <td className="px-6 py-4">{getProductName(lead.product)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação não pode ser desfeita. Isso removerá permanentemente o lead.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(lead.id)} className="bg-red-600 hover:bg-red-700">
                                                        Excluir
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
                 className="text-center p-12 bg-white rounded-2xl shadow-lg"
               >
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum lead encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Ainda não há contatos registrados.
                    </p>
               </motion.div>
            )}
        </>
    );
};

export default ManageLeads;