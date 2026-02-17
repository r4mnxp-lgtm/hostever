import { useState, useEffect } from 'react';
import { Server, Activity, HardDrive, Cpu, RefreshCw, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Services() {
  const { api } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchServices();
  }, [page]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/services?page=${page}&limit=10`);
      setServices(response.data.services || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
      console.error(error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FFA500]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Serviços</h1>
        <p className="mt-2 text-gray-600">Gerencie seus serviços VPS</p>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
          <p className="text-gray-600">Você ainda não possui nenhum serviço VPS.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-[#FFA500]/10 p-3 rounded-lg">
                      <Server className="w-6 h-6 text-[#FFA500]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name || `VPS #${service.id}`}</h3>
                      <p className="text-sm text-gray-600">{service.plan_name || 'Plano Personalizado'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-sm">
                    <Cpu className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">CPU:</span>
                    <span className="ml-1 font-medium text-gray-900">{service.cpu || 'N/A'} vCPU</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Activity className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">RAM:</span>
                    <span className="ml-1 font-medium text-gray-900">{service.ram || 'N/A'} GB</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <HardDrive className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Disco:</span>
                    <span className="ml-1 font-medium text-gray-900">{service.storage || 'N/A'} GB</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <ExternalLink className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">IP:</span>
                    <span className="ml-1 font-medium text-gray-900">{service.ip_address || 'Pendente'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span>Próximo vencimento: </span>
                    <span className="font-medium text-gray-900">
                      {service.next_due_date ? new Date(service.next_due_date).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast.success('Funcionalidade em desenvolvimento')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Renovar
                    </button>
                    <button
                      onClick={() => toast.success('Funcionalidade em desenvolvimento')}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#FFA500] rounded-md hover:bg-[#0d8bc7] transition-colors inline-flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Gerenciar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}
