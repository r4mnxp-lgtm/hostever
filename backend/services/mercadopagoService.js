import mercadopago from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Configurar MercadoPago
if (process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_ACCESS_TOKEN !== 'seu_token_aqui') {
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
  });
}

/**
 * Criar preferência de pagamento (PIX, Cartão, Boleto)
 */
export async function createPaymentPreference(orderData) {
  const {
    title,
    description,
    price,
    quantity = 1,
    userId,
    userEmail,
    userName,
    orderId,
  } = orderData;

  const preference = {
    items: [
      {
        id: orderId.toString(),
        title: title,
        description: description,
        quantity: quantity,
        currency_id: 'BRL',
        unit_price: parseFloat(price),
      }
    ],
    payer: {
      name: userName,
      email: userEmail,
    },
    payment_methods: {
      excluded_payment_types: [],
      excluded_payment_methods: [],
      installments: 12,
    },
    back_urls: {
      success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
      failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/failure`,
      pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/pending`,
    },
    auto_return: 'approved',
    external_reference: orderId.toString(),
    notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/mercadopago/webhook`,
    statement_descriptor: 'HOSTEVER',
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return {
      success: true,
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
    };
  } catch (error) {
    console.error('Erro ao criar preferência MercadoPago:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Criar pagamento PIX direto
 */
export async function createPixPayment(paymentData) {
  const {
    amount,
    description,
    userEmail,
    userName,
    userCpf,
    orderId,
  } = paymentData;

  const payment = {
    transaction_amount: parseFloat(amount),
    description: description,
    payment_method_id: 'pix',
    payer: {
      email: userEmail,
      first_name: userName.split(' ')[0],
      last_name: userName.split(' ').slice(1).join(' ') || userName.split(' ')[0],
      identification: {
        type: 'CPF',
        number: userCpf.replace(/\D/g, ''),
      },
    },
    external_reference: orderId.toString(),
    notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/mercadopago/webhook`,
  };

  try {
    const response = await mercadopago.payment.create(payment);
    return {
      success: true,
      id: response.body.id,
      status: response.body.status,
      qr_code: response.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.body.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: response.body.point_of_interaction.transaction_data.ticket_url,
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Obter detalhes do pagamento
 */
export async function getPaymentDetails(paymentId) {
  try {
    const response = await mercadopago.payment.get(paymentId);
    return {
      success: true,
      payment: response.body,
    };
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Processar notificação do webhook
 */
export async function processWebhookNotification(notification) {
  const { type, data } = notification;

  if (type === 'payment') {
    const paymentId = data.id;
    const paymentDetails = await getPaymentDetails(paymentId);
    
    if (paymentDetails.success) {
      const payment = paymentDetails.payment;
      
      return {
        success: true,
        paymentId: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        external_reference: payment.external_reference,
        transaction_amount: payment.transaction_amount,
        payment_method_id: payment.payment_method_id,
        payer_email: payment.payer.email,
      };
    }
  }

  return { success: false, error: 'Tipo de notificação não suportado' };
}
