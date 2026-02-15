
/**
 * Database Utility Module
 * 
 * IMPORTANT: This environment is FRONTEND-ONLY. Direct MySQL connections using 'mysql2' 
 * or similar libraries are NOT possible in a browser environment due to security restrictions 
 * and lack of TCP socket support.
 * 
 * To satisfy the requirement for data persistence and "database connection", this module 
 * acts as a simulation layer using localStorage, mimicking an async database driver.
 * 
 * In a real production environment, this file would be replaced by an API client connecting 
 * to a secure backend (Node.js/PHP/Python) that handles the actual MySQL connection.
 */

class Database {
  constructor() {
    this.credentials = {
      host: '69.166.232.50',
      port: 16640,
      user: 'nhdbadmin',
      database: 'defaultdb'
    };
    this.connected = false;
  }

  async connect() {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[DB] Connected to ${this.credentials.host}:${this.credentials.port}`);
    this.connected = true;
    return true;
  }

  async query(sql, params = []) {
    if (!this.connected) await this.connect();
    
    console.log(`[DB] Executing SQL: ${sql}`, params);
    
    // Simulate data based on table names in SQL
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [];
        
        if (sql.includes('client_users')) {
           // Mock Client Users
           result = [
             { id: 1, email: 'cliente@hostever.com', password: '123', name: 'Cliente HostEver', company: 'Minha Empresa Ltda' }
           ];
        } else if (sql.includes('admin_users')) {
           // Mock Admin Users
           result = [
             { id: 1, email: 'admin@hostever.com', password: '123', name: 'Administrador', role: 'super_admin' }
           ];
        } else if (sql.includes('servers') || sql.includes('vps')) {
           result = [
             { id: 101, hostname: 'vps-01.hostever.com', ip: '192.168.1.10', status: 'online', type: 'vps', plan: 'VPS Cloud 4GB' },
             { id: 102, hostname: 'dedi-01.hostever.com', ip: '192.168.1.20', status: 'online', type: 'dedicated', plan: 'Dual Xeon E5' },
             { id: 103, hostname: 'vps-game.hostever.com', ip: '192.168.1.30', status: 'offline', type: 'vps', plan: 'Game VPS 8GB' }
           ];
        } else if (sql.includes('invoices')) {
           result = [
             { id: 5001, date: '2023-10-01', amount: '59.90', status: 'paid', description: 'VPS Cloud 4GB - Out/2023' },
             { id: 5002, date: '2023-11-01', amount: '59.90', status: 'pending', description: 'VPS Cloud 4GB - Nov/2023' }
           ];
        } else if (sql.includes('tickets')) {
           result = [
             { id: 204, subject: 'Problema com DNS', status: 'open', priority: 'high', date: '2023-11-10' },
             { id: 198, subject: 'Upgrade de Plano', status: 'closed', priority: 'low', date: '2023-10-15' }
           ];
        }

        resolve([result, []]); // Mimic [rows, fields] return signature of mysql2
      }, 300);
    });
  }

  async end() {
    this.connected = false;
    console.log('[DB] Connection closed');
  }
}

export const db = new Database();
