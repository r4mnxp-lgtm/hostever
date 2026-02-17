import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
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

router.get('/users/admins', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, admin_category, permissions, created_at FROM users WHERE role = ?',
      ['admin']
    );
    res.json(rows);
  } catch (error) {
    console.error('Error loading admins:', error);
    res.status(500).json({ error: 'Erro ao carregar administradores' });
  }
});

router.post('/users/create-admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, category, permissions } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (name, email, password, role, admin_category, permissions) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin', category, JSON.stringify(permissions)]
    );
    
    res.json({ success: true, message: 'Administrador criado com sucesso' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Erro ao criar administrador' });
  }
});

router.put('/users/:id/category', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, permissions } = req.body;
    
    await pool.query(
      'UPDATE users SET admin_category = ?, permissions = ? WHERE id = ? AND role = ?',
      [category, JSON.stringify(permissions), id, 'admin']
    );
    
    res.json({ success: true, message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error('Error updating admin category:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ error: 'Você não pode remover sua própria conta' });
    }
    
    await pool.query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'admin']);
    
    res.json({ success: true, message: 'Administrador removido com sucesso' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Erro ao remover administrador' });
  }
});

export default router;
