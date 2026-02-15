import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { usePlansData } from '@/hooks/usePlansData';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Server, Cloud, Wallet } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const ManagePlans = () => {
    const { plans, savePlan, deletePlan } = usePlansData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Default tab
    const [activeTab, setActiveTab] = useState('vps-br');

    // Parse active tab to get Type and Location
    const [currentType, currentLocation] = activeTab.split('-');

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setCurrentPlan(plan);
            setIsEditing(true);
        } else {
            let defaultSpecs = {};
            if (currentType === 'vps' || currentType === 'vpsEconomy') defaultSpecs = { vcpu: '', ram: '', ssd: '' };
            else if (currentType === 'dedicated') defaultSpecs = { cpu: '', ram: '', ssd: '' };

            setCurrentPlan({ id: uuidv4(), name: '', price: '', checkoutUrl: '', popular: false, specs: defaultSpecs });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const handleSavePlan = () => {
        savePlan(currentPlan, currentType, currentLocation);
        setModalOpen(false);
        showToast({
            title: isEditing ? "Plano Atualizado!" : "Plano Criado!",
            description: "O plano foi salvo localmente com sucesso.",
        });
    };
    
    const handleDeletePlan = (planId) => {
        deletePlan(planId, currentType, currentLocation);
        showToast({
            title: "Plano Excluído!",
            description: "O plano foi removido com sucesso.",
            variant: "destructive",
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentPlan(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlan(prev => ({
            ...prev,
            specs: { ...prev.specs, [name]: value }
        }));
    };
    
    const renderPlanSpecs = (plan) => {
        const specs = plan.specs || {};
        if (currentType === 'vps' || currentType === 'vpsEconomy') {
            return `vCPU: ${specs.vcpu || 'N/A'} | RAM: ${specs.ram || 'N/A'} | SSD: ${specs.ssd || 'N/A'}`;
        }
        if (currentType === 'dedicated') {
            return `CPU: ${specs.cpu || 'N/A'} | RAM: ${specs.ram || 'N/A'} | Storage: ${specs.ssd || 'N/A'}`;
        }
        return '';
    };

    const tabs = [
        { id: 'vps-br', label: 'VPS - Brasil', icon: Cloud },
        { id: 'vps-us', label: 'VPS - EUA', icon: Cloud },
        { id: 'vpsEconomy-br', label: 'VPS Economy', icon: Wallet },
        { id: 'dedicated-br', label: 'Dedicado - Brasil', icon: Server },
        { id: 'dedicated-us', label: 'Dedicado - EUA', icon: Server },
    ];
    
    const currentPlansList = plans[currentType]?.[currentLocation] || [];

    return (
        <>
            <Helmet>
                <title>Gerenciar Planos - HostEver Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Planos</h1>
                <p className="text-gray-600">Adicione, edite ou remova os planos de serviço do seu site.</p>
            </motion.div>

             <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto pb-1" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                                    activeTab === tab.id
                                        ? 'border-[#84cc16] text-[#84cc16]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                )}
                            >
                                <tab.icon className={cn('mr-2 h-5 w-5', activeTab === tab.id ? 'text-[#84cc16]' : 'text-gray-400 group-hover:text-gray-500')} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Planos Ativos: <span className="text-[#84cc16] capitalize">{currentType}</span></h2>
                    <Button onClick={() => handleOpenModal()} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Plano
                    </Button>
                </div>
                 <div className="space-y-4">
                    {currentPlansList.length > 0 ? currentPlansList.map((plan) => (
                        <div key={plan.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4 hover:border-gray-200 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-800">{plan.name}</h3>
                                    {plan.popular && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Popular</span>}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{renderPlanSpecs(plan)}</p>
                                <p className="text-sm font-bold text-[#84cc16] mt-1">R$ {plan.price} <span className="text-gray-400 font-normal">/mês</span></p>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(plan)} className="hover:text-[#84cc16]"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeletePlan(plan.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                             <p className="text-gray-500">Nenhum plano cadastrado para esta categoria.</p>
                             <Button variant="link" onClick={() => handleOpenModal()} className="text-[#84cc16]">Criar o primeiro</Button>
                        </div>
                    )}
                </div>
            </motion.div>
            
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
                        <DialogDescription>
                           Preencha as informações do plano para a categoria <strong>{currentType} - {currentLocation}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    {currentPlan && (
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                             <div>
                                <Label htmlFor="name">Nome do Plano</Label>
                                <Input id="name" name="name" value={currentPlan.name} onChange={handleInputChange} placeholder="Ex: VPS Start" />
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center"><Server className="w-4 h-4 mr-2"/> Especificações Técnicas</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.keys(currentPlan.specs).map(specKey => (
                                        <div key={specKey}>
                                            <Label htmlFor={specKey} className="capitalize text-xs text-gray-500 mb-1 block">{specKey.toUpperCase()}</Label>
                                            <Input id={specKey} name={specKey} value={currentPlan.specs[specKey]} onChange={handleSpecChange} className="h-9" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center"><Wallet className="w-4 h-4 mr-2"/> Detalhes Comerciais</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Preço (R$)</Label>
                                        <Input id="price" name="price" value={currentPlan.price} onChange={handleInputChange} placeholder="29,90" />
                                    </div>
                                    <div>
                                        <Label htmlFor="checkoutUrl">Link Checkout</Label>
                                        <Input id="checkoutUrl" name="checkoutUrl" value={currentPlan.checkoutUrl} onChange={handleInputChange} placeholder="/cart/add/123" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2 p-4 bg-yellow-50/50 rounded-lg border border-yellow-100">
                                <Switch id="popular" name="popular" checked={currentPlan.popular} onCheckedChange={(checked) => setCurrentPlan(p => ({...p, popular: checked}))} />
                                <Label htmlFor="popular" className="cursor-pointer">Destacar como "Melhor Escolha" ou "Popular"?</Label>
                            </div>

                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSavePlan} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">
                            {isEditing ? 'Salvar Alterações' : 'Criar Plano'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ManagePlans;