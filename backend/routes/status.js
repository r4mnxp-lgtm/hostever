import express from 'express';
import { verifyToken } from './auth.js';
import * as StatusModel from '../models/statusModel.js';

const router = express.Router();

// Rotas públicas
router.get('/current', async (req, res) => {
  try {
    const services = await StatusModel.getAllServices();
    const incidents = await StatusModel.getActiveIncidents();
    res.json({ services, incidents });
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

router.get('/incidents', async (req, res) => {
  try {
    const incidents = await StatusModel.getAllIncidents();
    res.json(incidents);
  } catch (error) {
    console.error('Erro ao buscar incidentes:', error);
    res.status(500).json({ error: 'Erro ao buscar incidentes' });
  }
});

// Rotas admin apenas
router.get('/services', verifyToken, async (req, res) => {
  try {
    const services = await StatusModel.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

router.post('/services', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const id = await StatusModel.createService(req.body);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
});

router.put('/services/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await StatusModel.updateServiceStatus(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar status do serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do serviço' });
  }
});

router.delete('/services/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await StatusModel.deleteService(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
});

router.post('/incidents', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const id = await StatusModel.createIncident({
      ...req.body,
      created_by: req.userId
    });
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao criar incidente:', error);
    res.status(500).json({ error: 'Erro ao criar incidente' });
  }
});

router.put('/incidents/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await StatusModel.updateIncident(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar incidente:', error);
    res.status(500).json({ error: 'Erro ao atualizar incidente' });
  }
});

router.delete('/incidents/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await StatusModel.deleteIncident(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar incidente:', error);
    res.status(500).json({ error: 'Erro ao deletar incidente' });
  }
});

export default router;
