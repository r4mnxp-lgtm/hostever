import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAdminData } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Trash2, Edit, Shield, Mail, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const ManageUsers = () => {
    const { adminUsers, roles, saveAdminUser, deleteAdminUser } = useAdminData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setIsEditing(true);
        } else {
            setCurrentUser({ id: uuidv4(), name: '', email: '', role: 'editor', password: '' });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const handleSave = () => {
        saveAdminUser(currentUser);
        setModalOpen(false);
        showToast({ title: isEditing ? "Usuário Atualizado" : "Usuário Criado", description: "As credenciais foram salvas." });
    };

    const handleDelete = (id) => {
        deleteAdminUser(id);
        showToast({ title: "Usuário Excluído", variant: "destructive" });
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Usuários - HostEver Admin</title>
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipe Administrativa</h1>
                        <p className="text-gray-600">Gerencie quem tem acesso ao painel e seus níveis de permissão.</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">
                        <UserPlus className="mr-2 h-4 w-4" /> Adicionar Admin
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700">Nome</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">Email</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">Cargo</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {adminUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#84cc16] to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                {roles.find(r => r.id === user.role)?.name || user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                                                <Edit className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            {user.id !== 'admin-main' && user.id !== 'admin-test' && (
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Administrador'}</DialogTitle>
                    </DialogHeader>
                    {currentUser && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" value={currentUser.name} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>E-mail Corporativo</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" type="email" value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Permissão</Label>
                                <Select value={currentUser.role} onValueChange={(val) => setCurrentUser({...currentUser, role: val})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{isEditing ? 'Nova Senha (opcional)' : 'Senha Inicial'}</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input className="pl-10" type="password" value={currentUser.password || ''} onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
                        <Button onClick={handleSave} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">Salvar Acesso</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ManageUsers;