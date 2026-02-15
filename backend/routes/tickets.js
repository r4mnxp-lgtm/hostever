import express from 'express';
import { verifyToken } from './auth.js';
import { 
  getAllTickets, 
  getTicketById, 
  createTicket, 
  updateTicket, 
  closeTicket,
  getTicketsByUser,
  addTicketReply,
  updateTicketStatus
} from '../models/ticketModel.js';
import { createActivityLog } from '../models/activityLogModel.js';

const router = express.Router();

// GET /api/tickets (listar tickets)
router.get('/', verifyToken, async (req, res) => {
  try {
    const tickets = req.userRole === 'admin' 
      ? await getAllTickets()
      : await getTicketsByUser(req.userId);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET /api/tickets/:id (detalhes do ticket)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Verificar acesso
    if (req.userRole !== 'admin' && ticket.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// POST /api/tickets (criar ticket - SEM UPLOAD POR ENQUANTO)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { subject, message, priority, service_id } = req.body;
    
    console.log('Creating ticket:', { userId: req.userId, subject, priority });
    
    const ticketId = await createTicket({
      user_id: req.userId,
      service_id: service_id || null,
      subject,
      priority: priority || 'medium',
      status: 'open'
    });
    
    console.log('Ticket created with ID:', ticketId);
    
    // Adicionar primeira mensagem
    if (message) {
      await addTicketReply({
        ticket_id: ticketId,
        user_id: req.userId,
        message,
        attachment: null,
        is_staff: false
      });
      console.log('Initial message added');
    }
    
    await createActivityLog({
      user_id: req.userId,
      action: 'ticket_created',
      entity_type: 'ticket',
      entity_id: ticketId,
      description: `Ticket criado: ${subject}`,
      ip_address: req.ip || null,
    });
    
    res.json({ success: true, ticketId });
  } catch (error) {
    console.error('Error creating ticket:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to create ticket', details: error.message });
  }
});

// POST /api/tickets/:id/reply (adicionar resposta - SEM UPLOAD POR ENQUANTO)
router.post('/:id/reply', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Verificar acesso
    if (req.userRole !== 'admin' && ticket.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await addTicketReply({
      ticket_id: req.params.id,
      user_id: req.userId,
      message,
      attachment: null,
      is_staff: req.userRole === 'admin'
    });
    
    await createActivityLog({
      user_id: req.userId,
      action: 'ticket_reply_added',
      entity_type: 'ticket',
      entity_id: req.params.id,
      description: `Resposta adicionada ao ticket #${req.params.id}`,
      ip_address: req.ip || null,
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// PUT /api/tickets/:id/status (atualizar status)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Apenas admin ou dono pode fechar ticket
    if (req.userRole !== 'admin' && ticket.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (status === 'closed') {
      await closeTicket(req.params.id);
    } else {
      await updateTicketStatus(req.params.id, status);
    }
    
    await createActivityLog({
      user_id: req.userId,
      action: 'ticket_status_changed',
      entity_type: 'ticket',
      entity_id: req.params.id,
      description: `Status do ticket #${req.params.id} alterado para: ${status}`,
      ip_address: req.ip || null,
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// PUT /api/tickets/:id (atualizar ticket - admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    await updateTicket(req.params.id, req.body);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

export default router;
