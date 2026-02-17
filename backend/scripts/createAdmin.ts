import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function createAdmin() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conectado ao banco de dados!');
    
    const email = 'admin@hostever.com';
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Verificar se admin existe
    const [existing] = await connection.query(
      'SELECT id, email, role FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // Atualizar senha
      await connection.query(
        'UPDATE users SET password_hash = ?, role = ? WHERE email = ?',
        [passwordHash, 'admin', email]
      );
      console.log('\n✅ Senha do admin ATUALIZADA com sucesso!');
    } else {
      // Criar admin
      await connection.query(
        `INSERT INTO users (name, email, password_hash, role, status, accepted_terms, accepted_terms_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        ['Administrador', email, passwordHash, 'admin', 'active', true]
      );
      console.log('\n✅ Usuário admin CRIADO com sucesso!');
    }

    console.log('\n====================================');
    console.log('   CREDENCIAIS DE ACESSO ADMIN');
    console.log('====================================');
    console.log('Email: admin@hostever.com');
    console.log('Senha: admin123');
    console.log('====================================');
    console.log('\nAcesse: http://localhost:3000/login');
    console.log('Após login, será redirecionado para /admin-dashboard\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar/atualizar admin:');
    console.error('Mensagem:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
