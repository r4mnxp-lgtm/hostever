import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import AdmZip from 'adm-zip';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProjectManager {
  constructor() {
    this.storageDir = path.join(__dirname, '../sandbox-storage');
    this.tempDir = path.join(__dirname, '../sandbox-temp');
    this.projects = new Map();
    console.log('🎨 ProjectManager inicializado');
    console.log('📁 Storage:', this.storageDir);
    console.log('📁 Temp:', this.tempDir);
    this.ensureDirectories();
    this.loadExistingProjects();
    console.log(`✅ ${this.projects.size} projetos carregados`);
  }

  ensureDirectories() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  loadExistingProjects() {
    try {
      if (fs.existsSync(this.storageDir)) {
        const dirs = fs.readdirSync(this.storageDir);
        dirs.forEach(dir => {
          if (dir.startsWith('temp-')) {
            const projectPath = path.join(this.storageDir, dir);
            const stats = fs.statSync(projectPath);
            
            this.projects.set(dir, {
              id: dir,
              name: dir.replace('temp-', ''),
              path: projectPath,
              type: this.detectProjectType(projectPath),
              status: 'stopped',
              createdAt: stats.birthtime,
              buildPath: null,
              url: null,
              isRunning: false
            });
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar projetos existentes:', error);
    }
  }

  detectProjectType(projectPath) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
          return 'react';
        }
        if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
          return 'vue';
        }
        if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
          return 'next';
        }
        return 'node';
      } catch (error) {
        console.error('Erro ao ler package.json:', error);
      }
    }
    
    const indexHtml = path.join(projectPath, 'index.html');
    if (fs.existsSync(indexHtml)) {
      return 'static';
    }
    
    return 'unknown';
  }

  async extractZip(zipPath, projectId) {
    const extractPath = path.join(this.storageDir, `temp-${projectId}`);
    
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);
      
      const files = fs.readdirSync(extractPath);
      if (files.length === 1 && fs.statSync(path.join(extractPath, files[0])).isDirectory()) {
        const innerDir = path.join(extractPath, files[0]);
        const innerFiles = fs.readdirSync(innerDir);
        
        innerFiles.forEach(file => {
          fs.renameSync(
            path.join(innerDir, file),
            path.join(extractPath, file)
          );
        });
        
        fs.rmdirSync(innerDir);
      }
      
      return extractPath;
    } catch (error) {
      console.error('Erro ao extrair ZIP:', error);
      throw error;
    }
  }

  async buildProject(projectPath, projectType) {
    try {
      if (projectType === 'static') {
        return projectPath;
      }

      if (['react', 'vue', 'node'].includes(projectType)) {
        console.log('Instalando dependências...');
        await execAsync('npm install', { 
          cwd: projectPath,
          windowsHide: true 
        });

        console.log('Executando build...');
        await execAsync('npm run build', { 
          cwd: projectPath,
          windowsHide: true 
        });

        const distPath = path.join(projectPath, 'dist');
        const buildPath = path.join(projectPath, 'build');

        if (fs.existsSync(distPath)) {
          return distPath;
        } else if (fs.existsSync(buildPath)) {
          return buildPath;
        }
      }

      return projectPath;
    } catch (error) {
      console.error('Erro durante o build:', error);
      throw error;
    }
  }

  async createProject(zipBuffer, projectName) {
    const projectId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const zipPath = path.join(this.tempDir, `${projectId}.zip`);

    try {
      fs.writeFileSync(zipPath, zipBuffer);

      const projectPath = await this.extractZip(zipPath, projectId);
      const projectType = this.detectProjectType(projectPath);

      const project = {
        id: `temp-${projectId}`,
        name: projectName || projectId,
        path: projectPath,
        type: projectType,
        status: 'building',
        createdAt: new Date(),
        buildPath: null,
        url: null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isRunning: false
      };

      this.projects.set(project.id, project);

      fs.unlinkSync(zipPath);

      const buildPath = await this.buildProject(projectPath, projectType);
      project.buildPath = buildPath;
      project.status = 'ready';
      project.url = `/sandbox/preview/${project.id}`;
      
      // Iniciar automaticamente após o build
      project.isRunning = true;
      project.status = 'running';
      console.log(`✅ Projeto criado e iniciado automaticamente: ${project.id}`);

      return project;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      this.deleteProject(`temp-${projectId}`);
      throw error;
    }
  }

  startProject(projectId) {
    const project = this.projects.get(projectId);
    if (project && project.status === 'ready') {
      project.isRunning = true;
      project.status = 'running';
      console.log(`▶️ Projeto iniciado: ${projectId}`);
      return true;
    }
    return false;
  }

  stopProject(projectId) {
    const project = this.projects.get(projectId);
    if (project && project.isRunning) {
      project.isRunning = false;
      project.status = 'ready';
      console.log(`⏸️ Projeto parado: ${projectId}`);
      return true;
    }
    return false;
  }

  deleteProject(projectId) {
    const project = this.projects.get(projectId);
    if (project) {
      try {
        if (fs.existsSync(project.path)) {
          fs.rmSync(project.path, { recursive: true, force: true });
        }
        this.projects.delete(projectId);
        console.log(`🗑️ Projeto deletado: ${projectId}`);
        return true;
      } catch (error) {
        console.error('Erro ao deletar projeto:', error);
        return false;
      }
    }
    return false;
  }

  getProject(projectId) {
    return this.projects.get(projectId);
  }

  getAllProjects() {
    return Array.from(this.projects.values()).map(project => ({
      ...project,
      path: undefined,
      buildPath: undefined
    }));
  }

  cleanExpiredProjects() {
    const now = Date.now();
    for (const [id, project] of this.projects) {
      if (project.expiresAt && project.expiresAt.getTime() < now) {
        console.log(`Limpando projeto expirado: ${id}`);
        this.deleteProject(id);
      }
    }
  }
}
