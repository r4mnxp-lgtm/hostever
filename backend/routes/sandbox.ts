import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectManager } from '../utils/projectManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const projectManager = new ProjectManager();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .zip são permitidos'));
    }
  }
});

router.post('/upload', upload.single('project'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const projectName = req.body.name || req.file.originalname.replace('.zip', '');
    
    const project = await projectManager.createProject(req.file.buffer, projectName);

    res.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        type: project.type,
        status: project.status,
        url: `http://localhost:3001/sandbox/preview/${project.id}`,
        createdAt: project.createdAt,
        expiresAt: project.expiresAt
      }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro ao processar projeto',
      message: error.message 
    });
  }
});

router.get('/projects', (req, res) => {
  console.log('📦 GET /api/sandbox/projects chamado');
  const projects = projectManager.getAllProjects().map(project => ({
    ...project,
    url: project.url ? `http://localhost:3001${project.url}` : null
  }));
  console.log(`✅ Retornando ${projects.length} projetos`);
  res.json({ projects });
});

router.get('/projects/:id', (req, res) => {
  const project = projectManager.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }
  res.json({
    ...project,
    path: undefined,
    buildPath: undefined,
    url: project.url ? `http://localhost:3001/sandbox/preview/${project.id}` : null
  });
});

router.delete('/projects/:id', (req, res) => {
  const success = projectManager.deleteProject(req.params.id);
  if (success) {
    res.json({ success: true, message: 'Projeto deletado' });
  } else {
    res.status(404).json({ error: 'Projeto não encontrado' });
  }
});

router.post('/cleanup', (req, res) => {
  projectManager.cleanExpiredProjects();
  res.json({ success: true, message: 'Limpeza executada' });
});

router.post('/projects/:id/start', (req, res) => {
  const success = projectManager.startProject(req.params.id);
  if (success) {
    const project = projectManager.getProject(req.params.id);
    res.json({ 
      success: true, 
      message: 'Projeto iniciado',
      project: {
        ...project,
        path: undefined,
        buildPath: undefined,
        url: project.url ? `http://localhost:3001${project.url}` : null
      }
    });
  } else {
    res.status(404).json({ error: 'Projeto não encontrado ou não está pronto' });
  }
});

router.post('/projects/:id/stop', (req, res) => {
  const success = projectManager.stopProject(req.params.id);
  if (success) {
    const project = projectManager.getProject(req.params.id);
    res.json({ 
      success: true, 
      message: 'Projeto parado',
      project: {
        ...project,
        path: undefined,
        buildPath: undefined,
        url: project.url ? `http://localhost:3001${project.url}` : null
      }
    });
  } else {
    res.status(404).json({ error: 'Projeto não encontrado ou não está rodando' });
  }
});

export { router as sandboxRoutes, projectManager };
