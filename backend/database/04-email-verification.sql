-- Adicionar sistema de verificação de e-mail

-- Adicionar coluna de verificação de e-mail
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires DATETIME DEFAULT NULL;

-- Marcar admins existentes como verificados
UPDATE users SET email_verified = TRUE WHERE role = 'admin';

SELECT 'Sistema de verificação de e-mail adicionado!' as status;
