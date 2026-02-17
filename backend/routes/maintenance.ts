import express from 'express';
import {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  getUpcomingMaintenance,
  getActiveMaintenance,
  createMaintenanceLog,
  updateMaintenanceLog,
  startMaintenance,
  completeMaintenance,
  cancelMaintenance,
} from '../models/maintenanceLogModel.js';
import { createActivityLog } from '../models/activityLogModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
    };
    
    const logs = await getAllMaintenanceLogs(filters);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance logs' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const logs = await getUpcomingMaintenance();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming maintenance' });
  }
});

router.get('/active', async (req, res) => {
  try {
    const logs = await getActiveMaintenance();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching active maintenance:', error);
    res.status(500).json({ error: 'Failed to fetch active maintenance' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const log = await getMaintenanceLogById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ error: 'Maintenance log not found' });
    }
    
    res.json(log);
  } catch (error) {
    console.error('Error fetching maintenance log:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance log' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, affected_services, scheduled_start, scheduled_end, created_by } = req.body;
    
    const logId = await createMaintenanceLog({
      title,
      description,
      affected_services,
      scheduled_start,
      scheduled_end,
      created_by,
    });
    
    await createActivityLog({
      user_id: created_by,
      action: 'maintenance_scheduled',
      entity_type: 'maintenance_log',
      entity_id: logId,
      description: `Manutenção agendada: ${title}`,
    });
    
    res.json({ id: logId, message: 'Maintenance log created successfully' });
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ error: 'Failed to create maintenance log' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, affected_services, scheduled_start, scheduled_end, status } = req.body;
    
    await updateMaintenanceLog(req.params.id, {
      title,
      description,
      affected_services,
      scheduled_start,
      scheduled_end,
      status,
    });
    
    await createActivityLog({
      action: 'maintenance_updated',
      entity_type: 'maintenance_log',
      entity_id: req.params.id,
      description: `Manutenção #${req.params.id} atualizada`,
    });
    
    res.json({ message: 'Maintenance log updated successfully' });
  } catch (error) {
    console.error('Error updating maintenance log:', error);
    res.status(500).json({ error: 'Failed to update maintenance log' });
  }
});

router.post('/:id/start', async (req, res) => {
  try {
    await startMaintenance(req.params.id);
    
    await createActivityLog({
      action: 'maintenance_started',
      entity_type: 'maintenance_log',
      entity_id: req.params.id,
      description: `Manutenção #${req.params.id} iniciada`,
    });
    
    res.json({ message: 'Maintenance started successfully' });
  } catch (error) {
    console.error('Error starting maintenance:', error);
    res.status(500).json({ error: 'Failed to start maintenance' });
  }
});

router.post('/:id/complete', async (req, res) => {
  try {
    await completeMaintenance(req.params.id);
    
    await createActivityLog({
      action: 'maintenance_completed',
      entity_type: 'maintenance_log',
      entity_id: req.params.id,
      description: `Manutenção #${req.params.id} concluída`,
    });
    
    res.json({ message: 'Maintenance completed successfully' });
  } catch (error) {
    console.error('Error completing maintenance:', error);
    res.status(500).json({ error: 'Failed to complete maintenance' });
  }
});

router.post('/:id/cancel', async (req, res) => {
  try {
    await cancelMaintenance(req.params.id);
    
    await createActivityLog({
      action: 'maintenance_cancelled',
      entity_type: 'maintenance_log',
      entity_id: req.params.id,
      description: `Manutenção #${req.params.id} cancelada`,
    });
    
    res.json({ message: 'Maintenance cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling maintenance:', error);
    res.status(500).json({ error: 'Failed to cancel maintenance' });
  }
});

export default router;
