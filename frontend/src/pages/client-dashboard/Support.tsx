import { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Plus, Send, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Support() {
  const { api } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'medium', message: '' });
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets');
      setTickets(response.data || []);
    } catch (error) {
      toast.error('Erro ao carregar tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      setSelectedTicket(response.data);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do ticket');
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', newTicket);
      toast.success('Ticket criado com sucesso!');
      setShowCreateModal(false);
      setNewTicket({ subject: '', priority: 'medium', message: '' });
      loadTickets();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao criar ticket');
    }
  };

  const replyToTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await api.post(`/tickets/${selectedTicket.id}/reply`, { message: replyMessage });
      toast.success('Resposta enviada com sucesso!');
      setReplyMessage('');
      fetchTicketDetails(selectedTicket.id);
    } catch (error) {
      toast.error('Erro ao enviar resposta');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FFA500]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suporte</h1>
          <p className="mt-2 text-gray-600">Gerencie seus tickets de suporte</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FFA500] hover:bg-[#0d8bc7] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
          <p className="text-gray-600">Você ainda não criou nenhum ticket de suporte.</p>
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
                        className="text-[#FFA500] hover:text-[#0d8bc7]"
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Criar Novo Ticket</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={createTicket}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                      placeholder="Descreva brevemente o problema"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                    <textarea
                      required
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                      placeholder="Descreva detalhadamente o problema"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#FFA500] text-white rounded-md hover:bg-[#0d8bc7] transition-colors"
                  >
                    Criar Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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

      {selectedTicket && (
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
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {selectedTicket.replies && selectedTicket.replies.map((reply) => (
                  <div key={reply.id} className={`border-l-4 pl-4 py-2 ${reply.is_staff ? 'border-green-500' : 'border-gray-300'}`}>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span className="font-medium">{reply.is_staff ? 'Suporte' : reply.user_name || 'Você'}</span>
                      <span>{new Date(reply.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="text-gray-900 whitespace-pre-wrap">{reply.message}</div>
                  </div>
                ))}
                
                {(!selectedTicket.replies || selectedTicket.replies.length === 0) && (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma mensagem ainda
                  </div>
                )}
              </div>

              {selectedTicket.status !== 'closed' && (
                <form onSubmit={replyToTicket} className="border-t pt-6">
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
                      onClick={() => setSelectedTicket(null)}
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
