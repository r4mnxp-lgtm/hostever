import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Server, Activity, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'operational', label: 'Operacional', color: 'bg-green-500' },
  { value: 'degraded', label: 'Degradado', color: 'bg-yellow-500' },
  { value: 'outage', label: 'Fora do Ar', color: 'bg-red-500' },
  { value: 'maintenance', label: 'Manutenção', color: 'bg-blue-500' }
];

const CATEGORIES = [
  'Website',
  'Platform',
  'API',
  'Infrastructure',
  'Network',
  'Database'
];

const StatusServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    category: 'Infrastructure',
    status: 'operational',
    description: '',
    url: '',
    location: 'São Paulo, BR'
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/status/services', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleCreateService = async () => {
    if (!newService.name || !newService.category) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/status/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newService)
      });

      if (response.ok) {
        alert('Serviço adicionado com sucesso!');
        setNewService({
          name: '',
          category: 'Infrastructure',
          status: 'operational',
          description: '',
          url: '',
          location: 'São Paulo, BR'
        });
        loadServices();
      } else {
        alert('Erro ao adicionar serviço');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (serviceId, newStatus) => {
    try {
      const response = await fetch(`/api/status/services/${serviceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadServices();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Tem certeza que deseja remover este serviço?')) return;

    try {
      const response = await fetch(`/api/status/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        loadServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'outage': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'maintenance': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Gerenciamento de Status</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <Plus className="w-5 h-5" />
            Adicionar Novo Serviço
          </CardTitle>
          <CardDescription>
            Configure os serviços que aparecerão na página de status pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nome do Serviço</label>
              <Input
                placeholder="Ex: API de Provisionamento"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Categoria</label>
              <select
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status Inicial</label>
              <select
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                value={newService.status}
                onChange={(e) => setNewService({...newService, status: e.target.value})}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Localização</label>
              <Input
                placeholder="São Paulo, BR"
                value={newService.location}
                onChange={(e) => setNewService({...newService, location: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Descrição (opcional)</label>
            <Input
              placeholder="Descrição do serviço"
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">URL (opcional)</label>
            <Input
              placeholder="https://..."
              value={newService.url}
              onChange={(e) => setNewService({...newService, url: e.target.value})}
            />
          </div>

          <Button
            onClick={handleCreateService}
            disabled={loading}
            className="bg-[#FFA500] hover:bg-[#FF8C00]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Adicionando...' : 'Adicionar Serviço'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <Server className="w-5 h-5" />
            Serviços Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#FFB833] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(service.status)}
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{service.location}</span>
                      {service.url && (
                        <>
                          <span>•</span>
                          <a href={service.url} target="_blank" rel="noopener noreferrer" className="text-[#FFA500] hover:underline">
                            {service.url}
                          </a>
                        </>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      className="text-sm px-2 py-1 border border-gray-300 rounded"
                      value={service.status}
                      onChange={(e) => handleUpdateStatus(service.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhum serviço cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusServicesManagement;
