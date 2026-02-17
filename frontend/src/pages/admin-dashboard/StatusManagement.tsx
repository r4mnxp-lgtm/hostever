import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

const StatusManagement = () => {
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'info',
    affected_services: [],
    status: 'investigating',
    started_at: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = localStorage.getItem('token');
      
      const [servicesRes, incidentsRes] = await Promise.all([
        fetch('http://localhost:3001/api/status/current'),
        fetch('http://localhost:3001/api/status/incidents')
      ]);
      
      const servicesData = await servicesRes.json();
      const incidentsData = await incidentsRes.json();
      
      setServices(servicesData.services || []);
      setIncidents(incidentsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleServiceStatusChange(serviceId, newStatus) {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`http://localhost:3001/api/status/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  }

  async function handleSubmitIncident(e) {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingIncident 
        ? `http://localhost:3001/api/status/incidents/${editingIncident.id}`
        : 'http://localhost:3001/api/status/incidents';
      
      const method = editingIncident ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        setEditingIncident(null);
        resetForm();
        loadData();
      }
    } catch (error) {
      console.error('Erro ao salvar incidente:', error);
    }
  }

  async function handleDeleteIncident(id) {
    if (!confirm('Deseja realmente deletar este incidente?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`http://localhost:3001/api/status/incidents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Erro ao deletar incidente:', error);
    }
  }

  function openEditModal(incident) {
    setEditingIncident(incident);
    setFormData({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      affected_services: JSON.parse(incident.affected_services || '[]'),
      status: incident.status,
      started_at: new Date(incident.started_at).toISOString().slice(0, 16)
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      severity: 'info',
      affected_services: [],
      status: 'investigating',
      started_at: new Date().toISOString().slice(0, 16)
    });
  }

  const severityColors = {
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700'
  };

  const statusColors = {
    investigating: 'bg-yellow-100 text-yellow-700',
    identified: 'bg-blue-100 text-blue-700',
    monitoring: 'bg-purple-100 text-purple-700',
    resolved: 'bg-green-100 text-green-700'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 animate-spin text-hostever-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hostever-primary">Gerenciamento de Status</h1>
          <p className="text-gray-500 mt-1">Gerencie incidentes e status dos serviços</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingIncident(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-hostever-secondary text-white px-4 py-2 rounded-lg hover:bg-hostever-secondary/90 transition"
        >
          <Plus className="w-4 h-4" />
          Novo Incidente
        </button>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Status dos Serviços</h2>
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{service.name}</span>
              <select
                value={service.status}
                onChange={(e) => handleServiceStatusChange(service.id, e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="operational">Operacional</option>
                <option value="degraded">Degradado</option>
                <option value="partial_outage">Interrupção Parcial</option>
                <option value="major_outage">Fora do Ar</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Incidentes</h2>
        <div className="space-y-3">
          {incidents.map(incident => (
            <div key={incident.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-hostever-primary">{incident.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{incident.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(incident)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteIncident(incident.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${severityColors[incident.severity]}`}>
                  {incident.severity === 'info' ? 'Info' : incident.severity === 'warning' ? 'Aviso' : 'Crítico'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[incident.status]}`}>
                  {incident.status === 'investigating' ? 'Investigando' :
                   incident.status === 'identified' ? 'Identificado' :
                   incident.status === 'monitoring' ? 'Monitorando' : 'Resolvido'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(incident.started_at).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhum incidente registrado</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingIncident ? 'Editar Incidente' : 'Novo Incidente'}
            </h2>
            
            <form onSubmit={handleSubmitIncident} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Severidade</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Aviso</option>
                    <option value="critical">Crítico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="investigating">Investigando</option>
                    <option value="identified">Identificado</option>
                    <option value="monitoring">Monitorando</option>
                    <option value="resolved">Resolvido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data/Hora de Início</label>
                <input
                  type="datetime-local"
                  value={formData.started_at}
                  onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Serviços Afetados</label>
                <div className="space-y-2">
                  {services.map(service => (
                    <label key={service.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.affected_services.includes(service.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.affected_services, service.id]
                            : formData.affected_services.filter(id => id !== service.id);
                          setFormData({ ...formData, affected_services: updated });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-hostever-secondary text-white py-2 rounded-lg hover:bg-hostever-secondary/90"
                >
                  {editingIncident ? 'Atualizar' : 'Criar'} Incidente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingIncident(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StatusManagement;
