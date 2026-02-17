import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Mail, Database, Server, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: '',
    secure: true,
    user: '',
    password: '',
    from_email: '',
    from_name: 'HostEver'
  });

  const [companySettings, setCompanySettings] = useState({
    company_name: 'HostEver',
    company_email: '',
    company_phone: '',
    support_email: '',
    founded_year: '2025',
    founded_location: 'São Paulo, Brasil'
  });

  const handleSaveSmtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings/smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(smtpSettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações SMTP salvas com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar configurações SMTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(companySettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Dados da empresa salvos com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar dados da empresa' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.smtp) setSmtpSettings(data.smtp);
          if (data.company) setCompanySettings(data.company);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Configurações do Sistema</h1>
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Ambiente de Produção
        </Badge>
      </div>

      {message.text && (
        <Card className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4 flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <Mail className="w-5 h-5" />
            Configuração de E-mail (SMTP)
          </CardTitle>
          <CardDescription>
            Configure o servidor SMTP para envio de e-mails de confirmação de cadastro e compra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Host SMTP</label>
              <Input 
                placeholder="smtp.exemplo.com" 
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Porta</label>
              <Input 
                type="number" 
                placeholder="587" 
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Usuário</label>
              <Input 
                placeholder="usuario@exemplo.com" 
                value={smtpSettings.user}
                onChange={(e) => setSmtpSettings({...smtpSettings, user: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Senha</label>
              <Input 
                type="password" 
                placeholder="********" 
                value={smtpSettings.password}
                onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail do Remetente</label>
              <Input 
                placeholder="noreply@hostever.com" 
                value={smtpSettings.from_email}
                onChange={(e) => setSmtpSettings({...smtpSettings, from_email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nome do Remetente</label>
              <Input 
                placeholder="HostEver" 
                value={smtpSettings.from_name}
                onChange={(e) => setSmtpSettings({...smtpSettings, from_name: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="secure" 
              checked={smtpSettings.secure}
              onChange={(e) => setSmtpSettings({...smtpSettings, secure: e.target.checked})}
              className="w-4 h-4 text-[#FFA500] border-gray-300 rounded focus:ring-[#FFA500]"
            />
            <label htmlFor="secure" className="text-sm font-medium text-gray-700">
              Usar conexão segura (TLS/SSL)
            </label>
          </div>

          <Button 
            onClick={handleSaveSmtp}
            disabled={loading}
            className="bg-[#FFA500] hover:bg-[#FF8C00]"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Configurações SMTP'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <Database className="w-5 h-5" />
            Dados da Empresa
          </CardTitle>
          <CardDescription>
            Informações sobre a HostEver utilizadas em e-mails e documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nome da Empresa</label>
              <Input 
                value={companySettings.company_name}
                onChange={(e) => setCompanySettings({...companySettings, company_name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail Comercial</label>
              <Input 
                type="email"
                placeholder="contato@hostever.com"
                value={companySettings.company_email}
                onChange={(e) => setCompanySettings({...companySettings, company_email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
              <Input 
                placeholder="+55 11 9999-9999"
                value={companySettings.company_phone}
                onChange={(e) => setCompanySettings({...companySettings, company_phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail de Suporte</label>
              <Input 
                type="email"
                placeholder="suporte@hostever.com"
                value={companySettings.support_email}
                onChange={(e) => setCompanySettings({...companySettings, support_email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ano de Fundação</label>
              <Input 
                type="number"
                value={companySettings.founded_year}
                onChange={(e) => setCompanySettings({...companySettings, founded_year: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Local de Fundação</label>
              <Input 
                value={companySettings.founded_location}
                onChange={(e) => setCompanySettings({...companySettings, founded_location: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveCompany}
            disabled={loading}
            className="bg-[#FFA500] hover:bg-[#FF8C00]"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Dados da Empresa'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
