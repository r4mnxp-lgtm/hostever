import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function addTicketAttachments() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('✅ Conectado ao banco de dados');
    
    const sql = fs.readFileSync(
      path.join(process.cwd(), 'database', 'add-ticket-attachments.sql'),
      'utf8'
    );
    
    console.log('\n📝 Adicionando coluna attachment em ticket_replies...');
    await connection.query(sql);
    console.log('✅ Coluna attachment adicionada com sucesso');
    
    console.log('\n✅ Migração concluída!\n');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ Coluna attachment já existe');
    } else {
      console.error('❌ Erro na migração:', error.message);
    }
  } finally {
    await connection.end();
  }
}

addTicketAttachments();
