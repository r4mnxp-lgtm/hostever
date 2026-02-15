
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);
    if (!error) {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFB833] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-[#FFA500]/10 rounded-full flex items-center justify-center mb-2">
                <Lock className="w-8 h-8 text-[#FFA500]" />
            </div>
            <div>
                <CardTitle className="text-2xl font-bold text-[#FFB833] font-sora">Restricted Access</CardTitle>
                <p className="text-gray-500 text-sm mt-2">Administrative & Executive Portal</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Administrative Email</Label>
                <Input id="email" type="email" placeholder="admin@hostever.com" {...register('email')} className="h-11" />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Secure Password</Label>
                <Input id="password" type="password" {...register('password')} className="h-11" />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-[#FFA500] hover:bg-[#FFA500] h-11 text-base font-bold shadow-lg shadow-blue-500/20" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
