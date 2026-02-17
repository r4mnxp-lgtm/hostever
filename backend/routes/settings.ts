import express from 'express';
import bcrypt from 'bcrypt';
import { initializeEmailService, testEmailConnection } from '../services/emailService.js';
import pool from '../config/database.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

router.get('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM system_settings WHERE id = 1');
    
    if (rows.length > 0) {
      const settings = rows[0];
      res.json({
        smtp: {
          host: settings.smtp_host || '',
          port: settings.smtp_port || '',
          secure: settings.smtp_secure || true,
          user: settings.smtp_user || '',
          password: '',
          from_email: settings.smtp_from_email || '',
          from_name: settings.smtp_from_name || 'HostEver'
        },
        company: {
          company_name: settings.company_name || 'HostEver',
          company_email: settings.company_email || '',
          company_phone: settings.company_phone || '',
          support_email: settings.support_email || '',
          founded_year: settings.founded_year || '2025',
          founded_location: settings.founded_location || 'São Paulo, Brasil'
        }
      });
    } else {
      res.json({
        smtp: {
          host: '',
          port: '',
          secure: true,
          user: '',
          password: '',
          from_email: '',
          from_name: 'HostEver'
        },
        company: {
          company_name: 'HostEver',
          company_email: '',
          company_phone: '',
          support_email: '',
          founded_year: '2025',
          founded_location: 'São Paulo, Brasil'
        }
      });
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    res.status(500).json({ error: 'Erro ao carregar configurações' });
  }
});

router.post('/settings/smtp', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { host, port, secure, user, password, from_email, from_name } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM system_settings WHERE id = 1');
    
    if (existing.length > 0) {
      if (password) {
        await pool.query(
          'UPDATE system_settings SET smtp_host = ?, smtp_port = ?, smtp_secure = ?, smtp_user = ?, smtp_password = ?, smtp_from_email = ?, smtp_from_name = ? WHERE id = 1',
          [host, port, secure, user, password, from_email, from_name]
        );
      } else {
        await pool.query(
          'UPDATE system_settings SET smtp_host = ?, smtp_port = ?, smtp_secure = ?, smtp_user = ?, smtp_from_email = ?, smtp_from_name = ? WHERE id = 1',
          [host, port, secure, user, from_email, from_name]
        );
      }
    } else {
      await pool.query(
        'INSERT INTO system_settings (smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, smtp_from_email, smtp_from_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [host, port, secure, user, password, from_email, from_name]
      );
    }
    
    if (host && port && user && password) {
      initializeEmailService({
        host,
        port,
        secure,
        user,
        password
      });
      
      process.env.SMTP_FROM_EMAIL = from_email;
      process.env.SMTP_FROM_NAME = from_name;
    }
    
    res.json({ success: true, message: 'Configurações SMTP salvas com sucesso' });
  } catch (error) {
    console.error('Error saving SMTP settings:', error);
    res.status(500).json({ error: 'Erro ao salvar configurações SMTP' });
  }
});

router.post('/settings/company', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { company_name, company_email, company_phone, support_email, founded_year, founded_location } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM system_settings WHERE id = 1');
    
    if (existing.length > 0) {
      await pool.query(
        'UPDATE system_settings SET company_name = ?, company_email = ?, company_phone = ?, support_email = ?, founded_year = ?, founded_location = ? WHERE id = 1',
        [company_name, company_email, company_phone, support_email, founded_year, founded_location]
      );
    } else {
      await pool.query(
        'INSERT INTO system_settings (company_name, company_email, company_phone, support_email, founded_year, founded_location) VALUES (?, ?, ?, ?, ?, ?)',
        [company_name, company_email, company_phone, support_email, founded_year, founded_location]
      );
    }
    
    res.json({ success: true, message: 'Dados da empresa salvos com sucesso' });
  } catch (error) {
    console.error('Error saving company settings:', error);
    res.status(500).json({ error: 'Erro ao salvar dados da empresa' });
  }
});

router.post('/settings/smtp/test', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await testEmailConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/change-password', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);
    
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

router.post('/admin/update-account', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.userId]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail já está em uso' });
    }
    
    await pool.query('UPDATE users SET email = ?, name = ? WHERE id = ?', [email, name, req.userId]);
    
    res.json({ success: true, message: 'Dados da conta atualizados com sucesso' });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Erro ao atualizar dados da conta' });
  }
});

export default router;
