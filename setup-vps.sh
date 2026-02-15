#!/bin/bash

set -e

echo "=========================================="
echo "  HostEver - Instalação Completa em VPS  "
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para log
log_info() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[→]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then 
    log_warn "Não rode este script como root. Use um usuário com sudo."
    exit 1
fi

echo "Este script irá instalar tudo que é necessário para rodar o HostEver."
echo ""
read -p "Pressione ENTER para continuar ou CTRL+C para cancelar..."
echo ""

# ==========================================
# 1. ATUALIZAR SISTEMA
# ==========================================
log_step "Atualizando sistema..."
sudo apt update -y && sudo apt upgrade -y
log_info "Sistema atualizado"
echo ""

# ==========================================
# 2. INSTALAR DEPENDÊNCIAS BÁSICAS
# ==========================================
log_step "Instalando dependências básicas..."
sudo apt install -y curl wget git build-essential software-properties-common ufw
log_info "Dependências básicas instaladas"
echo ""

# ==========================================
# 3. INSTALAR NODE.JS
# ==========================================
log_step "Instalando Node.js 18 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    log_info "Node.js $(node -v) instalado"
else
    log_info "Node.js já instalado: $(node -v)"
fi
echo ""

# ==========================================
# 4. INSTALAR PM2
# ==========================================
log_step "Instalando PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    log_info "PM2 instalado"
else
    log_info "PM2 já instalado"
fi
echo ""

# ==========================================
# 5. INSTALAR MYSQL
# ==========================================
log_step "Instalando MySQL Server..."
if ! command -v mysql &> /dev/null; then
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    log_info "MySQL instalado"
    echo ""
    log_warn "IMPORTANTE: Execute 'sudo mysql_secure_installation' após a instalação para configurar a senha root"
else
    log_info "MySQL já instalado"
fi
echo ""

# ==========================================
# 6. INSTALAR NGINX
# ==========================================
log_step "Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    log_info "Nginx instalado"
else
    log_info "Nginx já instalado"
fi
echo ""

# ==========================================
# 7. CONFIGURAR FIREWALL
# ==========================================
log_step "Configurando firewall UFW..."
sudo ufw --force enable
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
log_info "Firewall configurado"
echo ""

# ==========================================
# 8. CLONAR REPOSITÓRIO
# ==========================================
log_step "Configurando projeto HostEver..."
echo ""
read -p "URL do repositório GitHub: " REPO_URL

if [ -z "$REPO_URL" ]; then
    log_error "URL do repositório é obrigatória!"
    exit 1
fi

if [ -d "/var/www/hostever" ]; then
    log_warn "Diretório /var/www/hostever já existe"
    read -p "Deseja remover e clonar novamente? (s/n): " REMOVE_DIR
    if [ "$REMOVE_DIR" = "s" ] || [ "$REMOVE_DIR" = "S" ]; then
        sudo rm -rf /var/www/hostever
    else
        log_error "Instalação cancelada"
        exit 1
    fi
fi

sudo mkdir -p /var/www
cd /var/www
sudo git clone $REPO_URL hostever
sudo chown -R $USER:$USER /var/www/hostever
cd /var/www/hostever
log_info "Repositório clonado"
echo ""

# ==========================================
# 9. CONFIGURAR MYSQL DATABASE
# ==========================================
log_step "Configurando banco de dados MySQL..."
echo ""
read -p "Usuário MySQL root (padrão: root): " MYSQL_ROOT_USER
MYSQL_ROOT_USER=${MYSQL_ROOT_USER:-root}

read -sp "Senha do usuário root MySQL: " MYSQL_ROOT_PASS
echo ""

read -p "Nome do banco de dados (padrão: hostever): " DB_NAME
DB_NAME=${DB_NAME:-hostever}

read -p "Criar novo usuário MySQL para o projeto? (s/n): " CREATE_USER
if [ "$CREATE_USER" = "s" ] || [ "$CREATE_USER" = "S" ]; then
    read -p "Nome do usuário MySQL: " MYSQL_USER
    read -sp "Senha do usuário MySQL: " MYSQL_PASS
    echo ""
