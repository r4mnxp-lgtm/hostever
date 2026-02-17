import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/update-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(accountData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Dados da conta atualizados com sucesso!' });
        if (updateUser) {
          updateUser({ ...user, ...accountData });
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao atualizar dados' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao alterar senha' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Minha Conta</h1>
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
            <User className="w-5 h-5" />
            Dados da Conta
          </CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e de acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nome</label>
            <Input
              placeholder="Seu nome completo"
              value={accountData.name}
              onChange={(e) => setAccountData({...accountData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={accountData.email}
              onChange={(e) => setAccountData({...accountData, email: e.target.value})}
            />
          </div>
          <Button
            onClick={handleUpdateAccount}
            disabled={loading}
            className="bg-[#FFA500] hover:bg-[#FF8C00]"
          >
            <User className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFB833]">
            <Lock className="w-5 h-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Mantenha sua conta segura atualizando sua senha regularmente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Senha Atual</label>
            <Input
              type="password"
              placeholder="Digite sua senha atual"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nova Senha</label>
            <Input
              type="password"
              placeholder="Digite a nova senha"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirmar Nova Senha</label>
            <Input
              type="password"
              placeholder="Confirme a nova senha"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-[#FFA500] hover:bg-[#FF8C00]"
          >
            <Lock className="w-4 h-4 mr-2" />
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Dica de Segurança</h4>
              <p className="text-sm text-amber-800">
                Use uma senha forte com letras maiúsculas, minúsculas, números e caracteres especiais. 
                Evite usar informações pessoais óbvias e nunca compartilhe suas credenciais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
