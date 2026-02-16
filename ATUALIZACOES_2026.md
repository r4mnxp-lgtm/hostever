# Atualizações do Sistema HostEver - Fevereiro 2026

## Mudanças Implementadas

### 1. Ajustes Visuais
- ✅ Botões de contratação agora usam o padrão de cores oficial (gradiente amarelo/laranja)
- ✅ Dados de faturamento zerados na dashboard administrativa

### 2. Sistema de E-mails
- ✅ Criado serviço de envio de e-mails com templates HTML
- ✅ E-mail de boas-vindas ao cadastrar novo usuário
- ✅ E-mail de confirmação de compra
- ✅ Página administrativa para configurar SMTP

### 3. Configurações do Sistema
- ✅ Nova página de configurações com:
  - Configuração de servidor SMTP
  - Dados da empresa (nome, telefone, e-mails, fundação)
  - Interface intuitiva para gerenciar configurações

### 4. Gerenciamento de Administradores
- ✅ Sistema de categorias de administradores:
  - **Diretores**: Acesso total ao sistema
  - **Gerentes**: Acesso a serviços, clientes, faturamento, tickets e status
  - **Técnicos**: Acesso a serviços, tickets e status
  - **CS (Atendimento)**: Acesso apenas a tickets e visualização de clientes
- ✅ Página para criar, editar e remover administradores
- ✅ Sistema de permissões baseado em JSON

### 5. Configurações de Conta do Admin
- ✅ Página para alterar dados da conta administrativa
- ✅ Alteração de senha com validação
- ✅ Atualização de nome e e-mail

### 6. Gerenciamento de Serviços de Status
- ✅ Página para adicionar/remover serviços na página de status pública
- ✅ Controle de status em tempo real (Operacional, Degradado, Fora do Ar, Manutenção)
- ✅ Categorização por tipo (Website, Platform, API, Infrastructure, etc.)
- ✅ Serviços padrão pré-configurados

### 7. Sandbox Ocultado
- ✅ Funcionalidade Sandbox removida dos menus (ainda existe no código)
- ✅ Pode ser reativada quando estiver pronta para produção

## Instalação das Atualizações

### Passo 1: Instalar Dependências do Backend

Abra o PowerShell como Administrador e execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois, no terminal normal:

```bash
cd c:\Users\Ramon\Desktop\HostEver\backend
npm install nodemailer
```

### Passo 2: Executar Migração do Banco de Dados

Execute o arquivo SQL no seu banco de dados MySQL:

```bash
mysql -u root -p hostever_db < c:\Users\Ramon\Desktop\HostEver\backend\database\MIGRATION_2026.sql
```

Ou copie e cole o conteúdo do arquivo `backend/database/MIGRATION_2026.sql` no seu cliente MySQL (phpMyAdmin, MySQL Workbench, etc.)

### Passo 3: Configurar Variáveis de Ambiente (Opcional)

Adicione no arquivo `backend/.env`:

```env
# Configurações de E-mail (podem ser configuradas pela interface admin)
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASSWORD=suasenha
SMTP_FROM_EMAIL=noreply@hostever.com
SMTP_FROM_NAME=HostEver

# URL do Frontend (para links nos e-mails)
FRONTEND_URL=http://localhost:5173
```

### Passo 4: Reiniciar os Servidores

```bash
# Backend
cd c:\Users\Ramon\Desktop\HostEver\backend
npm start

# Frontend (em outro terminal)
cd c:\Users\Ramon\Desktop\HostEver\frontend
npm run dev
```

## Novas Rotas da API

### Configurações do Sistema
- `GET /api/admin/settings` - Obter configurações
- `POST /api/admin/settings/smtp` - Salvar configurações SMTP
- `POST /api/admin/settings/company` - Salvar dados da empresa
- `POST /api/admin/settings/smtp/test` - Testar conexão SMTP

### Gerenciamento de Administradores
- `GET /api/admin/users/admins` - Listar administradores
- `POST /api/admin/users/create-admin` - Criar administrador
- `PUT /api/admin/users/:id/category` - Atualizar categoria
- `DELETE /api/admin/users/:id` - Remover administrador

### Conta do Administrador
- `POST /api/admin/change-password` - Alterar senha
- `POST /api/admin/update-account` - Atualizar dados da conta

### Serviços de Status
- `GET /api/status/services` - Listar serviços
- `POST /api/status/services` - Criar serviço
- `PUT /api/status/services/:id/status` - Atualizar status
- `DELETE /api/status/services/:id` - Remover serviço

## Novas Páginas no Admin

1. **/admin-dashboard/settings** - Configurações do Sistema
2. **/admin-dashboard/admins** - Gerenciamento de Administradores
3. **/admin-dashboard/account** - Configurações da Conta
4. **/admin-dashboard/status** - Gerenciamento de Serviços de Status

## Segurança

### Importante para Produção:
1. Altere a senha da conta administrativa padrão
2. Configure SMTP com credenciais seguras
3. Use HTTPS em produção
4. Defina JWT_SECRET forte no .env
5. Configure backups regulares do banco de dados

## Próximos Passos Recomendados

1. Configure o servidor SMTP na página de configurações
2. Teste o envio de e-mails
3. Crie contas administrativas para sua equipe
4. Configure os serviços na página de status
5. Altere os dados da conta administrativa padrão

## Suporte

Em caso de dúvidas ou problemas, verifique:
- Logs do backend no terminal
- Console do navegador (F12)
- Conexão com banco de dados
- Configurações de SMTP

---

**Fundação HostEver**: 2025 - São Paulo, Brasil  
**Expansão**: 2026 - Estados Unidos
