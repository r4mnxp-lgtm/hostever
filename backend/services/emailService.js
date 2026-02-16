import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let transporter = null;

export const initializeEmailService = (config) => {
  try {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: parseInt(config.port),
      secure: config.secure === true || config.secure === 'true',
      auth: {
        user: config.user,
        pass: config.password
      }
    });
    
    console.log('Email service initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing email service:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (userEmail, userName, verificationToken) => {
  if (!transporter) {
    console.error('Email service not initialized');
    return false;
  }

  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

  const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à HostEver</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #FFB833 0%, #FFA500 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Bem-vindo à HostEver!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Olá <strong>${userName}</strong>,
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Obrigado por se cadastrar na HostEver! Para completar seu cadastro, precisamos que você confirme seu e-mail.
                            </p>
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="${verificationLink}" 
                                   style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #FFB833 0%, #FFA500 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Confirmar E-mail
                                </a>
                            </div>
                            <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Ou copie e cole este link no seu navegador:<br>
                                <a href="${verificationLink}" style="color: #FFA500; word-break: break-all;">${verificationLink}</a>
                            </p>
                            <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                Este link expira em 24 horas. Se você não solicitou este cadastro, ignore este e-mail.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                                © 2025-2026 HostEver. Todos os direitos reservados.<br>
                                São Paulo, Brasil
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'HostEver'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: userEmail,
      subject: 'Confirme seu e-mail - HostEver',
      html: template
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

export const sendPurchaseConfirmationEmail = async (userEmail, userName, orderDetails) => {
  if (!transporter) {
    console.error('Email service not initialized');
    return false;
  }

  const { serviceName, price, billingCycle, orderId } = orderDetails;

  const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Compra - HostEver</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #FFB833 0%, #FFA500 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Compra Confirmada!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Olá <strong>${userName}</strong>,
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Sua compra foi confirmada com sucesso! Obrigado por escolher a HostEver.
                            </p>
                            
                            <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px; border-left: 4px solid #FFB833;">
                                <h3 style="margin: 0 0 15px; color: #FFB833; font-size: 18px;">Detalhes da Compra</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Pedido #:</td>
                                        <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Serviço:</td>
                                        <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${serviceName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">Ciclo:</td>
                                        <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${billingCycle}</td>
                                    </tr>
                                    <tr style="border-top: 1px solid #e0e0e0;">
                                        <td style="padding: 12px 0 0; color: #333333; font-size: 16px; font-weight: bold;">Total:</td>
                                        <td style="padding: 12px 0 0; color: #FFB833; font-size: 18px; font-weight: bold; text-align: right;">R$ ${price}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                Seu serviço será ativado em breve. Você receberá as credenciais de acesso por e-mail assim que o processo de provisionamento for concluído.
                            </p>
                            
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/client-dashboard/services" 
                                   style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #FFB833 0%, #FFA500 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Ver Meus Serviços
                                </a>
                            </div>
                            
                            <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Se você tiver alguma dúvida sobre sua compra, entre em contato com nosso suporte.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                                © 2025-2026 HostEver. Todos os direitos reservados.<br>
                                São Paulo, Brasil
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'HostEver'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: userEmail,
      subject: `Confirmação de Compra - Pedido #${orderId}`,
      html: template
    });
    return true;
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return false;
  }
};

export const testEmailConnection = async () => {
  if (!transporter) {
    return { success: false, message: 'Email service not initialized' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'SMTP connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
