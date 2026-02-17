import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hostever',
    multipleStatements: true
  });

  try {
    console.log('🔄 Executando migrações...\n');

    // 1. Migração de campos de endereço
    console.log('1️⃣ Adicionando campos de endereço na tabela users...');
    const usersMigration = fs.readFileSync(
      path.join(__dirname, '../database/migrate-users-address.sql'),
      'utf8'
    );
    await connection.query(usersMigration);
    console.log('✅ Campos de endereço adicionados\n');

    // 2. Migração de ticket_replies
    console.log('2️⃣ Criando/atualizando tabela ticket_replies...');
    const ticketsMigration = fs.readFileSync(
      path.join(__dirname, '../database/migrate-ticket-replies.sql'),
      'utf8'
    );
    await connection.query(ticketsMigration);
    console.log('✅ Tabela ticket_replies configurada\n');

    console.log('✨ Todas as migrações foram executadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();
