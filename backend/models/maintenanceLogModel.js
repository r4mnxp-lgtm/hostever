import { query } from '../config/database.js';

export async function getAllMaintenanceLogs(filters = {}) {
  let sql = `
    SELECT ml.*, u.name as created_by_name
    FROM maintenance_logs ml
    LEFT JOIN users u ON ml.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  
  if (filters.status) {
    sql += ' AND ml.status = ?';
    params.push(filters.status);
  }
  
  if (filters.from_date) {
    sql += ' AND ml.scheduled_start >= ?';
    params.push(filters.from_date);
  }
  
  if (filters.to_date) {
    sql += ' AND ml.scheduled_end <= ?';
    params.push(filters.to_date);
  }
  
  sql += ' ORDER BY ml.scheduled_start DESC';
  
  return await query(sql, params);
}

export async function getMaintenanceLogById(id) {
  const sql = `
    SELECT ml.*, u.name as created_by_name
    FROM maintenance_logs ml
    LEFT JOIN users u ON ml.created_by = u.id
    WHERE ml.id = ?
  `;
  const results = await query(sql, [id]);
  return results[0];
}

export async function getUpcomingMaintenance() {
  return await query(
    `SELECT ml.*, u.name as created_by_name
    FROM maintenance_logs ml
    LEFT JOIN users u ON ml.created_by = u.id
    WHERE ml.status IN ('scheduled', 'in_progress') 
    AND ml.scheduled_start >= NOW()
    ORDER BY ml.scheduled_start ASC`
  );
}

export async function getActiveMaintenance() {
  return await query(
    `SELECT ml.*, u.name as created_by_name
    FROM maintenance_logs ml
    LEFT JOIN users u ON ml.created_by = u.id
    WHERE ml.status = 'in_progress'
    ORDER BY ml.scheduled_start ASC`
  );
}

export async function createMaintenanceLog(maintenanceData) {
  const {
    title,
    description,
    affected_services = '',
    scheduled_start,
    scheduled_end,
    created_by,
    status = 'scheduled',
  } = maintenanceData;
  
  const result = await query(
    `INSERT INTO maintenance_logs 
    (title, description, affected_services, scheduled_start, scheduled_end, created_by, status, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [title, description, affected_services, scheduled_start, scheduled_end, created_by, status]
  );
  
  return result.insertId;
}

export async function updateMaintenanceLog(id, maintenanceData) {
  const fields = [];
  const values = [];
  
  Object.keys(maintenanceData).forEach(key => {
    if (maintenanceData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(maintenanceData[key]);
    }
  });
  
  values.push(id);
  
  await query(
    `UPDATE maintenance_logs SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );
}

export async function startMaintenance(id) {
  await query(
    "UPDATE maintenance_logs SET status = 'in_progress', actual_start = NOW(), updated_at = NOW() WHERE id = ?",
    [id]
  );
}

export async function completeMaintenance(id) {
  await query(
    "UPDATE maintenance_logs SET status = 'completed', actual_end = NOW(), updated_at = NOW() WHERE id = ?",
    [id]
  );
}

export async function cancelMaintenance(id) {
  await query(
    "UPDATE maintenance_logs SET status = 'cancelled', updated_at = NOW() WHERE id = ?",
    [id]
  );
}

export async function deleteMaintenanceLog(id) {
  await query('DELETE FROM maintenance_logs WHERE id = ?', [id]);
}
