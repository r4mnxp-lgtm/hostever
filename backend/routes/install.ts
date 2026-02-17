import express from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/database.js';

const router = express.Router();

// Rota pública para verificar status do banco
router.get('/check-database', async (req, res) => {
  try {
    const [tables] = await query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    const requiredTables = ['users', 'services', 'invoices', 'tickets', 'ticket_replies', 'activity_logs', 'maintenance_logs'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length > 0) {
      return res.json({
        status: 'incomplete',
        message: 'Banco de dados incompleto',
        missingTables,
        action: 'Execute: setup-database.bat'
      });
    }

    // Verificar se existe admin
    const [admins] = await query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    
    res.json({
      status: 'ok',
      message: 'Banco de dados configurado',
      tables: tableNames,
      hasAdmin: admins[0].count > 0
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code,
      action: 'Execute: setup-database.bat'
    });
  }
});

// Rota para criar usuário admin via API (com senha de segurança)
router.post('/create-admin', async (req, res) => {
  try {
    const { securityKey } = req.body;
    
    // Senha de segurança temporária (mude isso!)
    if (securityKey !== 'hostever_install_2024') {
      return res.status(403).json({ error: 'Chave de segurança inválida' });
    }

    const adminEmail = 'admin@hostever.com.br';
    const adminPassword = 'Admin@HostEver2024';
    
    // Verificar se já existe
    const [existing] = await query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    if (existing.length > 0) {
      return res.json({
        message: 'Admin já existe',
        email: adminEmail,
        password: adminPassword
      });
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const [result] = await query(
      `INSERT INTO users (name, email, password_hash, phone, cpf_cnpj, role, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['Administrador HostEver', adminEmail, passwordHash, '(11) 99999-9999', '00000000000', 'admin', 'active']
    );

    res.json({
      success: true,
      message: 'Admin criado com sucesso',
      email: adminEmail,
      password: adminPassword,
      userId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de diagnóstico completo
router.get('/diagnostics', async (req, res) => {
  const diagnostics = {
    database: 'not_checked',
    tables: [],
    missingTables: [],
    hasAdmin: false,
    errors: []
  };

  try {
    // Testar conexão
    await query('SELECT 1');
    diagnostics.database = 'connected';

    // Listar tabelas
    const [tables] = await query('SHOW TABLES');
    diagnostics.tables = tables.map(t => Object.values(t)[0]);

    // Verificar tabelas obrigatórias
    const requiredTables = ['users', 'services', 'invoices', 'tickets', 'ticket_replies', 'activity_logs', 'maintenance_logs'];
    diagnostics.missingTables = requiredTables.filter(t => !diagnostics.tables.includes(t));

    // Verificar admin
    if (diagnostics.tables.includes('users')) {
      const [admins] = await query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
      diagnostics.hasAdmin = admins[0].count > 0;
    }

  } catch (error) {
    diagnostics.database = 'error';
    diagnostics.errors.push(error.message);
  }

  res.json(diagnostics);
});

export default router;
