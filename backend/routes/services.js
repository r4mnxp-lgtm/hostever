import express from 'express';
import {
  getAllServices,
  getServiceById,
  getServicesByUserId,
  updateService,
  suspendService,
  activateService,
} from '../models/serviceModel.js';
import { suspendVPSInVirtualizor, unsuspendVPSInVirtualizor } from './virtualizor.js';
import { createActivityLog } from '../models/activityLogModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const services = await getServicesByUserId(req.params.userId);
    res.json(services);
  } catch (error) {
    console.error('Error fetching user services:', error);
    res.status(500).json({ error: 'Failed to fetch user services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, price, billing_cycle, next_due_date, auto_renew } = req.body;
    
    await updateService(req.params.id, {
      status,
      price,
      billing_cycle,
      next_due_date,
      auto_renew,
    });
    
    await createActivityLog({
      action: 'service_updated',
      entity_type: 'service',
      entity_id: req.params.id,
      description: `Serviço #${req.params.id} atualizado`,
    });
    
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.post('/:id/suspend', async (req, res) => {
  try {
    const { admin_user_id, reason = '' } = req.body;
    const service = await getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    if (service.virtualizor_vps_id) {
      await suspendVPSInVirtualizor(service.virtualizor_vps_id);
    }
    
    await suspendService(req.params.id);
    
    await createActivityLog({
      user_id: admin_user_id,
      action: 'service_suspended_manually',
      entity_type: 'service',
      entity_id: req.params.id,
      description: `Serviço #${req.params.id} suspenso manualmente${reason ? `: ${reason}` : ''}`,
    });
    
    res.json({ message: 'Service suspended successfully' });
  } catch (error) {
    console.error('Error suspending service:', error);
    res.status(500).json({ error: 'Failed to suspend service' });
  }
});

router.post('/:id/activate', async (req, res) => {
  try {
    const { admin_user_id } = req.body;
    const service = await getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    if (service.virtualizor_vps_id) {
      await unsuspendVPSInVirtualizor(service.virtualizor_vps_id);
    }
    
    await activateService(req.params.id);
    
    await createActivityLog({
      user_id: admin_user_id,
      action: 'service_activated_manually',
      entity_type: 'service',
      entity_id: req.params.id,
      description: `Serviço #${req.params.id} ativado manualmente`,
    });
    
    res.json({ message: 'Service activated successfully' });
  } catch (error) {
    console.error('Error activating service:', error);
    res.status(500).json({ error: 'Failed to activate service' });
  }
});

router.post('/:id/cancel', async (req, res) => {
  try {
    const { admin_user_id, reason = '' } = req.body;
    
    await updateService(req.params.id, { status: 'cancelled' });
    
    await createActivityLog({
      user_id: admin_user_id,
      action: 'service_cancelled',
      entity_type: 'service',
      entity_id: req.params.id,
      description: `Serviço #${req.params.id} cancelado${reason ? `: ${reason}` : ''}`,
    });
    
    res.json({ message: 'Service cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling service:', error);
    res.status(500).json({ error: 'Failed to cancel service' });
  }
});

export default router;