else
    MYSQL_USER=$MYSQL_ROOT_USER
    MYSQL_PASS=$MYSQL_ROOT_PASS
fi

log_step "Criando banco de dados..."
if [ "$CREATE_USER" = "s" ] || [ "$CREATE_USER" = "S" ]; then
    sudo mysql -u $MYSQL_ROOT_USER -p$MYSQL_ROOT_PASS << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$MYSQL_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
else
    sudo mysql -u $MYSQL_ROOT_USER -p$MYSQL_ROOT_PASS << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
fi

log_info "Banco de dados $DB_NAME criado"

# Executar migrations
if [ -f "backend/database/01-schema.sql" ]; then
    log_step "Executando schema SQL..."
    sudo mysql -u $MYSQL_USER -p$MYSQL_PASS $DB_NAME < backend/database/01-schema.sql
    log_info "Schema criado"
fi

if [ -f "backend/database/02-initial-data.sql" ]; then
    log_step "Executando dados iniciais..."
    sudo mysql -u $MYSQL_USER -p$MYSQL_PASS $DB_NAME < backend/database/02-initial-data.sql
    log_info "Dados iniciais inseridos"
fi
echo ""

# ==========================================
# 10. CONFIGURAR VARIÁVEIS DE AMBIENTE
# ==========================================
log_step "Configurando variáveis de ambiente do Backend..."
echo ""

read -p "Porta do Backend (padrão: 3001): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-3001}

read -p "URL do Frontend (ex: https://hostever.com): " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}

read -p "MercadoPago Access Token (deixe vazio para preencher depois): " MP_TOKEN
MP_TOKEN=${MP_TOKEN:-your_mercadopago_access_token_here}

