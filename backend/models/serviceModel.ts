import { query } from '../config/database.js';

export async function getAllServices() {
  return await query('SELECT * FROM services ORDER BY created_at DESC');
}

export async function getServiceById(id) {
  const results = await query('SELECT * FROM services WHERE id = ?', [id]);
  return results[0];
}

export async function getServicesByUserId(userId) {
  return await query('SELECT * FROM services WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function createService(serviceData) {
  const {
    user_id,
    product_type,
    product_name,
    specifications,
    status = 'pending',
    price,
    billing_cycle = 'monthly',
    next_due_date = null,
    location = 'br',
    vps_id = null,
    ip_address = null,
  } = serviceData;
  
  const result = await query(
    `INSERT INTO services 
    (user_id, product_type, product_name, specifications, status, price, billing_cycle, next_due_date, location, vps_id, ip_address, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [user_id, product_type, product_name, specifications, status, price, billing_cycle, next_due_date, location, vps_id, ip_address]
  );
  
  return result.insertId;
}

export async function updateService(id, serviceData) {
  const fields = [];
  const values = [];
  
  Object.keys(serviceData).forEach(key => {
    if (serviceData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(serviceData[key]);
    }
  });
  
  values.push(id);
  
  await query(
    `UPDATE services SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );
}

export async function deleteService(id) {
  await query('DELETE FROM services WHERE id = ?', [id]);
}

export async function suspendService(id) {
  await query(
    "UPDATE services SET status = 'suspended', updated_at = NOW() WHERE id = ?",
    [id]
  );
}

export async function activateService(id) {
  await query(
    "UPDATE services SET status = 'active', updated_at = NOW() WHERE id = ?",
    [id]
  );
}
