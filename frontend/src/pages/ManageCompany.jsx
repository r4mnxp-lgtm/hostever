import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CharacterCounter = ({ value, maxLength }) => {
    const length = value ? value.length : 0;
    const isOver = maxLength && length > maxLength;
    return (
        <p className={`text-sm mt-1 ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
            {length} {maxLength && `/ ${maxLength}`} caracteres
        </p>
    );
};

const ManageCompany = () => {
    const { companyData, saveCompanyData } = useCompanyData();
    const [formData, setFormData] = useState(companyData);
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            links: {
                ...prev.links,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveCompanyData(formData);
        showToast({
            title: "Sucesso!",
            description: "As informações da empresa foram atualizadas.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Empresa - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Informações da Empresa</h1>
                <p className="text-gray-600">Edite os dados que aparecem em todo o site.</p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Informações Gerais</h2>
                    <div>
                        <Label htmlFor="name">Nome da Empresa</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição Curta (para SEO)</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
                        <CharacterCounter value={formData.description} maxLength={160} />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Conteúdo da Página "Sobre"</h2>
                    <div>
                        <Label htmlFor="historyP1">História - Parágrafo 1</Label>
                        <Textarea id="historyP1" name="historyP1" value={formData.historyP1} onChange={handleInputChange} rows={4} />
                        <CharacterCounter value={formData.historyP1} />
                    </div>
                    <div>
                        <Label htmlFor="historyP2">História - Parágrafo 2</Label>
                        <Textarea id="historyP2" name="historyP2" value={formData.historyP2} onChange={handleInputChange} rows={4} />
                        <CharacterCounter value={formData.historyP2} />
                    </div>
                    <div>
                        <Label htmlFor="historyP3">História - Parágrafo 3</Label>
                        <Textarea id="historyP3" name="historyP3" value={formData.historyP3} onChange={handleInputChange} rows={4} />
                        <CharacterCounter value={formData.historyP3} />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Links e Contatos</h2>
                    <div>
                        <Label htmlFor="contactExpert">Link "Fale com um especialista"</Label>
                        <Input id="contactExpert" name="contactExpert" value={formData.links.contactExpert} onChange={handleLinkChange} />
                    </div>
                    <div>
                        <Label htmlFor="whatsapp">Link do WhatsApp</Label>
                        <Input id="whatsapp" name="whatsapp" value={formData.links.whatsapp} onChange={handleLinkChange} />
                    </div>
                    <div>
                        <Label htmlFor="linkedin">Link do LinkedIn</Label>
                        <Input id="linkedin" name="linkedin" value={formData.links.linkedin} onChange={handleLinkChange} />
                    </div>
                    <div>
                        <Label htmlFor="instagram">Link do Instagram</Label>
                        <Input id="instagram" name="instagram" value={formData.links.instagram} onChange={handleLinkChange} />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="hero-gradient text-white">
                        Salvar Alterações
                    </Button>
                </div>
            </motion.form>
        </>
    );
};

export default ManageCompany;