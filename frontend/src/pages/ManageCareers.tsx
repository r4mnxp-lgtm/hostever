import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useCareersData } from '@/hooks/useCareersData';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Briefcase } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ManageCareers = () => {
    const { jobs, saveJob, deleteJob } = useCareersData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenModal = (job = null) => {
        if (job) {
            setCurrentJob(job);
            setIsEditing(true);
        } else {
            setCurrentJob({ id: uuidv4(), title: '', department: '', location: '', type: '', description: '' });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const handleSaveJob = () => {
        if (!currentJob.title || !currentJob.department || !currentJob.location || !currentJob.type) {
            showToast({
                title: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos.",
                variant: "destructive",
            });
            return;
        }
        saveJob(currentJob);
        setModalOpen(false);
        showToast({
            title: isEditing ? "Vaga Atualizada!" : "Vaga Criada!",
            description: "A vaga foi salva com sucesso.",
        });
    };

    const handleDeleteJob = (jobId) => {
        deleteJob(jobId);
        showToast({
            title: "Vaga Excluída!",
            description: "A vaga foi removida com sucesso.",
            variant: "destructive",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentJob(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Carreiras - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Vagas de Emprego</h1>
                <p className="text-gray-600">Crie, edite ou remova as vagas disponíveis.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Vagas Publicadas</h2>
                    <Button onClick={() => handleOpenModal()} className="hero-gradient text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Vaga
                    </Button>
                </div>
                 <div className="space-y-4">
                    {jobs.length > 0 ? jobs.map((job) => (
                        <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                                <p className="text-sm text-gray-600">{job.department} - {job.location} ({job.type})</p>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(job)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteJob(job.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma vaga publicada</h3>
                            <p className="mt-1 text-sm text-gray-500">Crie uma nova vaga para começar.</p>
                        </div>
                    )}
                </div>
            </motion.div>
            
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Vaga' : 'Nova Vaga'}</DialogTitle>
                        <DialogDescription>
                           Preencha as informações da vaga de emprego.
                        </DialogDescription>
                    </DialogHeader>
                    {currentJob && (
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                             <div>
                                <Label htmlFor="title">Título da Vaga</Label>
                                <Input id="title" name="title" value={currentJob.title} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="department">Departamento</Label>
                                    <Input id="department" name="department" value={currentJob.department} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="location">Localização</Label>
                                    <Input id="location" name="location" value={currentJob.location} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="type">Tipo (Ex: Tempo Integral)</Label>
                                    <Input id="type" name="type" value={currentJob.type} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Descrição da Vaga</Label>
                                <Textarea id="description" name="description" value={currentJob.description} onChange={handleInputChange} rows={5} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSaveJob} className="hero-gradient text-white">
                            {isEditing ? 'Salvar Alterações' : 'Publicar Vaga'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ManageCareers;