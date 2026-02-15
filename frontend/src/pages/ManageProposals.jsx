import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

// ItemRow component extracted to prevent re-render focus loss issues
const ItemRow = ({ section, item, index, onUpdate, onRemove }) => {
    const fieldOrder = ['code', 'desc', 'qty', 'unit', 'total'];
    
    // Determine which fields to show based on the item's keys, maintaining the specific order
    const visibleFields = fieldOrder.filter(key => Object.prototype.hasOwnProperty.call(item, key) && key !== 'id');

    const fieldConfig = {
        code: { type: 'text', col: 'md:col-span-2', placeholder: 'Código' },
        desc: { type: 'textarea', col: 'md:col-span-4', placeholder: 'Produto / Descrição' },
        qty: { type: 'number', col: 'md:col-span-1', placeholder: 'Qtd' },
        unit: { type: 'text', col: 'md:col-span-2', placeholder: 'Valor Unit.' },
        total: { type: 'text', col: 'md:col-span-2', readOnly: true, placeholder: 'Total' },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center mb-2 bg-gray-50/50 p-2 rounded-md border border-gray-100">
            {visibleFields.map(key => (
                <div key={key} className={fieldConfig[key]?.col || 'md:col-span-2'}>
                    {fieldConfig[key]?.type === 'textarea' ? (
                       <Textarea 
                            placeholder={fieldConfig[key].placeholder}
                            value={item[key]}
                            onChange={e => onUpdate(section, index, key, e.target.value)}
                            rows={1}
                            className="min-h-[40px] resize-y"
                        />
                    ) : (
                        <Input 
                            placeholder={fieldConfig[key].placeholder}
                            value={item[key]}
                            type={fieldConfig[key]?.type || 'text'}
                            onChange={e => onUpdate(section, index, key, e.target.value)}
                            readOnly={fieldConfig[key]?.readOnly}
                            className={fieldConfig[key]?.readOnly ? 'bg-gray-100 text-gray-500 font-semibold' : ''}
                        />
                    )}
                </div>
            ))}
            <div className="md:col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => onRemove(section, index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

const ManageProposals = () => {
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
  const [proposals, setProposals] = useState([]);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  
  useEffect(() => {
    const savedProposals = localStorage.getItem('avyra-proposals');
    if (savedProposals) {
      try {
        const parsedProposals = JSON.parse(savedProposals);
        if (Array.isArray(parsedProposals)) {
          setProposals(parsedProposals);
        }
      } catch (error) {
        console.error("Failed to parse proposals from localStorage", error);
        setProposals([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('avyra-proposals', JSON.stringify(proposals));
  }, [proposals]);

  const defaultProposal = {
    client: { name: '', cnpj: '', responsible: '', email: '' },
    solutionItems: [{ id: Date.now(), code: '', desc: '', qty: '' }],
    commercialItems: [{ id: Date.now() + 1, code: '', desc: '', qty: '', unit: '', total: '' }],
    activationFee: { unit: '500,00' },
    validityDays: '15',
    publicLinkId: '',
    isPublic: false
  };

  const handleCreateProposal = () => {
    const newProposal = {
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
      publicLinkId: uuidv4(),
      ...JSON.parse(JSON.stringify(defaultProposal))
    };
    setProposals(prev => [newProposal, ...prev]);
    setSelectedProposalId(newProposal.id);
  };
  
  const formatCnpj = (value) => {
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length > 14) {
      return cnpj.slice(0, 14);
    }
    return cnpj
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handleUpdateField = useCallback((section, index, field, value) => {
    let processedValue = value;
    if (field === 'cnpj') {
        processedValue = formatCnpj(value);
    }

    setProposals(prevProposals => {
      return prevProposals.map(p => {
        if (p.id === selectedProposalId) {
          const updatedProposal = { ...p };
          
          if (section === 'root') {
             updatedProposal[field] = processedValue;
          } else if (section === 'client') {
             updatedProposal.client = { ...updatedProposal.client, [field]: processedValue };
          } else if (section === 'activationFee') {
             updatedProposal.activationFee = { ...updatedProposal.activationFee, [field]: processedValue };
          } else if (index !== null) {
            // Handle array items (solutionItems, commercialItems)
            const newItems = [...updatedProposal[section]];
            newItems[index] = { ...newItems[index], [field]: processedValue };
            
            // Auto-calculate total if unit and qty change in commercial items
            if (section === 'commercialItems' && (field === 'qty' || field === 'unit')) {
               const currentQty = newItems[index].qty;
               const currentUnit = newItems[index].unit;

               const qty = parseFloat(currentQty) || 0;
               // Handle different currency formats: 1.000,00 or 1000.00
               let unitClean = currentUnit ? currentUnit.toString().replace('R$', '').trim() : '0';
               // If format is 1.000,00 -> remove dots, replace comma with dot
               if (unitClean.includes(',') && unitClean.includes('.')) {
                  unitClean = unitClean.replace(/\./g, '').replace(',', '.');
               } else if (unitClean.includes(',')) {
                  unitClean = unitClean.replace(',', '.');
               }
               
               const unit = parseFloat(unitClean) || 0;
               const total = (qty * unit).toFixed(2).replace('.', ',');
               newItems[index].total = total;
            }

            updatedProposal[section] = newItems;
          }
          return updatedProposal;
        }
        return p;
      });
    });
  }, [selectedProposalId]);

  const handleAddItem = (section) => {
    setProposals(prevProposals => {
      return prevProposals.map(p => {
        if (p.id === selectedProposalId) {
          const updatedProposal = { ...p };
          const newItem = { id: Date.now() };
          
          // Get keys from default structure to ensure consistency
          let templateKeys = [];
          if (section === 'solutionItems') templateKeys = ['code', 'desc', 'qty'];
          if (section === 'commercialItems') templateKeys = ['code', 'desc', 'qty', 'unit', 'total'];
          
          templateKeys.forEach(key => newItem[key] = '');
          
          updatedProposal[section] = [...(updatedProposal[section] || []), newItem];
          return updatedProposal;
        }
        return p;
      });
    });
  };

  const handleRemoveItem = (section, index) => {
    setProposals(prevProposals => {
      return prevProposals.map(p => {
        if (p.id === selectedProposalId) {
          const updatedProposal = { ...p };
          updatedProposal[section] = updatedProposal[section].filter((_, i) => i !== index);
          return updatedProposal;
        }
        return p;
      });
    });
  };

  const togglePublicLink = (checked) => {
      setProposals(prev => prev.map(p => p.id === selectedProposalId ? { ...p, isPublic: checked } : p));
  };
  
  const handleSaveProposal = () => {
     showToast({
        title: "Proposta Salva!",
        description: "Suas alterações foram salvas automaticamente.",
     });
  };

  const copyLink = (linkId) => {
      const url = `${window.location.origin}/proposal/${linkId}`;
      navigator.clipboard.writeText(url);
      showToast({ title: "Link copiado!", description: "O link da proposta está na sua área de transferência." });
  };

  const openLink = (linkId) => {
      const url = `${window.location.origin}/proposal/${linkId}`;
      window.open(url, '_blank');
  };

  const selectedProposalData = proposals.find(p => p.id === selectedProposalId);

  return (
    <>
      <Helmet>
        <title>Gerador de Propostas - Avyra Data Centers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
        >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Propostas</h2>
                    <Button size="sm" onClick={handleCreateProposal} className="hero-gradient text-white">
                        <Plus className="mr-2 h-4 w-4"/> Nova
                    </Button>
                </div>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                    {proposals.length > 0 ? proposals.map(p => (
                        <div key={p.id} onClick={() => setSelectedProposalId(p.id)} className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedProposalId === p.id ? 'bg-[#84cc16]/10 border-[#84cc16] shadow-sm' : 'bg-gray-50 hover:bg-gray-100 border-transparent'} border`}>
                            <p className="font-semibold text-gray-900 truncate">{p.client.name || 'Nova Proposta'}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">{p.createdAt}</p>
                                {p.isPublic && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Link Ativo</span>}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Nenhuma proposta criada.
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
        >
            {selectedProposalData ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Editando Proposta</h2>
                        
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                             <Label htmlFor="public-mode" className="text-sm font-medium text-gray-600 cursor-pointer">Link Público</Label>
                             <Switch 
                                id="public-mode" 
                                checked={selectedProposalData.isPublic}
                                onCheckedChange={togglePublicLink}
                             />
                        </div>
                    </div>

                     {selectedProposalData.isPublic && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <LinkIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Esta proposta está acessível publicamente</span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button size="sm" variant="outline" className="h-9 text-xs bg-white flex-1 sm:flex-none" onClick={() => copyLink(selectedProposalData.publicLinkId || selectedProposalData.id)}>Copiar Link</Button>
                                <Button size="sm" variant="outline" className="h-9 text-xs bg-white w-9 p-0" onClick={() => openLink(selectedProposalData.publicLinkId || selectedProposalData.id)}><ExternalLink className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">1</span>
                                Dados do Cliente
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Nome do Cliente" value={selectedProposalData.client.name} onChange={e => handleUpdateField('client', null, 'name', e.target.value)} />
                                <Input placeholder="CNPJ" value={selectedProposalData.client.cnpj} onChange={e => handleUpdateField('client', null, 'cnpj', e.target.value)} maxLength="18" />
                                <Input placeholder="Responsável" value={selectedProposalData.client.responsible} onChange={e => handleUpdateField('client', null, 'responsible', e.target.value)} />
                                <Input type="email" placeholder="E-mail" value={selectedProposalData.client.email} onChange={e => handleUpdateField('client', null, 'email', e.target.value)} />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="validity" className="text-sm font-medium text-gray-600 mb-1 block">Validade da Proposta (Dias)</Label>
                                    <Input id="validity" type="number" placeholder="15" value={selectedProposalData.validityDays || '15'} onChange={e => handleUpdateField('root', null, 'validityDays', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">2</span>
                                Itens da Solução (Escopo)
                            </h3>
                            <div className="bg-gray-100/50 p-1 rounded-md mb-2 hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-2 text-center">
                                <span className="col-span-2">Código</span>
                                <span className="col-span-4 text-left">Descrição</span>
                                <span className="col-span-1">Qtd</span>
                            </div>
                            {selectedProposalData.solutionItems && selectedProposalData.solutionItems.map((item, index) => (
                                <ItemRow key={item.id} section="solutionItems" item={item} index={index} onUpdate={handleUpdateField} onRemove={handleRemoveItem} />
                            ))}
                            <Button variant="outline" size="sm" onClick={() => handleAddItem('solutionItems')} className="w-full border-dashed border-gray-300 hover:border-[#84cc16] hover:text-[#84cc16]">
                                <Plus className="mr-2 h-4 w-4" /> Adicionar Item de Escopo
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">3</span>
                                Condições Comerciais
                            </h3>
                             <div className="bg-gray-100/50 p-1 rounded-md mb-2 hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-2 text-center">
                                <span className="col-span-2">Cód</span>
                                <span className="col-span-4 text-left">Produto</span>
                                <span className="col-span-1">Qtd</span>
                                <span className="col-span-2">Unitário (R$)</span>
                                <span className="col-span-2">Total (R$)</span>
                            </div>
                            {selectedProposalData.commercialItems && selectedProposalData.commercialItems.map((item, index) => (
                                <ItemRow key={item.id} section="commercialItems" item={item} index={index} onUpdate={handleUpdateField} onRemove={handleRemoveItem} />
                            ))}
                            <Button variant="outline" size="sm" onClick={() => handleAddItem('commercialItems')} className="w-full border-dashed border-gray-300 hover:border-[#84cc16] hover:text-[#84cc16]">
                                <Plus className="mr-2 h-4 w-4" /> Adicionar Item Comercial
                            </Button>
                        </div>

                        <div className="space-y-4">
                             <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">4</span>
                                Taxa de Ativação
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input type="text" placeholder="Valor (R$)" value={selectedProposalData.activationFee.unit} onChange={e => handleUpdateField('activationFee', null, 'unit', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                        <Button onClick={handleSaveProposal} className="bg-[#84cc16] hover:bg-[#65a30d] text-white font-bold px-8">Salvar Alterações</Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-lg p-10 h-full min-h-[500px]">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <LinkIcon className="w-12 h-12 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Gerenciador de Propostas</h2>
                    <p className="text-gray-500 max-w-sm mb-8">Selecione uma proposta na lista lateral para editar ou crie uma nova proposta para começar.</p>
                    <Button onClick={handleCreateProposal} size="lg" className="hero-gradient text-white shadow-lg shadow-[#84cc16]/20">
                        <Plus className="mr-2 h-5 w-5"/> Criar Nova Proposta
                    </Button>
                </div>
            )}
        </motion.div>
      </div>
    </>
  );
};

export default ManageProposals;