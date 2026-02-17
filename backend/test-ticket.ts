import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testTicketCreation() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('✅ Conectado ao banco de dados');
    
    // Testar criação de ticket
    console.log('\n📝 Testando criação de ticket...');
    const [result] = await connection.query(
      `INSERT INTO tickets 
      (user_id, service_id, subject, priority, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [5, null, 'Teste de Ticket', 'medium', 'open']
    );
    
    const ticketId = result.insertId;
    console.log(`✅ Ticket criado com ID: ${ticketId}`);
    
    // Testar adição de reply
    console.log('\n💬 Testando adição de resposta...');
    await connection.query(
      `INSERT INTO ticket_replies 
      (ticket_id, user_id, message, is_staff, created_at) 
      VALUES (?, ?, ?, ?, NOW())`,
      [ticketId, 5, 'Mensagem de teste', false]
    );
    console.log('✅ Resposta adicionada com sucesso');
    
    // Deletar teste
    console.log('\n🗑️ Limpando dados de teste...');
    await connection.query('DELETE FROM ticket_replies WHERE ticket_id = ?', [ticketId]);
    await connection.query('DELETE FROM tickets WHERE id = ?', [ticketId]);
    console.log('✅ Dados de teste removidos');
    
    console.log('\n✅ Todos os testes passaram!\n');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await connection.end();
  }
}

testTicketCreation();
