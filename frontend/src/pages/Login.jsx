
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const Login = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError(null);
    
    const { error, user } = await signIn(data.email, data.password);
    
    if (error) {
      setAuthError(t('auth.invalidCredentials'));
      setIsLoading(false);
    } else {
      // Redirect logic is handled inside signIn or useEffect in AuthContext usually, 
      // but we can enforce it here if signIn returns the user profile with role.
      // However, typical pattern is AuthContext updates state and a ProtectedRoute handles redirection,
      // or we manually redirect here based on the returned user object.
      
      // Note: signIn in AuthContext returns { data, error, userProfile }. 
      // We will rely on AuthContext to return the profile or fetch it.
      // Assuming signIn returns the unified user object with role:
      
      if (user?.role === 'admin') navigate('/admin-dashboard');
      else if (user?.role === 'executive') navigate('/executive-dashboard');
      else navigate('/client-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFB833] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFA500]/20 rounded-full blur-[100px] -z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-4">
               <img src="/logo.png" alt="HostEver" className="h-10" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#FFB833] font-sora">{t('auth.welcomeBack')}</CardTitle>
            <p className="text-gray-500 text-sm">{t('auth.accessAccount')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {authError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                  {authError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="voce@exemplo.com" 
                    {...register('email')} 
                    className={`pl-10 h-11 border-gray-200 focus:border-[#FFA500] focus:ring-[#FFA500]/20 ${errors.email ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-semibold">{t('auth.password')}</Label>
                    <Link to="/forgot-password" className="text-xs text-[#FFA500] hover:underline font-medium">{t('auth.forgotPassword')}</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    {...register('password')} 
                    className={`pl-10 h-11 border-gray-200 focus:border-[#FFA500] focus:ring-[#FFA500]/20 ${errors.password ? 'border-red-500' : ''}`} 
                  />
                </div>
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#FFA500] hover:bg-[#FFA500] h-11 text-base font-bold shadow-lg shadow-blue-500/20 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.signingIn')}
                  </>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pt-2 pb-6">
            <p className="text-sm text-gray-500">
              {t('auth.noAccount')} <Link to="/register" className="text-[#FFA500] hover:underline font-bold">{t('auth.createAccount')}</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
