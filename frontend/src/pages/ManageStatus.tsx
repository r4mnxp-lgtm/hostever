import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useStatusData } from '@/hooks/useStatusData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, AlertTriangle, CheckCircle2, Clock, Trash2, Edit, Server, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ManageStatus = () => {
    const { 
        services, 
        incidents, 
        addService,
        editService,
        deleteService,
        updateServiceStatus, 
        addIncident, 
        updateIncident, 
        deleteIncident, 
        getStatusColor,
        getStatusLabel 
    } = useStatusData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    // Incident State
    const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
    const [currentIncident, setCurrentIncident] = useState(null);
    const [isEditingIncident, setIsEditingIncident] = useState(false);

    // Service State
    const [isServiceModalOpen, setServiceModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [isEditingService, setIsEditingService] = useState(false);

    // --- Incident Handlers ---
    const handleOpenIncidentModal = (incident = null) => {
        if (incident) {
            setCurrentIncident(incident);
            setIsEditingIncident(true);
        } else {
            setCurrentIncident({ title: '', status: 'investigating', severity: 'minor', description: '' });
            setIsEditingIncident(false);
        }
        setIncidentModalOpen(true);
    };

    const handleSaveIncident = () => {
        if (isEditingIncident) {
            updateIncident(currentIncident);
            showToast({ title: "Incidente Atualizado", description: "As alterações foram salvas." });
        } else {
            addIncident(currentIncident);
            showToast({ title: "Incidente Criado", description: "Novo incidente reportado com sucesso." });
        }
        setIncidentModalOpen(false);
    };

    const handleDeleteIncident = (id) => {
        deleteIncident(id);
        showToast({ title: "Incidente Removido", variant: "destructive" });
    };

    // --- Service Handlers ---
    const handleOpenServiceModal = (service = null) => {
        if (service) {
            setCurrentService(service);
            setIsEditingService(true);
        } else {
            setCurrentService({ name: '', group: 'General', status: 'operational' });
            setIsEditingService(false);
        }
        setServiceModalOpen(true);
    };

    const handleSaveService = () => {
        if (!currentService.name) {
            showToast({ title: "Erro", description: "O nome do serviço é obrigatório", variant: "destructive" });
            return;
        }
        if (isEditingService) {
            editService(currentService);
            showToast({ title: "Serviço Atualizado", description: "Configurações do serviço salvas." });
        } else {
            addService(currentService);
            showToast({ title: "Serviço Criado", description: "Novo serviço adicionado ao monitoramento." });
        }
        setServiceModalOpen(false);
    };

    const handleDeleteService = (id) => {
        deleteService(id);
        showToast({ title: "Serviço Removido", variant: "destructive" });
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Status - HostEver Admin</title>
            </Helmet>

            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Status do Sistema</h1>
                    <p className="text-gray-600">Monitore e gerencie serviços e incidentes.</p>
                </motion.div>

                {/* Services Section */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Server className="w-5 h-5 text-[#84cc16]" />
                        Serviços Monitorados
                    </h2>
                    <Button onClick={() => handleOpenServiceModal()} variant="outline" className="border-[#84cc16] text-[#84cc16] hover:bg-[#84cc16] hover:text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Serviço
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col group relative">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenServiceModal(service)}>
                                    <Settings className="h-3 w-3 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteService(service.id)}>
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-between mb-4 mt-2">
                                <h3 className="font-bold text-gray-800 truncate pr-2" title={service.name}>{service.name}</h3>
                                <div className={cn("w-3 h-3 rounded-full flex-shrink-0", getStatusColor(service.status))} />
                            </div>
                            
                            <div className="mt-auto space-y-2">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{service.group}</p>
                                <Select 
                                    value={service.status} 
                                    onValueChange={(value) => {
                                        updateServiceStatus(service.id, value);
                                        showToast({ title: "Status Atualizado", description: `${service.name} agora está ${getStatusLabel(value)}` });
                                    }}
                                >
                                    <SelectTrigger className="w-full h-8 text-xs">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="operational">Operacional</SelectItem>
                                        <SelectItem value="degraded">Degradado</SelectItem>
                                        <SelectItem value="partial_outage">Parcial</SelectItem>
                                        <SelectItem value="major_outage">Crítico</SelectItem>
                                        <SelectItem value="maintenance">Manutenção</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Incidents Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Incidentes e Manutenções
                        </h2>
                        <Button onClick={() => handleOpenIncidentModal()} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">
                            <PlusCircle className="mr-2 h-4 w-4" /> Novo Incidente
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {incidents.length > 0 ? incidents.map((incident) => (
                            <div key={incident.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                incident.status === 'resolved' ? "bg-green-100 text-green-700" :
                                                incident.status === 'investigating' ? "bg-orange-100 text-orange-700" :
                                                "bg-blue-100 text-blue-700"
                                            )}>
                                                {incident.status}
                                            </span>
                                            <span className="text-gray-400 text-xs flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(incident.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{incident.title}</h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenIncidentModal(incident)}>
                                            <Edit className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteIncident(incident.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{incident.description}</p>
                            </div>
                        )) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Todos os sistemas operacionais</h3>
                                <p className="text-gray-500">Nenhum incidente ativo reportado no momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Service Modal */}
            <Dialog open={isServiceModalOpen} onOpenChange={setServiceModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{isEditingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                    </DialogHeader>
                    {currentService && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome do Serviço</Label>
                                <Input 
                                    value={currentService.name} 
                                    onChange={(e) => setCurrentService({...currentService, name: e.target.value})} 
                                    placeholder="Ex: API de Pagamentos"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Grupo</Label>
                                <Input 
                                    value={currentService.group} 
                                    onChange={(e) => setCurrentService({...currentService, group: e.target.value})} 
                                    placeholder="Ex: Backend"
                                />
                            </div>
                             <div className="space-y-2">
                                <Label>Status Inicial</Label>
                                <Select 
                                    value={currentService.status} 
                                    onValueChange={(val) => setCurrentService({...currentService, status: val})}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="operational">Operacional</SelectItem>
                                        <SelectItem value="degraded">Degradado</SelectItem>
                                        <SelectItem value="partial_outage">Parcial</SelectItem>
                                        <SelectItem value="maintenance">Manutenção</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                     <DialogFooter>
                        <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
                        <Button onClick={handleSaveService} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Incident Modal */}
            <Dialog open={isIncidentModalOpen} onOpenChange={setIncidentModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{isEditingIncident ? 'Editar Incidente' : 'Reportar Incidente'}</DialogTitle>
                        <DialogDescription>
                            Comunique problemas ou manutenções para seus usuários.
                        </DialogDescription>
                    </DialogHeader>
                    {currentIncident && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input 
                                    value={currentIncident.title} 
                                    onChange={(e) => setCurrentIncident({...currentIncident, title: e.target.value})} 
                                    placeholder="Ex: Latência na Rede SP"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select 
                                        value={currentIncident.status} 
                                        onValueChange={(val) => setCurrentIncident({...currentIncident, status: val})}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="investigating">Investigando</SelectItem>
                                            <SelectItem value="identified">Identificado</SelectItem>
                                            <SelectItem value="monitoring">Monitorando</SelectItem>
                                            <SelectItem value="resolved">Resolvido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Severidade</Label>
                                    <Select 
                                        value={currentIncident.severity} 
                                        onValueChange={(val) => setCurrentIncident({...currentIncident, severity: val})}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="minor">Baixa</SelectItem>
                                            <SelectItem value="major">Alta</SelectItem>
                                            <SelectItem value="critical">Crítica</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descrição</Label>
                                <Textarea 
                                    value={currentIncident.description} 
                                    onChange={(e) => setCurrentIncident({...currentIncident, description: e.target.value})} 
                                    placeholder="Descreva o problema e a previsão de retorno..."
                                    className="h-32"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
                        <Button onClick={handleSaveIncident} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">Publicar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ManageStatus;