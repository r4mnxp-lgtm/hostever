# Guia de Configuração Inicial - HostEver

## Problemas Resolvidos

### ✅ CORS Corrigido
- Atualizado configuração do CORS para aceitar todas as origens em desenvolvimento
- Removida dependência de variável `ORIGINS` no .env

### ✅ Sistema de Verificação de E-mail
- E-mails de cadastro agora requerem confirmação
- Token de verificação válido por 24 horas
- Alerta no painel do cliente caso e-mail não verificado
- Botão para reenviar e-mail de verificação

### ✅ Melhorias no Cadastro
- ✅ Barra animada de força de senha
- ✅ Confirmação de e-mail (digitar 2x)
- ✅ Validação em tempo real
- ✅ Requisitos de senha visíveis

### ✅ Página de Login
- Placeholder do e-mail atualizado: `usuario@exemplo.com`

## Como Criar o Primeiro Administrador

### Opção 1: Interface Web (Recomendado)

1. Acesse: `http://localhost:5173/setup`
2. Preencha os dados do administrador:
   - Nome completo
   - E-mail
   - Senha forte (mínimo 8 caracteres)
   - Confirme a senha
3. Clique em "Criar Administrador"
4. Você será redirecionado para a página de login

**Importante:** Esta página só funciona se não existir nenhum administrador no banco. Após criar o primeiro admin, a página redireciona automaticamente para o login.

### Opção 2: API Direta

Use esta opção se preferir criar via API ou script:

```bash
curl -X POST http://localhost:3001/api/setup/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Administrador",
    "email": "admin@hostever.com",
    "password": "SenhaForte123!"
  }'
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Administrador criado com sucesso!",
  "userId": 1
}
```

## Instalação Completa

### 1. Executar Migração do Banco

```bash
mysql -u root -p hostever_db < c:\Users\Ramon\Desktop\HostEver\backend\database\MIGRATION_2026.sql
```

Ou execute manualmente no seu cliente MySQL.

### 2. Instalar Dependências

```bash
cd c:\Users\Ramon\Desktop\HostEver\backend
npm install
```

### 3. Configurar Variáveis de Ambiente (Opcional)

Crie ou edite `backend/.env`:

```env
# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=hostever_db

# Frontend URL (para links nos e-mails)
FRONTEND_URL=http://localhost:5173

# SMTP (pode ser configurado depois pela interface admin)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=HostEver
```

### 4. Iniciar Servidores

**Backend:**
```bash
cd c:\Users\Ramon\Desktop\HostEver\backend
npm start
```

**Frontend:**
```bash
cd c:\Users\Ramon\Desktop\HostEver\frontend
npm run dev
```

### 5. Criar Primeiro Administrador

Acesse: `http://localhost:5173/setup`

## Próximos Passos

Após criar o administrador:

1. **Faça login** em `/login`
2. **Altere sua senha** em `/admin-dashboard/account`
3. **Configure o SMTP** em `/admin-dashboard/settings` para envio de e-mails
4. **Adicione outros admins** em `/admin-dashboard/admins` (se necessário)
5. **Configure serviços de status** em `/admin-dashboard/status`

## Fluxo de Cadastro de Clientes

1. Cliente se cadastra em `/register`
2. Sistema envia e-mail de confirmação
3. Cliente confirma e-mail clicando no link recebido
4. E-mail é validado e cliente tem acesso total
5. Se não confirmar, aparece alerta no dashboard com opção de reenviar

## Novas Rotas Adicionadas

### Backend
- `GET /api/setup/check-setup` - Verifica se precisa criar admin
- `POST /api/setup/create-first-admin` - Cria primeiro admin
- `POST /api/auth/verify-email` - Verifica e-mail com token
- `POST /api/auth/resend-verification` - Reenvia e-mail de verificação

### Frontend
- `/setup` - Página de configuração inicial
- `/verify-email?token=xxx` - Página de verificação de e-mail

## Segurança

⚠️ **Importante para Produção:**

1. Altere `JWT_SECRET` para uma chave forte e única
2. Use HTTPS em produção
3. Configure SMTP com credenciais seguras
4. Faça backups regulares do banco de dados
5. Revise as permissões dos administradores periodicamente

## Solução de Problemas

### Erro de CORS
- Já está resolvido na nova configuração
- O backend aceita requisições de qualquer origem em desenvolvimento

### E-mails não estão sendo enviados
- Configure o SMTP em `/admin-dashboard/settings`
- Verifique se o `nodemailer` está instalado: `npm install nodemailer`
- Teste a conexão SMTP pela interface administrativa

### Não consigo criar o primeiro admin
- Verifique se já existe algum admin no banco: `SELECT * FROM users WHERE role = 'admin'`
- Se existir, use a página de gerenciamento de admins
- Se não existir, use a página `/setup` ou a API direta

## Suporte

Em caso de problemas:
1. Verifique os logs do backend no terminal
2. Verifique o console do navegador (F12)
3. Confirme que o banco de dados está acessível
4. Certifique-se que as migrações foram executadas

---

**HostEver** - Sistema de Hospedagem Premium  
2025-2026 | São Paulo, Brasil
