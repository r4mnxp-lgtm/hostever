import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, ExternalLink, Clock, CheckCircle, AlertCircle, Loader, Box, Play, Pause } from 'lucide-react';

const SANDBOX_API = 'http://localhost:3001/api/sandbox';

const ClientSandbox = () => {
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
      console.log('Carregando projetos da API...', SANDBOX_API);
      const response = await axios.get(`${SANDBOX_API}/projects`);
      console.log('Resposta da API:', response.data);
      setProjects(response.data.projects || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      console.error('Detalhes:', err.response?.data || err.message);
      if (loading) {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3001.');
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

  const startProject = async (id) => {
    try {
      const response = await axios.post(`${SANDBOX_API}/projects/${id}/start`);
      setProjects(projects.map(p => 
        p.id === id ? { ...p, isRunning: true, status: 'running' } : p
      ));
    } catch (err) {
      setError('Erro ao iniciar projeto');
    }
  };

  const stopProject = async (id) => {
    try {
      const response = await axios.post(`${SANDBOX_API}/projects/${id}/stop`);
      setProjects(projects.map(p => 
        p.id === id ? { ...p, isRunning: false, status: 'ready' } : p
      ));
    } catch (err) {
      setError('Erro ao parar projeto');
    }
  };

  const getStatusColor = (status, isRunning) => {
    if (isRunning) return 'bg-green-500';
    switch (status) {
      case 'ready': return 'bg-yellow-500';
      case 'running': return 'bg-green-500';
      case 'building': return 'bg-purple-500 animate-pulse';
      case 'stopped': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status, isRunning) => {
    if (isRunning) return <CheckCircle className="w-5 h-5" />;
    switch (status) {
      case 'ready': return <Pause className="w-5 h-5" />;
      case 'running': return <CheckCircle className="w-5 h-5" />;
      case 'building': return <Loader className="w-5 h-5 animate-spin" />;
      case 'stopped': return <Pause className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status, isRunning) => {
    if (isRunning) return 'Online';
    switch (status) {
      case 'ready': return 'Pronto';
      case 'running': return 'Online';
      case 'building': return 'Construindo';
      case 'stopped': return 'Parado';
      case 'error': return 'Erro';
      default: return status;
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-[#FFB833]" />
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🎨 Testar Meus Sites
            </h1>
            <p className="text-gray-600 mt-1">Faça upload de sites HTML ou React para testar</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#FFB833]">{projects.length}</div>
            <div className="text-sm text-gray-500">Projetos Ativos</div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 hover:border-[#FFB833] rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-orange-50">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <div className="text-gray-700">
                  <Loader className="w-12 h-12 animate-spin mx-auto mb-3 text-[#FFB833]" />
                  <p className="text-lg font-medium">Processando...</p>
                  <p className="text-sm text-gray-500 mt-1">Aguarde enquanto preparamos seu site</p>
                </div>
              ) : (
                <div className="text-gray-700">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-[#FFB833]" />
                  <p className="text-lg font-medium">Clique para fazer upload</p>
                  <p className="text-sm text-gray-500 mt-1">Arquivos .zip (HTML puro ou React/Vite)</p>
                  <p className="text-xs text-gray-400 mt-2">Tamanho máximo: 100MB</p>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Como usar:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>HTML Puro:</strong> Carrega instantaneamente</li>
            <li>• <strong>React/Vite:</strong> Aguarde 1-3 minutos para o build</li>
            <li>• <strong>Expiração:</strong> Projetos são automaticamente deletados após 24 horas</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Box className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg text-gray-600">Nenhum projeto ainda</p>
            <p className="text-sm text-gray-500">Faça upload de um arquivo .zip para começar</p>
          </div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeEmoji(project.type)}</span>
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white flex items-center gap-2 ${getStatusColor(project.status, project.isRunning)}`}>
                      {getStatusIcon(project.status, project.isRunning)}
                      {getStatusText(project.status, project.isRunning)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium">Tipo: {project.type.toUpperCase()}</span>
                    {project.expiresAt && (
                      <span>⏰ Expira: {new Date(project.expiresAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {project.isRunning ? (
                    <>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#FFB833] hover:bg-[#FFA500] text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir Site
                      </a>
                      <button
                        onClick={() => stopProject(project.id)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                        Parar
                      </button>
                    </>
                  ) : (
                    (project.status === 'ready' || project.status === 'stopped') && (
                      <button
                        onClick={() => startProject(project.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
                      >
                        <Play className="w-4 h-4" />
                        Iniciar
                      </button>
                    )
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
  );
};

export default ClientSandbox;
