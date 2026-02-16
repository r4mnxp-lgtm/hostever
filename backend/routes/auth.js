import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getUserById } from '../models/userModel.js';
import { createActivityLog } from '../models/activityLogModel.js';
import { validateCPFCNPJ, fetchAddressByCEP } from '../utils/validators.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hostever_secret_key_change_in_production';

router.post('/validate-cpf', async (req, res) => {
  try {
    const { cpfCnpj } = req.body;
    
    if (!cpfCnpj) {
      return res.status(400).json({ error: 'CPF/CNPJ não fornecido', valid: false });
    }

    const isValid = validateCPFCNPJ(cpfCnpj);
    
    if (!isValid) {
      return res.json({ valid: false, message: 'CPF/CNPJ inválido' });
    }

    res.json({ valid: true, message: 'CPF/CNPJ válido' });
  } catch (error) {
    console.error('Validate CPF error:', error);
    res.status(500).json({ error: 'Erro ao validar CPF/CNPJ', valid: false });
  }
});

router.post('/fetch-address', async (req, res) => {
  try {
    const { cep } = req.body;
    
    if (!cep) {
      return res.status(400).json({ error: 'CEP não fornecido' });
    }

    const address = await fetchAddressByCEP(cep);
    res.json({ success: true, address });
  } catch (error) {
    console.error('Fetch address error:', error);
    res.status(400).json({ error: error.message || 'Erro ao buscar endereço' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      cpf_cnpj,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      accepted_terms
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    if (!accepted_terms) {
      return res.status(400).json({ error: 'Você precisa aceitar os termos de uso' });
    }

    if (cpf_cnpj && !validateCPFCNPJ(cpf_cnpj)) {
      return res.status(400).json({ error: 'CPF/CNPJ inválido' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userId = await createUser({
      name,
      email,
      password_hash,
      phone,
      cpf_cnpj,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      accepted_terms: true,
      role: 'client',
    });

    const token = jwt.sign(
      { userId, email, role: 'client' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await createActivityLog({
      user_id: userId,
      action: 'user_registered',
      entity_type: 'user',
      entity_id: userId,
      description: `Novo usuário registrado: ${name}`,
      ip_address: req.ip,
    });

    sendWelcomeEmail(email, name).catch(err => 
      console.error('Error sending welcome email:', err)
    );

    const user = await getUserById(userId);

    res.json({ 
      message: 'Conta criada com sucesso', 
      userId,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Conta suspensa ou inativa' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await createActivityLog({
      user_id: user.id,
      action: 'user_login',
      entity_type: 'user',
      entity_id: user.id,
      description: `Login realizado`,
      ip_address: req.ip,
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      cpf_cnpj: user.cpf_cnpj,
      cep: user.cep,
      street: user.street,
      number: user.number,
      complement: user.complement,
      neighborhood: user.neighborhood,
      city: user.city,
      state: user.state,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = { id: decoded.userId, role: decoded.role, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export default router;
export { verifyToken };
