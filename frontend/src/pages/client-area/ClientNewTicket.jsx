import React , useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useClientTicketsData } from '@/hooks/useClientTicketsData';
import { useClientServicesData } from '@/hooks/useClientServicesData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';

const ticketSchema = z.object({
    subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres."),
    department: z.string().min(1, "Selecione um departamento."),
    relatedService: z.string().optional(),
    message: z.string().min(20, "A mensagem deve ter pelo menos 20 caracteres."),
});

const ClientNewTicket = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addTicket } = useClientTicketsData(user?.id);
    const { services } = useClientServicesData(user?.id);
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm({
        resolver: zodResolver(ticketSchema),
    });

    const onSubmit = (data) => {
        const newTicket = {
            id: uuidv4(),
            clientId: user.id,
            subject: data.subject,
            department: data.department,
            relatedService: data.relatedService,
            status: 'open',
            createdAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString(),
            messages: [
                {
                    id: uuidv4(),
                    sender: 'client',
                    timestamp: new Date().toISOString(),
                    content: data.message,
                }
            ]
        };
        addTicket(newTicket);
        showToast({
            title: "Ticket Aberto com Sucesso!",
            description: "Sua solicitação foi enviada. Nossa equipe responderá em breve.",
            variant: "success",
        });
        navigate('/client-area/tickets');
    };

    return (
        <>
            <Helmet>
                <title>Abrir Novo Ticket - Área do Cliente</title>
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Abrir Novo Ticket de Suporte</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <Label htmlFor="subject">Assunto</Label>
                        <Input id="subject" {...register('subject')} />
                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="department">Departamento</Label>
                            <Select onValueChange={(value) => setValue('department', value)}>
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="Selecione o departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="support">Suporte Técnico</SelectItem>
                                    <SelectItem value="billing">Financeiro</SelectItem>
                                    <SelectItem value="sales">Comercial</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="relatedService">Serviço Relacionado (Opcional)</Label>
                            <Select onValueChange={(value) => setValue('relatedService', value)}>
                                <SelectTrigger id="relatedService">
                                    <SelectValue placeholder="Selecione um serviço" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map(service => (
                                        <SelectItem key={service.id} value={service.id}>{service.name} ({service.ip})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea id="message" {...register('message')} rows={8} />
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="hero-gradient text-white">Enviar Ticket</Button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

export default ClientNewTicket;