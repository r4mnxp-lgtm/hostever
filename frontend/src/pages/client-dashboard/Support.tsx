import { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Plus, Send, X, AlertCircle, Clock, CheckCircle2, Timer, XCircle } from 'lucide-react';
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

  const getStatusConfig = (status) => {
    const configs = {
      open: { 
        icon: Clock, 
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'Aberto'
      },
      in_progress: { 
        icon: Timer, 
        color: 'bg-amber-50 border-amber-200 text-amber-700',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        text: 'Em Progresso'
      },
      resolved: { 
        icon: CheckCircle2, 
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        text: 'Resolvido'
      },
      closed: { 
        icon: XCircle, 
        color: 'bg-gray-50 border-gray-200 text-gray-700',
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'Fechado'
      }
    };
    return configs[status] || configs.open;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { color: 'text-gray-600 bg-gray-50 border-gray-200', text: 'Baixa' },
      medium: { color: 'text-yellow-700 bg-yellow-50 border-yellow-200', text: 'Média' },
      high: { color: 'text-orange-700 bg-orange-50 border-orange-200', text: 'Alta' },
      urgent: { color: 'text-red-700 bg-red-50 border-red-200', text: 'Urgente' }
    };
    return configs[priority] || configs.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FFB833]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Suporte</h1>
            <p className="text-gray-600">Gerencie seus tickets e obtenha ajuda da nossa equipe</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#FFB833] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF8C00] shadow-lg shadow-orange-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Ticket
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum ticket encontrado</h3>
          <p className="text-gray-600 mb-6">Você ainda não criou nenhum ticket de suporte.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-[#FFB833] text-white rounded-xl hover:bg-[#FFA500] transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeiro Ticket
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);
            const priorityConfig = getPriorityConfig(ticket.priority);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={ticket.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl ${statusConfig.color.split(' ')[0]} flex items-center justify-center border ${statusConfig.color.split(' ')[1]}`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-mono text-gray-500">#{ticket.id}</span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.badge}`}>
                              {statusConfig.text}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priorityConfig.color}`}>
                              {priorityConfig.text}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FFB833] transition-colors">
                            {ticket.subject}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => fetchTicketDetails(ticket.id)}
                          className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-[#FFB833] to-[#FFA500] text-white text-sm font-semibold rounded-xl hover:from-[#FFA500] hover:to-[#FF8C00] transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Visualizar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Criar Novo Ticket</h2>
                  <p className="text-gray-600 mt-1">Descreva seu problema e nossa equipe irá ajudá-lo</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={createTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Assunto *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB833] focus:border-transparent transition-all"
                    placeholder="Ex: Problema com servidor, dúvida sobre faturamento..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Prioridade *</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB833] focus:border-transparent transition-all"
                  >
                    <option value="low">🟢 Baixa - Não urgente</option>
                    <option value="medium">🟡 Média - Normal</option>
                    <option value="high">🟠 Alta - Importante</option>
                    <option value="urgent">🔴 Urgente - Crítico</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Mensagem *</label>
                  <textarea
                    required
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB833] focus:border-transparent transition-all resize-none"
                    placeholder="Descreva detalhadamente o problema ou sua dúvida..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFB833] to-[#FFA500] text-white font-semibold rounded-xl hover:from-[#FFA500] hover:to-[#FF8C00] transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
                  >
                    Criar Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-mono text-gray-500">#{selectedTicket.id}</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusConfig(selectedTicket.status).badge}`}>
                      {getStatusConfig(selectedTicket.status).text}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityConfig(selectedTicket.priority).color}`}>
                      {getPriorityConfig(selectedTicket.priority).text}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {selectedTicket.replies && selectedTicket.replies.map((reply) => (
                  <div 
                    key={reply.id} 
                    className={`rounded-xl p-4 ${reply.is_staff ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-blue-500' : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-l-4 border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${reply.is_staff ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'}`}>
                        {reply.is_staff ? 'S' : 'V'}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          {reply.is_staff ? '👨‍💼 Equipe de Suporte' : '👤 ' + (reply.user_name || 'Você')}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          {new Date(reply.created_at).toLocaleString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-900 whitespace-pre-wrap pl-11">{reply.message}</div>
                  </div>
                ))}
                
                {(!selectedTicket.replies || selectedTicket.replies.length === 0) && (
                  <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium">Nenhuma mensagem ainda</p>
                    <p className="text-sm mt-1">Seja o primeiro a responder</p>
                  </div>
                )}
              </div>

              {selectedTicket.status !== 'closed' && (
                <form onSubmit={replyToTicket} className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Adicionar Resposta</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB833] focus:border-transparent transition-all resize-none"
                    placeholder="Digite sua resposta..."
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={!replyMessage.trim()}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFB833] to-[#FFA500] text-white font-semibold rounded-xl hover:from-[#FFA500] hover:to-[#FF8C00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              )}

              {selectedTicket.status === 'closed' && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-700">Este ticket está fechado e não aceita mais respostas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
