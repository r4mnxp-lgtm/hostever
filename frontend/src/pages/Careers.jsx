import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Users, Heart, Zap, FileText, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCareersData } from '@/hooks/useCareersData';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIMask } from 'react-imask';

const applicationSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  linkedin: z.string().url("URL do LinkedIn inválida").optional().or(z.literal('')),
  resume: z.any().refine(files => files?.length == 1, "Currículo é obrigatório."),
});

const ApplicationForm = ({ job, onSuccess }) => {
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(applicationSchema)
    });

    const { ref: phoneRef, value: phoneValue } = useIMask({ mask: '(00) 00000-0000' });

    const onSubmit = (data) => {
        const applications = JSON.parse(localStorage.getItem('avyra-applications') || '[]');
        const newApplication = {
            id: uuidv4(),
            jobId: job.id,
            jobTitle: job.title,
            ...data,
            resume: data.resume[0].name,
            status: 'Recebido',
            date: new Date().toISOString(),
        };
        localStorage.setItem('avyra-applications', JSON.stringify([...applications, newApplication]));
        showToast({
            title: "Candidatura Enviada!",
            description: "Boa sorte! Entraremos em contato se seu perfil for selecionado.",
        });
        reset();
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <Label htmlFor="phone">WhatsApp</Label>
                    <Input id="phone" type="tel" {...register("phone")} ref={phoneRef} />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
            </div>
            <div>
                <Label htmlFor="linkedin">Perfil do LinkedIn (Opcional)</Label>
                <Input id="linkedin" {...register("linkedin")} />
                {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>}
            </div>
            <div>
                <Label htmlFor="resume">Currículo (PDF)</Label>
                <Input id="resume" type="file" accept=".pdf" {...register("resume")} />
                {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full hero-gradient text-white">
                Enviar Candidatura
            </Button>
        </form>
    );
};

const Careers = () => {
    const { jobs } = useCareersData();
    const [selectedJob, setSelectedJob] = useState(null);

    const benefits = [
        { icon: Zap, title: "Ambiente Dinâmico", description: "Trabalhe com tecnologias de ponta e desafios constantes." },
        { icon: Users, title: "Equipe Colaborativa", description: "Faça parte de um time unido e apaixonado pelo que faz." },
        { icon: Heart, title: "Crescimento Profissional", description: "Oferecemos oportunidades de desenvolvimento e aprendizado." },
    ];

    return (
        <>
            <Helmet>
                <title>Carreiras - Avyra Data Centers</title>
                <meta name="description" content="Junte-se à nossa equipe! Veja as vagas abertas na Avyra Data Centers e venha fazer parte de um time inovador." />
            </Helmet>
            <div className="bg-gray-50">
                <section className="relative bg-white pt-20 pb-10 lg:pt-32 lg:pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <Briefcase className="w-16 h-16 mx-auto hero-gradient text-white p-3 rounded-2xl mb-6" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Faça parte da nossa <span className="gradient-text">Equipe</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Estamos sempre em busca de talentos apaixonados por tecnologia para nos ajudar a construir o futuro da infraestrutura digital.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que trabalhar na Avyra?</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Somos mais que uma empresa de tecnologia, somos uma família de inovadores.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-2xl shadow-lg text-center"
                                >
                                    <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                                        <benefit.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Vagas Abertas</h2>
                        <div className="space-y-8">
                            {jobs.length > 0 ? jobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl hover:border-orange-300 transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                                        <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full mt-2 sm:mt-0">{job.department}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mb-6">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" /> {job.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" /> {job.type}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-6">{job.description}</p>
                                    <Button onClick={() => setSelectedJob(job)} className="hero-gradient text-white font-semibold">
                                        Candidatar-se <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </motion.div>
                            )) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                    <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800">Nenhuma vaga aberta no momento</h3>
                                    <p className="text-gray-500 mt-2">Fique de olho em nossas redes sociais para futuras oportunidades!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Candidatura para {selectedJob?.title}</DialogTitle>
                        <DialogDescription>Preencha seus dados abaixo. Boa sorte!</DialogDescription>
                    </DialogHeader>
                    {selectedJob && <ApplicationForm job={selectedJob} onSuccess={() => setSelectedJob(null)} />}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Careers;