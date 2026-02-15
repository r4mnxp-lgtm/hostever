import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log('✅ Conectado ao banco de dados!');
    console.log('🔄 Criando tabelas...\n');

    // Criar tabela users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        cpf_cnpj VARCHAR(20),
        
        cep VARCHAR(10),
        street VARCHAR(255),
        number VARCHAR(20),
        complement VARCHAR(100),
        neighborhood VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(2),
        country VARCHAR(50) DEFAULT 'Brasil',
        
        accepted_terms BOOLEAN DEFAULT FALSE,
        accepted_terms_at TIMESTAMP NULL,
        
        role ENUM('client', 'admin', 'executive') DEFAULT 'client',
        status ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_cpf_cnpj (cpf_cnpj),
        INDEX idx_role (role),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela users criada');

    // Criar tabela services
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_type VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        specifications JSON,
        price DECIMAL(10, 2) NOT NULL,
        billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
        status ENUM('pending', 'active', 'suspended', 'terminated') DEFAULT 'pending',
        location VARCHAR(10) DEFAULT 'br',
        vps_id VARCHAR(100),
        ip_address VARCHAR(50),
        next_due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_vps_id (vps_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela services criada');

    // Criar tabela invoices
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_id INT,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
        due_date DATE NOT NULL,
        paid_at TIMESTAMP NULL,
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_due_date (due_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela invoices criada');

    // Criar tabela tickets
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_id INT,
        subject VARCHAR(255) NOT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('open', 'in_progress', 'waiting_customer', 'closed') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        closed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_priority (priority)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela tickets criada');

    // Criar tabela ticket_replies
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ticket_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_staff BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_ticket_id (ticket_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela ticket_replies criada');

    // Criar tabela activity_logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INT,
        description TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela activity_logs criada');

    // Verificar se admin já existe
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@hostever.com']
    );

    if (existing.length === 0) {
      await connection.query(
        `INSERT INTO users (name, email, password_hash, role, accepted_terms) 
         VALUES (?, ?, ?, ?, ?)`,
        ['Administrador', 'admin@hostever.com', '$2b$10$8JZ2rFqGH6mXKxZqGfD0zePw0cYxYqXK4rFqGH6mXKxZqGfD0zePw', 'admin', true]
      );
      console.log('✅ Usuário admin criado (admin@hostever.com / senha: admin123)');
    } else {
      console.log('⚠️  Usuário admin já existe');
    }

    console.log('\n====================================');
    console.log('✅ Banco de dados criado com sucesso!');
    console.log('====================================\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar banco de dados:');
    console.error('Mensagem:', error.message);
    console.error('\nVerifique se:');
    console.error('1. O arquivo .env está configurado corretamente');
    console.error('2. As credenciais do banco estão corretas');
    console.error('3. Você tem permissões para criar tabelas\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();
