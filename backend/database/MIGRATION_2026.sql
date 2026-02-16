-- Script de migração para adicionar funcionalidades de administração e configurações
-- Execute este script no seu banco de dados MySQL

-- 1. Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    smtp_host VARCHAR(255),
    smtp_port INT,
    smtp_secure BOOLEAN DEFAULT TRUE,
    smtp_user VARCHAR(255),
    smtp_password VARCHAR(255),
    smtp_from_email VARCHAR(255),
    smtp_from_name VARCHAR(255) DEFAULT 'HostEver',
    company_name VARCHAR(255) DEFAULT 'HostEver',
    company_email VARCHAR(255),
    company_phone VARCHAR(50),
    support_email VARCHAR(255),
    founded_year VARCHAR(4) DEFAULT '2025',
    founded_location VARCHAR(255) DEFAULT 'São Paulo, Brasil',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Adicionar colunas de categoria e permissões na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS admin_category VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS permissions JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS email_verification_expires DATETIME DEFAULT NULL;

-- Marcar admins existentes como verificados
UPDATE users SET email_verified = TRUE WHERE role = 'admin';

-- 3. Inserir configurações padrão
INSERT INTO system_settings (id, company_name, founded_year, founded_location) 
VALUES (1, 'HostEver', '2025', 'São Paulo, Brasil')
ON DUPLICATE KEY UPDATE id=id;

-- 4. Atualizar estrutura da tabela status_services se necessário
-- Certificar que a tabela existe com as colunas corretas
CREATE TABLE IF NOT EXISTS status_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM('operational', 'degraded', 'outage', 'maintenance') DEFAULT 'operational',
    description TEXT,
    url VARCHAR(500),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Inserir serviços padrão para a página de status (apenas se não existirem)
INSERT IGNORE INTO status_services (name, category, status, location) VALUES
('Website HostEver', 'Website', 'operational', 'Global'),
('Painel do Cliente', 'Platform', 'operational', 'Global'),
('API de Provisionamento', 'API', 'operational', 'São Paulo, BR'),
('Servidor VPS BR-SP-01', 'Infrastructure', 'operational', 'São Paulo, BR'),
('Servidor VPS US-NY-01', 'Infrastructure', 'operational', 'New York, US');

-- Migração concluída!
SELECT 'Migração executada com sucesso!' as status;
