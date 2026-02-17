import { query } from '../config/database.js';

export async function createActivityLog(logData) {
  const {
    user_id = null,
    action,
    entity_type = null,
    entity_id = null,
    description = '',
    ip_address = null,
  } = logData;
  
  const result = await query(
    `INSERT INTO activity_logs 
    (user_id, action, entity_type, entity_id, description, ip_address, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [user_id, action, entity_type, entity_id, description, ip_address]
  );
  
  return result.insertId;
}

export async function getActivityLogs(filters = {}, limit = 100) {
  let sql = 'SELECT al.*, u.name as user_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE 1=1';
  const params = [];
  
  if (filters.user_id) {
    sql += ' AND al.user_id = ?';
    params.push(filters.user_id);
  }
  
  if (filters.entity_type) {
    sql += ' AND al.entity_type = ?';
    params.push(filters.entity_type);
  }
  
  if (filters.entity_id) {
    sql += ' AND al.entity_id = ?';
    params.push(filters.entity_id);
  }
  
  if (filters.action) {
    sql += ' AND al.action = ?';
    params.push(filters.action);
  }
  
  sql += ' ORDER BY al.created_at DESC LIMIT ?';
  params.push(limit);
  
  return await query(sql, params);
}
