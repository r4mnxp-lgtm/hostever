import { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Search, Send, X, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Tickets() {
  const { api } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [page, searchTerm, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter })
      });
      const response = await api.get(`/admin/tickets?${params}`);
      setTickets(response.data.tickets || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Erro ao carregar tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await api.get(`/admin/tickets/${ticketId}`);
      setSelectedTicket(response.data);
      setShowViewModal(true);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do ticket');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await api.post(`/admin/tickets/${selectedTicket.id}/reply`, { message: replyMessage });
      toast.success('Resposta enviada com sucesso!');
      setReplyMessage('');
      fetchTicketDetails(selectedTicket.id);
    } catch (error) {
      toast.error('Erro ao enviar resposta');
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await api.put(`/admin/tickets/${ticketId}/status`, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      if (selectedTicket?.id === ticketId) {
        fetchTicketDetails(ticketId);
      }
      fetchTickets();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-gray-100 text-gray-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      open: 'Aberto',
      in_progress: 'Em Progresso',
      closed: 'Fechado',
      resolved: 'Resolvido'
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getPriorityText = (priority) => {
    const texts = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return texts[priority] || priority;
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FFA500]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Tickets</h1>
        <p className="mt-2 text-gray-600">Visualize e responda tickets de suporte</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por assunto ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          >
            <option value="all">Todos os Status</option>
            <option value="open">Aberto</option>
            <option value="in_progress">Em Progresso</option>
            <option value="resolved">Resolvido</option>
            <option value="closed">Fechado</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
          <p className="text-gray-600">Não há tickets com os filtros selecionados.</p>
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
                    Assunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.client_name || `Cliente #${ticket.client_id}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityText(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => fetchTicketDetails(ticket.id)}
                        className="text-[#FFA500] hover:text-[#0d8bc7] inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </button>
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

      {showViewModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTicket.subject}</h2>
                  <div className="flex gap-3 text-sm">
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusText(selectedTicket.status)}
                    </span>
                    <span className={`font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      Prioridade: {getPriorityText(selectedTicket.priority)}
                    </span>
                    <span className="text-gray-600">
                      Cliente: {selectedTicket.client_name || `#${selectedTicket.client_id}`}
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alterar Status:</label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                >
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="resolved">Resolvido</option>
                  <option value="closed">Fechado</option>
                </select>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-[#FFA500] pl-4 py-2 bg-gray-50">
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">{selectedTicket.client_name}</span> - {new Date(selectedTicket.created_at).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-gray-900 whitespace-pre-wrap">{selectedTicket.message}</div>
                </div>

                {selectedTicket.replies && selectedTicket.replies.map((reply) => (
                  <div key={reply.id} className={`border-l-4 pl-4 py-2 ${reply.is_admin ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span className="font-medium">{reply.is_admin ? 'Você (Suporte)' : selectedTicket.client_name}</span>
                      <span>{new Date(reply.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="text-gray-900 whitespace-pre-wrap">{reply.message}</div>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleReply} className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar Resposta</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                    placeholder="Digite sua resposta..."
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={!replyMessage.trim()}
                      className="inline-flex items-center px-4 py-2 bg-[#FFA500] text-white rounded-md hover:bg-[#0d8bc7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowViewModal(false)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
