import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import ordersRoutes from "./routes/orders.js";
import installRoutes from "./routes/install.js";
import mercadopagoRoutes from "./routes/mercadopago.js";
import virtualizorRoutes from "./routes/virtualizor.js";
import invoicesRoutes from "./routes/invoices.js";
import ticketsRoutes from "./routes/tickets.js";
import maintenanceRoutes from "./routes/maintenance.js";
import servicesRoutes from "./routes/services.js";
import statusRoutes from "./routes/status.js";
import { sandboxRoutes, projectManager } from "./routes/sandbox.js";
import { testConnection } from "./config/database.js";
import { startAutomatedJobs } from "./jobs/automatedJobs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const origins = process.env.ORIGINS.split(",") || [];

// CORS - Permitir TODAS as origens em desenvolvimento
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  cors({
    origin: [...origins],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use("/uploads", express.static("uploads"));

app.get("/api/health", async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: "ok",
    message: "HostEver Backend API is running",
    database: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/install", installRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/mercadopago", mercadopagoRoutes);
app.use("/api/virtualizor", virtualizorRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/sandbox", sandboxRoutes);

app.use("/sandbox/preview/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  console.log(`📡 Acesso ao preview: ${projectId}`);

  const project = projectManager.getProject(projectId);

  if (!project) {
    console.log(`❌ Projeto não encontrado: ${projectId}`);
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <title>Projeto não encontrado</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 3rem;
              max-width: 600px;
            }
            h1 { font-size: 4rem; margin: 0 0 1rem 0; }
            h2 { font-size: 1.8rem; margin: 0 0 1rem 0; }
            p { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; margin-bottom: 2rem; }
            .button {
              display: inline-block;
              background: white;
              color: #667eea;
              padding: 12px 30px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin: 5px;
            }
            .button:hover {
              background: #f0f0f0;
            }
            .tip {
              background: rgba(255,255,255,0.1);
              padding: 1rem;
              border-radius: 8px;
              margin-top: 2rem;
              font-size: 0.95rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <h2>Projeto não encontrado</h2>
            <p>Este projeto não existe, foi deletado ou expirou.</p>
            <p>Possíveis motivos:</p>
            <p>• O projeto foi deletado<br>
               • O link é antigo ou inválido<br>
               • O projeto expirou (prazo de 24h)</p>
            
            <a href="http://localhost:3000/client-dashboard/sandbox" class="button">
              Voltar ao Dashboard
            </a>
            <button onclick="window.close()" class="button">
              Fechar
            </button>
            
            <div class="tip">
              💡 Dica: Faça upload de um novo projeto no dashboard!
            </div>
          </div>
        </body>
      </html>
    `);
  }

  if (!project.isRunning) {
    console.log(`⏸️ Projeto parado: ${projectId}`);
    return res.status(503).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <title>Projeto Parado</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 3rem;
              max-width: 600px;
            }
            .icon {
              font-size: 5rem;
              margin-bottom: 1rem;
            }
            h1 { font-size: 2rem; margin: 0 0 1rem 0; }
            p { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; margin-bottom: 2rem; }
            .button {
              display: inline-block;
              background: white;
              color: #667eea;
              padding: 12px 30px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin: 5px;
            }
            .button:hover {
              background: #f0f0f0;
            }
            .steps {
              background: rgba(255,255,255,0.1);
              padding: 1.5rem;
              border-radius: 8px;
              margin-top: 2rem;
              text-align: left;
            }
            .steps ol {
              margin: 0;
              padding-left: 1.5rem;
            }
            .steps li {
              margin: 0.5rem 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⏸️</div>
            <h1>Projeto Parado</h1>
            <p>Este projeto está pausado no momento.<br>
            Para acessá-lo, você precisa iniciá-lo primeiro.</p>
            
            <div class="steps">
              <strong>📝 Como iniciar:</strong>
              <ol>
                <li>Volte ao Dashboard</li>
                <li>Encontre o projeto "${project.name}"</li>
                <li>Clique no botão verde "Iniciar"</li>
                <li>Aguarde o status mudar para "Online"</li>
                <li>Clique em "Abrir Site"</li>
              </ol>
            </div>
            
            <a href="http://localhost:3000/client-dashboard/sandbox" class="button">
              Ir para Dashboard
            </a>
            <button onclick="window.close()" class="button">
              Fechar
            </button>
          </div>
        </body>
      </html>
    `);
  }

  if (project.status !== "ready" && project.status !== "running") {
    console.log(`🔄 Projeto em construção: ${projectId} (${project.status})`);
    return res.status(503).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <title>Projeto em Construção</title>
          <meta charset="UTF-8">
          <meta http-equiv="refresh" content="3">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .spinner {
              border: 4px solid rgba(255,255,255,0.3);
              border-radius: 50%;
              border-top: 4px solid white;
              width: 60px;
              height: 60px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h1 { font-size: 2rem; margin: 1rem 0; }
            p { font-size: 1.1rem; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Construindo seu projeto...</h1>
            <p>Aguarde enquanto preparamos tudo para você</p>
            <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 2rem;">
              Esta página recarrega automaticamente a cada 3 segundos
            </p>
          </div>
        </body>
      </html>
    `);
  }

  console.log(`✅ Servindo projeto: ${projectId}`);
  const servePath = project.buildPath || project.path;
  express.static(servePath)(req, res, next);
});

setInterval(
  () => {
    projectManager.cleanExpiredProjects();
  },
  60 * 60 * 1000,
);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

async function startServer() {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.warn(
        "⚠️ Aviso: Banco de dados não conectado. Algumas funcionalidades podem não funcionar.",
      );
    }

    startAutomatedJobs();

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║           🚀 HOSTEVER BACKEND API                 ║
║                                                   ║
║  Status: ✅ Online                                ║
║  Porta: ${PORT}                                      ║
║  Database: ${dbConnected ? "✅ Conectado" : "❌ Desconectado"}                        ║
║                                                   ║
║  📍 Endpoints:                                    ║
║     - /api/health                                 ║
║     - /api/auth (registro/login)                  ║
║     - /api/orders (checkout)                      ║
║     - /api/mercadopago                            ║
║     - /api/virtualizor                            ║
║     - /api/invoices                               ║
║     - /api/tickets                                ║
║     - /api/maintenance                            ║
║     - /api/services                               ║
║     - /api/status                                 ║
║     - /api/sandbox (hospedagem temporária)        ║
║                                                   ║
║  🎨 Sandbox Preview:                              ║
║     - /sandbox/preview/[project-id]               ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
