import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const AuthContext = createContext(undefined);

const API_URL = process.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend não disponível');
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const toastHook = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      if (error.code !== 'ECONNABORTED' && error.code !== 'ERR_NETWORK') {
        console.error('Error fetching profile:', error);
        localStorage.removeItem('token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const signUp = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        setUser(newUser);
      }
      
      showToast({
        title: "Cadastro Realizado",
        description: "Sua conta foi criada com sucesso!",
      });

      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.code === 'ERR_NETWORK' 
        ? 'Backend não disponível. Verifique se o servidor está rodando.' 
        : 'Erro ao criar conta';
      
      showToast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: errorMessage,
      });
      return { data: null, error: errorMessage };
    }
  }, [showToast]);

  const signIn = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);

      showToast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });

      return { data: userData, error: null, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.code === 'ERR_NETWORK'
        ? 'Backend não disponível. Verifique se o servidor está rodando.'
        : 'Erro ao fazer login';
      
      showToast({
        variant: "destructive",
        title: "Erro no Login",
        description: errorMessage,
      });
      return { data: null, error: errorMessage, user: null };
    }
  }, [showToast]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('token');
    setUser(null);
    
    showToast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });

    return { error: null };
  }, [showToast]);

  const resetPassword = useCallback(async (email) => {
    try {
      await api.post('/auth/reset-password', { email });
      
      showToast({
        title: "Email Enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
      return { error: null };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.code === 'ERR_NETWORK'
        ? 'Backend não disponível'
        : 'Erro ao enviar email';
      
      showToast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  }, [showToast]);

  const value = useMemo(() => ({
    user,
    session: user ? { user } : null,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    api
  }), [user, loading, signUp, signIn, signOut, resetPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { api };
