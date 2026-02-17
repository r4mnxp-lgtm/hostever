import express from 'express';
import fetch from 'node-fetch';
import { getServiceById, updateService, suspendService, activateService } from '../models/serviceModel.js';
import { createActivityLog } from '../models/activityLogModel.js';

const router = express.Router();

const VIRTUALIZOR_HOST = process.env.VITE_VIRTUALIZOR_HOST;
const VIRTUALIZOR_API_KEY = process.env.VITE_VIRTUALIZOR_API_KEY;
const VIRTUALIZOR_API_PASS = process.env.VITE_VIRTUALIZOR_API_PASS;

async function virtualizorRequest(action, params = {}) {
  const url = new URL(`${VIRTUALIZOR_HOST}/index.php`);
  url.searchParams.append('act', action);
  url.searchParams.append('api', 'json');
  url.searchParams.append('apikey', VIRTUALIZOR_API_KEY);
  url.searchParams.append('apipass', VIRTUALIZOR_API_PASS);
  
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Virtualizor API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Virtualizor ${action} error:`, error);
    throw error;
  }
}

export async function suspendVPSInVirtualizor(vpsId) {
  try {
    const result = await virtualizorRequest('suspend', { vpsid: vpsId });
    return result;
  } catch (error) {
    console.error(`Failed to suspend VPS ${vpsId}:`, error);
    throw error;
  }
}

export async function unsuspendVPSInVirtualizor(vpsId) {
  try {
    const result = await virtualizorRequest('unsuspend', { vpsid: vpsId });
    return result;
  } catch (error) {
    console.error(`Failed to unsuspend VPS ${vpsId}:`, error);
    throw error;
  }
}

router.post('/listvs', async (req, res) => {
  try {
    const result = await virtualizorRequest('listvs', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vps_status', async (req, res) => {
  try {
    const result = await virtualizorRequest('vps_status', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/start', async (req, res) => {
  try {
    const result = await virtualizorRequest('start', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stop', async (req, res) => {
  try {
    const result = await virtualizorRequest('stop', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/restart', async (req, res) => {
  try {
    const result = await virtualizorRequest('restart', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/addvs', async (req, res) => {
  try {
    const result = await virtualizorRequest('addvs', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deletevs', async (req, res) => {
  try {
    const result = await virtualizorRequest('deletevs', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/dedicated_servers', async (req, res) => {
  try {
    const result = await virtualizorRequest('dedicated_servers', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/suspend', async (req, res) => {
  try {
    const { vpsid, service_id } = req.body;
    
    const result = await virtualizorRequest('suspend', { vpsid });
    
    if (service_id) {
      await suspendService(service_id);
      await createActivityLog({
        action: 'service_suspended',
        entity_type: 'service',
        entity_id: service_id,
        description: `VPS ${vpsid} suspended via Virtualizor`,
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/unsuspend', async (req, res) => {
  try {
    const { vpsid, service_id } = req.body;
    
    const result = await virtualizorRequest('unsuspend', { vpsid });
    
    if (service_id) {
      await activateService(service_id);
      await createActivityLog({
        action: 'service_unsuspended',
        entity_type: 'service',
        entity_id: service_id,
        description: `VPS ${vpsid} unsuspended via Virtualizor`,
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reinstall', async (req, res) => {
  try {
    const result = await virtualizorRequest('rebuild', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
