import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, ExternalLink, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const SANDBOX_API = 'http://localhost:3001/api/sandbox';

const SandboxDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
    const interval = setInterval(loadProjects, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${SANDBOX_API}/projects`);
      setProjects(response.data.projects);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      if (loading) {
        setError('Servidor sandbox offline. Inicie o backend na porta 3001.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('project', file);
      formData.append('name', file.name.replace('.zip', ''));

      const response = await axios.post(`${SANDBOX_API}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProjects([response.data.project, ...projects]);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Deletar este projeto?')) return;

    try {
      await axios.delete(`${SANDBOX_API}/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError('Erro ao deletar projeto');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'building': return 'bg-purple-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-5 h-5" />;
      case 'building': return <Loader className="w-5 h-5 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case 'react': return '⚛️';
      case 'vue': return '💚';
      case 'next': return '▲';
      case 'node': return '📦';
      case 'static': return '📄';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎨 Mooby Sandbox
              </h1>
              <p className="text-purple-200">Sistema de Hospedagem Temporária</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{projects.length}</div>
              <div className="text-sm text-purple-200">Projetos Ativos</div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
              {error}
            </div>
          )}

          <div className="mb-8">
            <label className="block">
              <div className="border-2 border-dashed border-white/30 hover:border-white/60 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-white/5">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <div className="text-white">
                    <Loader className="w-12 h-12 animate-spin mx-auto mb-3" />
                    <p className="text-lg">Processando...</p>
                  </div>
                ) : (
                  <div className="text-white">
                    <Upload className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-medium">Clique para fazer upload</p>
                    <p className="text-sm text-purple-200 mt-1">Arquivos .zip (HTML ou React/Vite)</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p className="text-lg">Nenhum projeto ainda</p>
                <p className="text-sm">Faça upload de um arquivo .zip para começar</p>
              </div>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getTypeEmoji(project.type)}</span>
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white flex items-center gap-2 ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-purple-200">
                        <span>Tipo: {project.type.toUpperCase()}</span>
                        <span>ID: {project.id}</span>
                        {project.expiresAt && (
                          <span>Expira: {new Date(project.expiresAt).toLocaleString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {project.status === 'ready' && project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Abrir
                        </a>
                      )}
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandboxDashboard;
