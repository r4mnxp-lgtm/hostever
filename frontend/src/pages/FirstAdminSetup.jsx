import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

const FirstAdminSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await fetch('/api/setup/check-setup');
      const data = await response.json();
      
      if (data.hasAdmin) {
        navigate('/login');
      } else {
        setNeedsSetup(true);
      }
    } catch (error) {
      console.error('Error checking setup:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não correspondem' });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 8 caracteres' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/setup/create-first-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Administrador criado com sucesso!' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao criar administrador' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFB833] to-[#FFA500] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500] mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando configuração...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!needsSetup) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB833] to-[#FFA500] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFB833] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Configuração Inicial</CardTitle>
            <CardDescription>
              Crie a conta do primeiro administrador do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message.text && (
              <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hostever.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha forte"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="mt-1"
                  required
                />
                <PasswordStrengthMeter password={formData.password} />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="mt-1"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">As senhas não correspondem</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-green-600 mt-1">✓ Senhas correspondem</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FFB833] to-[#FFA500] hover:opacity-90 text-white"
              >
                {loading ? 'Criando...' : 'Criar Administrador'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Importante:</strong> Esta conta terá acesso total ao sistema. 
                Guarde as credenciais em local seguro e altere a senha após o primeiro acesso.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-white hover:underline text-sm">
            ← Voltar para o site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default FirstAdminSetup;
