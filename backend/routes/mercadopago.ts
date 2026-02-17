import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { getInvoiceById, updateInvoice, markInvoiceAsPaid } from '../models/invoiceModel.js';
import { getServiceById, activateService } from '../models/serviceModel.js';
import { unsuspendVPSInVirtualizor } from './virtualizor.js';
import { createActivityLog } from '../models/activityLogModel.js';

const router = express.Router();

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

router.post('/create-preference-for-invoice', async (req, res) => {
  try {
    const { invoice_id } = req.body;
    
    const invoice = await getInvoiceById(invoice_id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }
    
    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'Fatura já foi paga' });
    }
    
    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: [
          {
            title: invoice.description || `Fatura #${invoice.id}`,
            quantity: 1,
            unit_price: parseFloat(invoice.amount),
            currency_id: 'BRL',
          }
        ],
        external_reference: `invoice_${invoice.id}`,
        notification_url: `${process.env.VITE_API_URL}/mercadopago/webhook`,
        back_urls: {
          success: `${process.env.VITE_APP_URL}/client-area/invoices/${invoice.id}/success`,
          failure: `${process.env.VITE_APP_URL}/client-area/invoices/${invoice.id}/failure`,
          pending: `${process.env.VITE_APP_URL}/client-area/invoices/${invoice.id}/pending`,
        },
        auto_return: 'approved',
      }
    });
    
    await updateInvoice(invoice.id, {
      mercadopago_preference_id: response.id,
    });
    
    res.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      invoice_id: invoice.id,
    });
  } catch (error) {
    console.error('MercadoPago create preference for invoice error:', error);
    res.status(500).json({ 
      error: 'Falha ao criar preferência de pagamento',
      details: error.message 
    });
  }
});

router.get('/payment/:id', async (req, res) => {
  try {
    const payment = new Payment(client);
    const response = await payment.get({ id: req.params.id });
    
    res.json({
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      transaction_amount: response.transaction_amount,
      date_created: response.date_created,
      date_approved: response.date_approved,
      payer: response.payer,
    });
  } catch (error) {
    console.error('MercadoPago get payment error:', error);
    res.status(500).json({ 
      error: 'Failed to get payment status',
      details: error.message 
    });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: data.id });
      
      console.log('Payment webhook received:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference,
      });
      
      if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        const match = paymentInfo.external_reference.match(/invoice_(\d+)/);
        
        if (match) {
          const invoiceId = parseInt(match[1]);
          const invoice = await getInvoiceById(invoiceId);
          
          if (invoice && invoice.status !== 'paid') {
            await markInvoiceAsPaid(invoiceId, {
              mercadopago_payment_id: paymentInfo.id,
              paid_at: new Date(),
            });
            
            await createActivityLog({
              user_id: invoice.user_id,
              action: 'invoice_paid',
              entity_type: 'invoice',
              entity_id: invoiceId,
              description: `Fatura #${invoiceId} paga via MercadoPago (Payment ID: ${paymentInfo.id})`,
            });
            
            if (invoice.service_id) {
              const service = await getServiceById(invoice.service_id);
              
              if (service && service.status === 'suspended') {
                await activateService(service.id);
                
                if (service.virtualizor_vps_id) {
                  await unsuspendVPSInVirtualizor(service.virtualizor_vps_id);
                }
                
                await createActivityLog({
                  user_id: invoice.user_id,
                  action: 'service_reactivated',
                  entity_type: 'service',
                  entity_id: service.id,
                  description: `Serviço reativado após pagamento da fatura #${invoiceId}`,
                });
              }
            }
            
            console.log(`✅ Fatura #${invoiceId} marcada como paga`);
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('MercadoPago webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
