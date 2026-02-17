
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const ClientLogin = () => {
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
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md shadow-xl border-gray-100">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
               <img src="/logo.png" alt="HostEver" className="h-10" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#FFB833] font-sora">Client Portal</CardTitle>
            <p className="text-gray-500">Sign in to manage your services</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-[#FFA500] hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-[#FFA500] hover:bg-[#FFA500]" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-[#FFA500] hover:underline">Register Now</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClientLogin;
