import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function forceCreateAdmin() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conectado!');
    
    // DELETAR admin antigo
    await connection.query('DELETE FROM users WHERE email = ?', ['admin@hostever.com']);
    console.log('🗑️  Admin antigo deletado');
    
    // Criar senha correta
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Criar novo admin
    const [result] = await connection.query(
      `INSERT INTO users (name, email, password_hash, role, status, accepted_terms, accepted_terms_at, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['Administrador', 'admin@hostever.com', passwordHash, 'admin', 'active', true]
    );

    console.log('\n✅ ADMIN CRIADO COM SUCESSO!\n');
    console.log('====================================');
    console.log('   CREDENCIAIS DE ACESSO');
    console.log('====================================');
    console.log('Email: admin@hostever.com');
    console.log('Senha: admin123');
    console.log('====================================');
    console.log('\nID criado:', result.insertId);
    console.log('\nAcesse: http://localhost:3000/login\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

forceCreateAdmin();
