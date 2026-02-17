import React, { useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { UserCheck, Mail, Phone, Linkedin, FileText, Clock, Filter, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('Todos');
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    useEffect(() => {
        const savedApplications = JSON.parse(localStorage.getItem('avyra-applications') || '[]');
        setApplications(savedApplications);
    }, []);

    const updateApplicationStatus = (id, status) => {
        const updatedApplications = applications.map(app => 
            app.id === id ? { ...app, status } : app
        );
        setApplications(updatedApplications);
        localStorage.setItem('avyra-applications', JSON.stringify(updatedApplications));
        showToast({
            title: "Status Atualizado!",
            description: `A candidatura foi marcada como "${status}".`,
        });
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'Todos') return true;
        return app.status === filter;
    });

    const statusOptions = ['Todos', 'Recebido', 'Em Análise', 'Aprovado', 'Rejeitado'];

    const statusStyles = {
        'Recebido': 'bg-blue-100 text-blue-800',
        'Em Análise': 'bg-yellow-100 text-yellow-800',
        'Aprovado': 'bg-green-100 text-green-800',
        'Rejeitado': 'bg-red-100 text-red-800',
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Candidaturas - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Candidaturas</h1>
                <p className="text-gray-600">Visualize e gerencie os candidatos para as vagas abertas.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Candidatos</h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtrar: {filter}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                                {statusOptions.map(option => (
                                    <DropdownMenuRadioItem key={option} value={option}>{option}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-6">
                    {filteredApplications.length > 0 ? filteredApplications.map(app => (
                        <div key={app.id} className="border rounded-xl p-6 transition-shadow hover:shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                                    <p className="text-orange-600 font-medium">{app.jobTitle}</p>
                                    <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[app.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {app.status}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(app.id, 'Em Análise')}><UserCheck className="h-4 w-4 mr-2" />Analisar</Button>
                                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => updateApplicationStatus(app.id, 'Aprovado')}><Check className="h-4 w-4 mr-2" />Aprovar</Button>
                                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => updateApplicationStatus(app.id, 'Rejeitado')}><X className="h-4 w-4 mr-2" />Rejeitar</Button>
                                </div>
                            </div>
                            <div className="border-t my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a></div>
                                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> <span>{app.phone}</span></div>
                                {app.linkedin && <div className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-gray-400" /> <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Perfil LinkedIn</a></div>}
                                <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /> <span>{app.resume}</span></div>
                                <div className="flex items-center gap-2 col-span-full"><Clock className="h-4 w-4 text-gray-400" /> <span>Enviado em: {new Date(app.date).toLocaleDateString('pt-BR')}</span></div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl">
                            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800">Nenhuma candidatura encontrada</h3>
                            <p className="text-gray-500 mt-2">Não há candidatos com o filtro selecionado ou nenhuma candidatura foi recebida ainda.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default ManageApplications;