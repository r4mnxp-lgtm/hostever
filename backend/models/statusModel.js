import connection from '../config/database.js';

export async function createIncident(incidentData) {
  const { title, description, severity, affected_services, started_at, created_by } = incidentData;
  
  const [result] = await connection.query(
    `INSERT INTO status_incidents (title, description, severity, affected_services, started_at, created_by) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, severity, JSON.stringify(affected_services), started_at, created_by]
  );
  
  return result.insertId;
}

export async function getAllIncidents(limit = 50) {
  const [rows] = await connection.query(
    `SELECT * FROM status_incidents ORDER BY started_at DESC LIMIT ?`,
    [limit]
  );
  return rows;
}

export async function getActiveIncidents() {
  const [rows] = await connection.query(
    `SELECT * FROM status_incidents WHERE status != 'resolved' ORDER BY started_at DESC`
  );
  return rows;
}

export async function updateIncident(id, updates) {
  const fields = [];
  const values = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(key === 'affected_services' ? JSON.stringify(value) : value);
  });
  
  values.push(id);
  
  await connection.query(
    `UPDATE status_incidents SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteIncident(id) {
  await connection.query('DELETE FROM status_incidents WHERE id = ?', [id]);
}

export async function getAllServices() {
  const [rows] = await connection.query('SELECT * FROM status_services ORDER BY created_at DESC');
  return rows;
}

export async function createService(serviceData) {
  const { name, category, status, description, url, location } = serviceData;
  
  const [result] = await connection.query(
    `INSERT INTO status_services (name, category, status, description, url, location) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, category, status || 'operational', description, url, location]
  );
  
  return result.insertId;
}

export async function updateServiceStatus(id, status) {
  await connection.query('UPDATE status_services SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteService(id) {
  await connection.query('DELETE FROM status_services WHERE id = ?', [id]);
}
