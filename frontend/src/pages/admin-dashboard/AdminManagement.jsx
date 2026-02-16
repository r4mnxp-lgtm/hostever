import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, UserPlus, Edit2, Trash2, Save, X } from 'lucide-react';

const ADMIN_CATEGORIES = {
  admin: { 
    label: 'Diretores', 
    color: 'bg-purple-500',
    permissions: ['all']
  },
  manager: { 
    label: 'Gerentes', 
    color: 'bg-blue-500',
    permissions: ['view_dashboard', 'manage_services', 'manage_clients', 'view_billing', 'manage_tickets', 'view_status']
  },
  technical: { 
    label: 'Técnicos', 
    color: 'bg-green-500',
    permissions: ['view_dashboard', 'manage_services', 'manage_tickets', 'view_status']
  },
  cs: { 
    label: 'CS (Atendimento)', 
    color: 'bg-orange-500',
    permissions: ['view_dashboard', 'manage_tickets', 'view_clients']
  }
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    category: 'cs'
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const response = await fetch('/api/admin/users/admins', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/users/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newAdmin,
          permissions: ADMIN_CATEGORIES[newAdmin.category].permissions
        })
      });

      if (response.ok) {
        alert('Administrador criado com sucesso!');
        setNewAdmin({ name: '', email: '', password: '', category: 'cs' });
        loadAdmins();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar administrador');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (adminId, newCategory) => {
    try {
      const response = await fetch(`/api/admin/users/${adminId}/category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          category: newCategory,
          permissions: ADMIN_CATEGORIES[newCategory].permissions
        })
      });

      if (response.ok) {
        loadAdmins();
        setEditingAdmin(null);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Tem certeza que deseja remover este administrador?')) return;

    try {
      const response = await fetch(`/api/admin/users/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        loadAdmins();
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Gerenciamento de Administradores</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <UserPlus className="w-5 h-5" />
            Criar Novo Administrador
          </CardTitle>
          <CardDescription>
            Adicione um novo membro à equipe administrativa com permissões específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nome</label>
              <Input
                placeholder="Nome completo"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail</label>
              <Input
                type="email"
                placeholder="email@hostever.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Senha</label>
              <Input
                type="password"
                placeholder="Senha forte"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Categoria</label>
              <select
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                value={newAdmin.category}
                onChange={(e) => setNewAdmin({...newAdmin, category: e.target.value})}
              >
                {Object.entries(ADMIN_CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Permissões da categoria selecionada:</p>
            <div className="flex flex-wrap gap-2">
              {ADMIN_CATEGORIES[newAdmin.category].permissions.map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs">
                  {perm === 'all' ? 'Todas as permissões' : perm.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreateAdmin}
            disabled={loading}
            className="bg-[#FFA500] hover:bg-[#FF8C00]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {loading ? 'Criando...' : 'Criar Administrador'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <Users className="w-5 h-5" />
            Administradores Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#FFB833] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                      {editingAdmin === admin.id ? (
                        <select
                          className="text-sm px-2 py-1 border border-gray-300 rounded"
                          defaultValue={admin.admin_category || 'cs'}
                          onChange={(e) => handleUpdateCategory(admin.id, e.target.value)}
                        >
                          {Object.entries(ADMIN_CATEGORIES).map(([key, cat]) => (
                            <option key={key} value={key}>{cat.label}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge className={`${ADMIN_CATEGORIES[admin.admin_category || 'cs'].color} text-white`}>
                          {ADMIN_CATEGORIES[admin.admin_category || 'cs'].label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    {admin.admin_category && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ADMIN_CATEGORIES[admin.admin_category].permissions.slice(0, 3).map((perm) => (
                          <span key={perm} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {perm === 'all' ? 'Todas' : perm.split('_')[1]}
                          </span>
                        ))}
                        {ADMIN_CATEGORIES[admin.admin_category].permissions.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{ADMIN_CATEGORIES[admin.admin_category].permissions.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingAdmin === admin.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAdmin(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAdmin(admin.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhum administrador cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
