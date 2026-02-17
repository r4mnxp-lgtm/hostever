import { query } from '../config/database.js';

export async function getMessagesByTicketId(ticketId) {
  const sql = `
    SELECT tm.*, u.name as user_name, u.email as user_email
    FROM ticket_messages tm
    LEFT JOIN users u ON tm.user_id = u.id
    WHERE tm.ticket_id = ?
    ORDER BY tm.created_at ASC
  `;
  return await query(sql, [ticketId]);
}

export async function createTicketMessage(messageData) {
  const {
    ticket_id,
    user_id,
    message,
    is_admin = false,
  } = messageData;
  
  const result = await query(
    `INSERT INTO ticket_messages 
    (ticket_id, user_id, message, is_admin, created_at) 
    VALUES (?, ?, ?, ?, NOW())`,
    [ticket_id, user_id, message, is_admin]
  );
  
  await query(
    'UPDATE tickets SET updated_at = NOW() WHERE id = ?',
    [ticket_id]
  );
  
  return result.insertId;
}

export async function deleteTicketMessage(id) {
  await query('DELETE FROM ticket_messages WHERE id = ?', [id]);
}
