import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTeamData } from '@/hooks/useTeamData';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ManageTeam = () => {
    const { team, saveTeamMember, deleteTeamMember } = useTeamData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenModal = (member = null) => {
        if (member) {
            setCurrentMember(member);
            setIsEditing(true);
        } else {
            setCurrentMember({ id: uuidv4(), name: '', role: '', description: '', imageUrl: '' });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const handleSaveMember = () => {
        if (!currentMember.name || !currentMember.role) {
            showToast({
                title: "Campos obrigatórios",
                description: "Nome e cargo são obrigatórios.",
                variant: "destructive",
            });
            return;
        }
        saveTeamMember(currentMember);
        setModalOpen(false);
        showToast({
            title: isEditing ? "Membro Atualizado!" : "Membro Adicionado!",
            description: "As informações da equipe foram salvas com sucesso.",
        });
    };

    const handleDeleteMember = (memberId) => {
        deleteTeamMember(memberId);
        showToast({
            title: "Membro Excluído!",
            description: "O membro da equipe foi removido com sucesso.",
            variant: "destructive",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentMember(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Equipe - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Equipe</h1>
                <p className="text-gray-600">Adicione, edite ou remova os membros da equipe.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Membros da Equipe</h2>
                    <Button onClick={() => handleOpenModal()} className="hero-gradient text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Membro
                    </Button>
                </div>
                 <div className="space-y-4">
                    {team.length > 0 ? team.map((member) => (
                        <div key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {member.imageUrl ? (
                                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
                                    <p className="text-sm text-orange-600 font-medium">{member.role}</p>
                                    <p className="text-sm text-gray-600 mt-1">{member.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(member)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteMember(member.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-6">Nenhum membro da equipe cadastrado.</p>
                    )}
                </div>
            </motion.div>
            
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
                        <DialogDescription>
                           Preencha as informações do membro da equipe.
                        </DialogDescription>
                    </DialogHeader>
                    {currentMember && (
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                             <div>
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" value={currentMember.name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="role">Cargo</Label>
                                <Input id="role" name="role" value={currentMember.role} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea id="description" name="description" value={currentMember.description} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="imageUrl">URL da Imagem</Label>
                                <Input id="imageUrl" name="imageUrl" value={currentMember.imageUrl} onChange={handleInputChange} placeholder="https://exemplo.com/imagem.png" />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSaveMember} className="hero-gradient text-white">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Membro'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ManageTeam;