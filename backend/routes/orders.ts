import express from 'express';
import { verifyToken } from './auth.js';
import { createService } from '../models/serviceModel.js';
import { createInvoice } from '../models/invoiceModel.js';
import { createActivityLog } from '../models/activityLogModel.js';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const router = express.Router();

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-TOKEN'
});

router.post('/create', verifyToken, async (req, res) => {
  try {
    const { planId, planName, planType, planPrice, planSpecs, billingCycle, location } = req.body;
    const userId = req.userId;

    console.log('Creating order:', { userId, planName, planType, planPrice, billingCycle });

    const priceValue = parseFloat(planPrice.replace(',', '.'));
    const cycleMultiplier = billingCycle === 'monthly' ? 1 : 12;
    const totalPrice = priceValue * cycleMultiplier;

    console.log('Price calculated:', { priceValue, totalPrice });

    const nextDueDate = new Date();
    if (billingCycle === 'monthly') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    } else {
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
    }

    const serviceId = await createService({
      user_id: userId,
      product_type: planType,
      product_name: planName,
      specifications: JSON.stringify(planSpecs),
      price: totalPrice,
      billing_cycle: billingCycle,
      status: 'pending',
      location: location || 'br',
      next_due_date: nextDueDate,
    });

    console.log('Service created with ID:', serviceId);

    const invoiceId = await createInvoice({
      user_id: userId,
      service_id: serviceId,
      amount: totalPrice,
      status: 'pending',
      due_date: nextDueDate,
      description: `${planName} - ${billingCycle === 'monthly' ? 'Mensal' : 'Anual'}`,
    });

    console.log('Invoice created with ID:', invoiceId);

    await createActivityLog({
      user_id: userId,
      action: 'order_created',
      entity_type: 'service',
      entity_id: serviceId,
      description: `Novo pedido criado: ${planName}`,
      ip_address: req.ip || null,
    });

    res.json({
      success: true,
      serviceId,
      invoiceId,
      amount: totalPrice,
    });
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
  }
});

router.post('/create-payment', verifyToken, async (req, res) => {
  try {
    const { invoiceId, amount, description } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: description,
            unit_price: amount,
            quantity: 1,
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/client-dashboard/invoices?payment=success`,
          failure: `${process.env.FRONTEND_URL}/client-dashboard/invoices?payment=failure`,
          pending: `${process.env.FRONTEND_URL}/client-dashboard/invoices?payment=pending`
        },
        auto_return: 'approved',
        external_reference: invoiceId.toString(),
        notification_url: `${process.env.BACKEND_URL}/api/orders/webhook`,
      }
    });

    res.json({
      success: true,
      init_point: result.init_point,
      preference_id: result.id,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      await createActivityLog({
        action: 'payment_notification',
        entity_type: 'payment',
        entity_id: paymentId,
        description: `Notificação de pagamento recebida`,
        ip_address: req.ip,
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

export default router;
