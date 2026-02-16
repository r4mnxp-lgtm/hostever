import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database.js';

const router = express.Router();

router.post('/create-first-admin', async (req, res) => {
  try {
    const [admins] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    
    if (admins[0].count > 0) {
      return res.status(403).json({ error: 'Já existe um administrador cadastrado. Use a função de criar admin no painel.' });
    }

    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, status, admin_category, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin', 'active', 'admin', true]
    );

    res.json({ 
      success: true, 
      message: 'Administrador criado com sucesso!',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating first admin:', error);
    res.status(500).json({ error: 'Erro ao criar administrador' });
  }
});

router.get('/check-setup', async (req, res) => {
  try {
    const [admins] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    res.json({ 
      needsSetup: admins[0].count === 0,
      hasAdmin: admins[0].count > 0
    });
  } catch (error) {
    console.error('Error checking setup:', error);
    res.status(500).json({ error: 'Erro ao verificar configuração' });
  }
});

export default router;
