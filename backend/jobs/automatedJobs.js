import cron from 'node-cron';
import { getOverdueInvoices } from '../models/invoiceModel.js';
import { getServiceById, suspendService } from '../models/serviceModel.js';
import { suspendVPSInVirtualizor } from '../routes/virtualizor.js';
import { createActivityLog } from '../models/activityLogModel.js';

export function startAutomatedJobs() {
  console.log('🤖 Iniciando tarefas automatizadas da Hostever...');
  
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ Verificando faturas vencidas...');
    await checkAndSuspendOverdueServices();
  });
  
  console.log('✅ Tarefas automatizadas configuradas');
}

async function checkAndSuspendOverdueServices() {
  try {
    const overdueInvoices = await getOverdueInvoices();
    
    console.log(`📋 Encontradas ${overdueInvoices.length} faturas vencidas`);
    
    for (const invoice of overdueInvoices) {
      if (!invoice.service_id) continue;
      
      const service = await getServiceById(invoice.service_id);
      
      if (!service || service.status === 'suspended' || service.status === 'cancelled') {
        continue;
      }
      
      const daysSinceOverdue = Math.floor(
        (new Date() - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceOverdue >= 3) {
        console.log(`⚠️ Suspendendo serviço ${service.id} - Fatura ${invoice.id} vencida há ${daysSinceOverdue} dias`);
        
        try {
          if (service.virtualizor_vps_id) {
            await suspendVPSInVirtualizor(service.virtualizor_vps_id);
          }
          
          await suspendService(service.id);
          
          await createActivityLog({
            user_id: service.user_id,
            action: 'service_auto_suspended',
            entity_type: 'service',
            entity_id: service.id,
            description: `Serviço suspenso automaticamente por fatura vencida (ID: ${invoice.id}, ${daysSinceOverdue} dias)`,
          });
          
        } catch (error) {
          console.error(`❌ Erro ao suspender serviço ${service.id}:`, error);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar faturas vencidas:', error);
  }
}
