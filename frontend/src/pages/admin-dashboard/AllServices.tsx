import { useState, useEffect } from 'react';
import { Server, RefreshCw, Search, Edit, Ban, CheckCircle, X, Cpu, Activity, HardDrive } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AllServices() {
  const { api } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    cpu: '',
    ram: '',
    storage: '',
    ip_address: '',
    status: 'active'
  });

  useEffect(() => {
    fetchServices();
  }, [page, searchTerm, statusFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      const response = await api.get(`/admin/services?${params}`);
      setServices(response.data.services || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setEditData({
      name: service.name || '',
      cpu: service.cpu || '',
      ram: service.ram || '',
      storage: service.storage || '',
      ip_address: service.ip_address || '',
      status: service.status
    });
    setShowEditModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/services/${selectedService.id}`, editData);
      toast.success('Serviço atualizado com sucesso!');
      setShowEditModal(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar serviço');
    }
  };

  const handleSuspendService = async (serviceId) => {
    if (!confirm('Tem certeza que deseja suspender este serviço?')) return;
    
    try {
      await api.put(`/admin/services/${serviceId}/suspend`);
      toast.success('Serviço suspenso com sucesso!');
      fetchServices();
    } catch (error) {
      toast.error('Erro ao suspender serviço');
    }
  };

  const handleActivateService = async (serviceId) => {
    try {
      await api.put(`/admin/services/${serviceId}/activate`);
      toast.success('Serviço ativado com sucesso!');
      fetchServices();
    } catch (error) {
      toast.error('Erro ao ativar serviço');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-red-100 text-red-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Ativo',
      suspended: 'Suspenso',
      terminated: 'Terminado',
      pending: 'Pendente'
    };
    return texts[status] || status;
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FFA500]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
        <p className="mt-2 text-gray-600">Visualize e gerencie todos os serviços VPS</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cliente ou IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#FFA500] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-[#FFA500] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'suspended'
                ? 'bg-[#FFA500] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Suspensos
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'pending'
                ? 'bg-[#FFA500] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pendentes
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
          <p className="text-gray-600">Não há serviços com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome/Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{service.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.client_name || `Cliente #${service.client_id}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {service.name || service.plan_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span><Cpu className="w-3 h-3 inline mr-1" />{service.cpu || 'N/A'} vCPU</span>
                        <span><Activity className="w-3 h-3 inline mr-1" />{service.ram || 'N/A'} GB RAM</span>
                        <span><HardDrive className="w-3 h-3 inline mr-1" />{service.storage || 'N/A'} GB</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.ip_address || 'Pendente'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {getStatusText(service.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-[#FFA500] hover:text-[#0d8bc7]"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {service.status === 'active' ? (
                          <button
                            onClick={() => handleSuspendService(service.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Suspender"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : service.status === 'suspended' ? (
                          <button
                            onClick={() => handleActivateService(service.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Ativar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Editar Serviço</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateService}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPU</label>
                      <input
                        type="number"
                        value={editData.cpu}
                        onChange={(e) => setEditData({ ...editData, cpu: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RAM (GB)</label>
                      <input
                        type="number"
                        value={editData.ram}
                        onChange={(e) => setEditData({ ...editData, ram: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SSD (GB)</label>
                      <input
                        type="number"
                        value={editData.storage}
                        onChange={(e) => setEditData({ ...editData, storage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
                    <input
                      type="text"
                      value={editData.ip_address}
                      onChange={(e) => setEditData({ ...editData, ip_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                      placeholder="xxx.xxx.xxx.xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                    >
                      <option value="active">Ativo</option>
                      <option value="suspended">Suspenso</option>
                      <option value="pending">Pendente</option>
                      <option value="terminated">Terminado</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#FFA500] text-white rounded-md hover:bg-[#0d8bc7] transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
