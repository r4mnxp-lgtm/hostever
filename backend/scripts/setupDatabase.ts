import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || '69.166.232.50',
  port: parseInt(process.env.DB_PORT || '16640'),
  user: process.env.DB_USER || 'doadmin',
  password: process.env.DB_PASSWORD || 'AVNS_xyTIj45xOBuNF_kk-Q7',
  database: process.env.DB_NAME || 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔗 Conectando ao banco de dados...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado com sucesso!\n');

    // Ler o schema SQL
    console.log('📄 Lendo schema SQL...');
    const schemaPath = join(__dirname, '../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Dividir em comandos individuais
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📦 Executando ${commands.length} comandos SQL...\n`);

    for (const command of commands) {
      if (command.toLowerCase().includes('create table')) {
        const tableName = command.match(/create table (?:if not exists )?`?(\w+)`?/i)?.[1];
        console.log(`   Creating table: ${tableName}`);
      }
      await connection.query(command);
    }

    console.log('\n✅ Todas as tabelas criadas com sucesso!\n');

    // Criar usuário admin
    console.log('👤 Criando usuário administrador...');
    const adminEmail = 'admin@hostever.com.br';
    const adminPassword = 'Admin@HostEver2024';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin já existe, pulando criação...');
    } else {
      await connection.query(
        `INSERT INTO users (name, email, password_hash, phone, cpf_cnpj, role, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Administrador HostEver', adminEmail, passwordHash, '(11) 99999-9999', '00000000000', 'admin', 'active']
      );
      console.log('✅ Admin criado com sucesso!');
    }

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║     CREDENCIAIS DE PRIMEIRO ACESSO       ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Email: ${adminEmail.padEnd(30)}║`);
    console.log(`║  Senha: ${adminPassword.padEnd(30)}║`);
    console.log('║                                          ║');
    console.log('║  ⚠️  IMPORTANTE: Altere a senha após     ║');
    console.log('║     o primeiro login!                    ║');
    console.log('╚══════════════════════════════════════════╝\n');

    console.log('🎉 Instalação concluída com sucesso!\n');
    console.log('Agora você pode:');
    console.log('1. Iniciar o backend: npm start');
    console.log('2. Acessar: http://localhost:3001/api/health');
    console.log('3. Login: http://localhost:3000/login\n');

  } catch (error) {
    console.error('❌ Erro durante a instalação:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Não foi possível conectar ao banco de dados.');
      console.error('   Verifique se as credenciais estão corretas no arquivo .env');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
