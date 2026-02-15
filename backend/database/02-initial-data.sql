-- HostEver Initial Data
-- Dados iniciais e configurações padrão

SET NAMES utf8mb4;

-- Inserir usuário administrador padrão
-- Senha padrão: admin123 (TROCAR IMEDIATAMENTE APÓS PRIMEIRO LOGIN)
INSERT INTO users (name, email, password_hash, role, status, accepted_terms, accepted_terms_at) VALUES 
('Administrador', 'admin@hostever.com', '$2b$10$ykfK.tUZiurVgolUnqctBuRvfyP3Msggoj3bjGxNNuOzUL1klW44C', 'admin', 'active', TRUE, NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Inserir serviços de status padrão
INSERT INTO status_services (name, description, status, display_order) VALUES
('VPS Cloud', 'Servidores VPS Cloud (Brasil)', 'operational', 1),
('VPS Cloud USA', 'Servidores VPS Cloud (Estados Unidos)', 'operational', 2),
('VPS Games', 'Servidores VPS para Games', 'operational', 3),
('Servidores Dedicados', 'Servidores Dedicados', 'operational', 4),
('Painel de Controle', 'Painel de Controle do Cliente', 'operational', 5),
('Website', 'Site Principal e API', 'operational', 6)
ON DUPLICATE KEY UPDATE name=name;

-- Log inicial do sistema
INSERT INTO activity_logs (user_id, action, entity_type, description, ip_address) VALUES 
(NULL, 'system_init', 'system', 'Sistema inicializado com sucesso', '127.0.0.1');