read -p "Virtualizor Host (deixe vazio para preencher depois): " VIRT_HOST
VIRT_HOST=${VIRT_HOST:-https://panel.hostever.com:4083}

read -p "Virtualizor API Key (deixe vazio para preencher depois): " VIRT_KEY
VIRT_KEY=${VIRT_KEY:-your_virtualizor_api_key}

read -p "Virtualizor API Pass (deixe vazio para preencher depois): " VIRT_PASS
VIRT_PASS=${VIRT_PASS:-your_virtualizor_api_pass}

cat > backend/.env << EOF
PORT=$BACKEND_PORT

# MySQL Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASS
MYSQL_DATABASE=$DB_NAME

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=$MP_TOKEN

# Frontend URL
VITE_APP_URL=$FRONTEND_URL

# Virtualizor
VITE_VIRTUALIZOR_HOST=$VIRT_HOST
VITE_VIRTUALIZOR_API_KEY=$VIRT_KEY
VITE_VIRTUALIZOR_API_PASS=$VIRT_PASS
EOF

log_info "Arquivo backend/.env criado"
echo ""

# ==========================================
# 11. INSTALAR DEPENDÊNCIAS
# ==========================================
log_step "Instalando dependências do Backend..."
cd backend
npm install
cd ..
log_info "Dependências do Backend instaladas"
echo ""

log_step "Instalando dependências do Frontend..."
cd frontend
npm install
log_info "Dependências do Frontend instaladas"
echo ""

# ==========================================
# 12. BUILD DO FRONTEND
# ==========================================
log_step "Fazendo build do Frontend..."
npm run build
cd ..
log_info "Build do Frontend concluído"
echo ""

# ==========================================
# 13. CRIAR DIRETÓRIOS NECESSÁRIOS
# ==========================================
log_step "Criando diretórios necessários..."
mkdir -p backend/uploads
mkdir -p backend/sandbox-storage
mkdir -p backend/sandbox-temp
chmod -R 775 backend/uploads
chmod -R 775 backend/sandbox-storage
chmod -R 775 backend/sandbox-temp
log_info "Diretórios criados"
echo ""

# ==========================================
# 14. CONFIGURAR PM2
# ==========================================
log_step "Configurando PM2 para o Backend..."
pm2 delete hostever-backend 2>/dev/null || true
pm2 start backend/server.js --name hostever-backend
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
log_info "PM2 configurado"
echo ""

# ==========================================
# 15. CONFIGURAR NGINX
# ==========================================
log_step "Configurando Nginx..."
echo ""
read -p "Domínio do projeto (ex: hostever.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    log_warn "Domínio não informado. Pulando configuração do Nginx."
else
    sudo tee /etc/nginx/sites-available/hostever > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 100M;

    # Frontend (arquivos estáticos)
    location / {
        root /var/www/hostever/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/hostever /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t && sudo systemctl reload nginx
    log_info "Nginx configurado para $DOMAIN"
    echo ""

    # ==========================================
    # 16. INSTALAR SSL
    # ==========================================
    read -p "Deseja instalar SSL com Let's Encrypt agora? (s/n): " INSTALL_SSL
    if [ "$INSTALL_SSL" = "s" ] || [ "$INSTALL_SSL" = "S" ]; then
        if ! command -v certbot &> /dev/null; then
            log_step "Instalando Certbot..."
            sudo apt install -y certbot python3-certbot-nginx
        fi
        
        log_step "Instalando certificado SSL..."
        read -p "Email para notificações do Let's Encrypt: " SSL_EMAIL
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $SSL_EMAIL
        log_info "SSL instalado com sucesso"
        
        # Auto-renovação
        sudo systemctl enable certbot.timer
        log_info "Auto-renovação de SSL configurada"
    fi
fi
echo ""

# ==========================================
# 17. CRIAR USUÁRIO ADMIN
# ==========================================
log_step "Criando usuário administrador..."
echo ""
read -p "Deseja criar um usuário admin agora? (s/n): " CREATE_ADMIN
if [ "$CREATE_ADMIN" = "s" ] || [ "$CREATE_ADMIN" = "S" ]; then
    cd backend
    node scripts/createAdmin.js
    cd ..
    log_info "Usuário admin criado"
else
    log_warn "Lembre-se de criar um usuário admin depois com: cd /var/www/hostever/backend && node scripts/createAdmin.js"
fi
echo ""

# ==========================================
# 18. FINALIZAÇÃO
# ==========================================
echo ""
echo "=========================================="
echo -e "${GREEN}  ✓ Instalação Completa!${NC}"
echo "=========================================="
echo ""
log_info "HostEver instalado e configurado com sucesso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}INFORMAÇÕES DO SISTEMA:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Diretório: /var/www/hostever"
echo "Backend: http://localhost:$BACKEND_PORT"
if [ ! -z "$DOMAIN" ]; then
    echo "Frontend: http://$DOMAIN"
fi
echo "Banco de dados: $DB_NAME"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}COMANDOS ÚTEIS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Ver logs do backend:"
echo "  pm2 logs hostever-backend"
echo ""
echo "Reiniciar backend:"
echo "  pm2 restart hostever-backend"
echo ""
echo "Status do backend:"
echo "  pm2 status"
echo ""
echo "Criar usuário admin:"
echo "  cd /var/www/hostever/backend && node scripts/createAdmin.js"
echo ""
echo "Editar variáveis de ambiente:"
echo "  nano /var/www/hostever/backend/.env"
echo "  pm2 restart hostever-backend"
echo ""
echo "Recarregar Nginx:"
echo "  sudo systemctl reload nginx"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}PRÓXIMOS PASSOS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Configure o MercadoPago e Virtualizor no arquivo .env"
echo "2. Reinicie o backend: pm2 restart hostever-backend"
if [ -z "$DOMAIN" ]; then
    echo "3. Configure o Nginx com seu domínio"
    echo "4. Instale SSL com: sudo certbot --nginx"
fi
echo ""
echo -e "${GREEN}Instalação concluída! Acesse o sistema e comece a usar.${NC}"
echo ""
