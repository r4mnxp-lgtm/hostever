
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextBrowserLanguagedetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      // Auth
      "auth.login": "Entrar",
      "auth.register": "Cadastre-se",
      "auth.logout": "Sair",
      "auth.email": "Email",
      "auth.password": "Senha",
      "auth.forgotPassword": "Esqueceu a senha?",
      "auth.signIn": "Acessar Conta",
      "auth.signingIn": "Entrando...",
      "auth.welcomeBack": "Bem-vindo de volta",
      "auth.accessAccount": "Acesse sua conta para continuar",
      "auth.noAccount": "Não tem uma conta?",
      "auth.createAccount": "Criar conta",
      "auth.invalidCredentials": "Credenciais inválidas. Verifique seu email e senha.",
      "auth.loginSuccess": "Login realizado com sucesso!",
      "auth.registerSuccess": "Cadastro realizado! Verifique seu email.",
      "auth.error": "Ocorreu um erro. Tente novamente.",

      // Navbar
      "nav.home": "Início",
      "nav.products": "Produtos",
      "nav.hosting": "Hospedagem",
      "nav.vps": "VPS Cloud",
      "nav.email": "Email Profissional",
      "nav.domains": "Domínios",
      "nav.about": "Sobre",
      "nav.blog": "Blog",
      "nav.status": "Status",
      "nav.dashboard": "Painel",
      "nav.admin": "Admin",
      "nav.client": "Cliente",
      "nav.executive": "Executivo",
      
      // Home
      "home.hero.title": "Infraestrutura de Alta Performance",
      "home.hero.subtitle": "Potência, estabilidade e escalabilidade para seus projetos mais ambiciosos. Data Centers no Brasil com proteção Anti-DDoS inclusa.",
      "home.hero.cta": "Ver Planos",
      "home.hero.ctaSecondary": "Falar com Especialista",
      "home.stats.uptime": "Uptime Garantido",
      "home.stats.latency": "Latência SP",
      "home.stats.support": "Suporte 24/7",
      "home.features.title": "Por que escolher a HostEver?",
      "home.features.subtitle": "Tecnologia de ponta pensada para performance.",
      "home.testimonials.title": "O que dizem nossos clientes",
      "home.cta.title": "Pronto para começar?",
      "home.cta.subtitle": "Migração gratuita e assistida para novos clientes.",
      "home.cta.button": "Criar Conta Agora",

      // Products
      "products.title": "Nossas Soluções",
      "products.subtitle": "Escolha a plataforma ideal para sua presença digital.",
      "products.shared.title": "Hospedagem de Sites",
      "products.shared.desc": "Ideal para sites pessoais, blogs e pequenas empresas.",
      "products.vps.title": "VPS Cloud",
      "products.vps.desc": "Performance dedicada e acesso root para aplicações.",
      "products.email.title": "Email Corporativo",
      "products.email.desc": "Email profissional seguro e livre de spam.",
      "products.domains.title": "Registro de Domínios",
      "products.domains.desc": "Garanta a identidade da sua marca na internet.",
      "products.features.ssd": "Armazenamento NVMe",
      "products.features.ssl": "Certificado SSL Grátis",
      "products.features.support": "Suporte Especializado",
      "products.price.month": "/mês",
      "products.cta": "Saiba Mais",

      // Blog
      "blog.title": "Blog & Insights",
      "blog.subtitle": "Notícias, tutoriais e novidades sobre tecnologia.",
      "blog.search": "Buscar artigos...",
      "blog.readMore": "Ler artigo",
      "blog.readTime": "min de leitura",
      "blog.back": "Voltar",
      "blog.noPosts": "Nenhum artigo encontrado.",

      // Status
      "status.title": "Status dos Serviços",
      "status.subtitle": "Acompanhe a disponibilidade da nossa infraestrutura em tempo real.",
      "status.operational": "Todos os sistemas operacionais",
      "status.issues": "Instabilidade Detectada",
      "status.lastUpdate": "Última atualização",
      "status.incidents": "Incidentes Ativos",
      "status.investigating": "Investigando",
      "status.resolved": "Resolvido",
      "status.history": "Histórico de Disponibilidade",

      // Admin Dashboard
      "admin.dashboard": "Dashboard",
      "admin.products": "Produtos",
      "admin.clients": "Clientes",
      "admin.services": "Serviços",
      "admin.domains": "Domínios",
      "admin.invoices": "Faturas",
      "admin.tickets": "Tickets",
      "admin.users": "Usuários",
      "admin.revenue": "Receita Mensal",
      "admin.newClients": "Novos Clientes",
      "admin.activeServers": "Servidores Ativos",
      "admin.recentActivity": "Atividade Recente",
      
      // Client Dashboard
      "client.welcome": "Olá",
      "client.dashboard": "Visão Geral",
      "client.services": "Meus Serviços",
      "client.invoices": "Minhas Faturas",
      "client.support": "Suporte",
      "client.openTicket": "Abrir Ticket",
      "client.activeServices": "Serviços Ativos",
      "client.pendingInvoices": "Faturas Pendentes",
      "client.openTickets": "Tickets Abertos",
      "client.uptime": "Uptime Mensal",
      "client.quickActions": "Ações Rápidas",
      "client.newOrder": "Nova Contratação",
      
      // Common
      "common.loading": "Carregando...",
      "common.error": "Erro",
      "common.success": "Sucesso",
      "common.save": "Salvar",
      "common.cancel": "Cancelar",
      "common.delete": "Excluir",
      "common.edit": "Editar",
      "common.view": "Visualizar",
      "common.active": "Ativo",
      "common.inactive": "Inativo",
      "common.pending": "Pendente",
    }
  }
};

i18n
  .use(i18nextBrowserLanguagedetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', 
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
