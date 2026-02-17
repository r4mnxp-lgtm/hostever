import express from 'express';
import { getInvoicesByUserId, getInvoiceById } from '../models/invoiceModel.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const invoices = await getInvoicesByUserId(req.params.userId);
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

export default router;
