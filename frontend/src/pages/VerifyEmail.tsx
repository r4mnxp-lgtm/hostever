import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB833] to-[#FFA500] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardContent className="p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-[#FFA500] animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando seu e-mail...</h1>
                <p className="text-gray-600">Por favor, aguarde.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">E-mail Verificado!</h1>
                <p className="text-gray-600 mb-6">
                  Seu e-mail foi confirmado com sucesso. Você será redirecionado para a página de login.
                </p>
                <Button asChild className="w-full bg-[#FFA500] hover:bg-[#FF8C00]">
                  <Link to="/login">Ir para Login</Link>
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro na Verificação</h1>
                <p className="text-gray-600 mb-6">
                  O link de verificação é inválido ou expirou. Por favor, solicite um novo link através do seu painel.
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login">Fazer Login</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-[#FFA500] hover:bg-[#FF8C00]">
                    <Link to="/register">Criar Conta</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-white hover:underline">
            ← Voltar para o site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
