import { query } from '../config/database.js';

export async function getAllTickets(filters = {}) {
  let sql = `
    SELECT t.*, u.name as user_name, u.email as user_email, s.product_name,
           (SELECT COUNT(*) FROM ticket_replies WHERE ticket_id = t.id) as reply_count
    FROM tickets t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN services s ON t.service_id = s.id
    WHERE 1=1
  `;
  const params = [];
  
  if (filters.user_id) {
    sql += ' AND t.user_id = ?';
    params.push(filters.user_id);
  }
  
  if (filters.status) {
    sql += ' AND t.status = ?';
    params.push(filters.status);
  }
  
  if (filters.priority) {
    sql += ' AND t.priority = ?';
    params.push(filters.priority);
  }
  
  if (filters.department) {
    sql += ' AND t.department = ?';
    params.push(filters.department);
  }
  
  sql += ' ORDER BY t.updated_at DESC';
  
  return await query(sql, params);
}

export async function getTicketsByUser(userId) {
  const sql = `
    SELECT t.*, u.name as user_name, u.email as user_email, s.product_name,
           (SELECT COUNT(*) FROM ticket_replies WHERE ticket_id = t.id) as reply_count
    FROM tickets t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN services s ON t.service_id = s.id
    WHERE t.user_id = ?
    ORDER BY t.updated_at DESC
  `;
  return await query(sql, [userId]);
}

export async function getTicketById(id) {
  const ticketSql = `
    SELECT t.*, u.name as user_name, u.email as user_email, s.product_name
    FROM tickets t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN services s ON t.service_id = s.id
    WHERE t.id = ?
  `;
  const ticketResults = await query(ticketSql, [id]);
  
  if (ticketResults.length === 0) {
    return null;
  }
  
  const ticket = ticketResults[0];
  
  // Buscar replies
  const repliesSql = `
    SELECT r.*, u.name as user_name, u.email as user_email
    FROM ticket_replies r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.ticket_id = ?
    ORDER BY r.created_at ASC
  `;
  const replies = await query(repliesSql, [id]);
  
  return {
    ...ticket,
    replies
  };
}

export async function createTicket(ticketData) {
  const {
    user_id,
    service_id = null,
    subject,
    priority = 'medium',
    status = 'open'
  } = ticketData;
  
  const result = await query(
    `INSERT INTO tickets 
    (user_id, service_id, subject, priority, status, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [user_id, service_id, subject, priority, status]
  );
  
  return result.insertId;
}

export async function addTicketReply(replyData) {
  const {
    ticket_id,
    user_id,
    message,
    attachment = null,
    is_staff = false
  } = replyData;
  
  const result = await query(
    `INSERT INTO ticket_replies 
    (ticket_id, user_id, message, attachment, is_staff, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())`,
    [ticket_id, user_id, message, attachment, is_staff]
  );
  
  // Atualizar timestamp do ticket
  await query(
    'UPDATE tickets SET updated_at = NOW() WHERE id = ?',
    [ticket_id]
  );
  
  return result.insertId;
}

export async function updateTicket(id, ticketData) {
  const fields = [];
  const values = [];
  
  Object.keys(ticketData).forEach(key => {
    if (ticketData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(ticketData[key]);
    }
  });
  
  if (fields.length === 0) {
    return;
  }
  
  values.push(id);
  
  await query(
    `UPDATE tickets SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );
}

export async function updateTicketStatus(id, status) {
  await query(
    'UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, id]
  );
}

export async function closeTicket(id) {
  await query(
    "UPDATE tickets SET status = 'closed', closed_at = NOW(), updated_at = NOW() WHERE id = ?",
    [id]
  );
}

export async function deleteTicket(id) {
  // Deletar replies primeiro
  await query('DELETE FROM ticket_replies WHERE ticket_id = ?', [id]);
  // Deletar ticket
  await query('DELETE FROM tickets WHERE id = ?', [id]);
}
