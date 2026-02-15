import { query } from '../config/database.js';

export async function getAllInvoices() {
  return await query('SELECT * FROM invoices ORDER BY created_at DESC');
}

export async function getInvoiceById(id) {
  const results = await query('SELECT * FROM invoices WHERE id = ?', [id]);
  return results[0];
}

export async function getInvoicesByUserId(userId) {
  return await query('SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getInvoicesByServiceId(serviceId) {
  return await query('SELECT * FROM invoices WHERE service_id = ? ORDER BY created_at DESC', [serviceId]);
}

export async function getOverdueInvoices() {
  return await query(
    "SELECT * FROM invoices WHERE status = 'pending' AND due_date < NOW() ORDER BY due_date ASC"
  );
}

export async function createInvoice(invoiceData) {
  const {
    user_id,
    service_id,
    amount,
    due_date,
    status = 'pending',
    payment_method = null,
    payment_id = null,
    description = '',
  } = invoiceData;
  
  const result = await query(
    `INSERT INTO invoices 
    (user_id, service_id, amount, due_date, status, payment_method, payment_id, description, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [user_id, service_id, amount, due_date, status, payment_method, payment_id, description]
  );
  
  return result.insertId;
}

export async function updateInvoice(id, invoiceData) {
  const fields = [];
  const values = [];
  
  Object.keys(invoiceData).forEach(key => {
    if (invoiceData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(invoiceData[key]);
    }
  });
  
  values.push(id);
  
  await query(
    `UPDATE invoices SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );
}

export async function markInvoiceAsPaid(id, paymentData = {}) {
  const { payment_id = null, payment_method = 'mercadopago', paid_at = new Date() } = paymentData;
  
  await query(
    `UPDATE invoices 
    SET status = 'paid', payment_id = ?, payment_method = ?, paid_at = ?, updated_at = NOW() 
    WHERE id = ?`,
    [payment_id, payment_method, paid_at, id]
  );
}

export async function deleteInvoice(id) {
  await query('DELETE FROM invoices WHERE id = ?', [id]);
}
