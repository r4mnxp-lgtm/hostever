import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Scale, Shield } from 'lucide-react';

const ManageLegal = () => {
    const { companyData, saveCompanyData } = useCompanyData();
    const [formData, setFormData] = useState({
        termsOfUse: companyData.termsOfUse,
        privacyPolicy: companyData.privacyPolicy,
    });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        saveCompanyData({ ...companyData, ...formData });
        showToast({
            title: "Sucesso!",
            description: "Os textos legais foram atualizados.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Textos Legais - Avyra</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Textos Legais</h1>
                <p className="text-gray-600">Edite o conteúdo das páginas de Termos de Uso e Política de Privacidade.</p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center">
                        <Scale className="w-6 h-6 mr-3 text-primary"/>
                        Termos de Uso
                    </h2>
                    <div>
                        <Label htmlFor="termsOfUse" className="sr-only">Termos de Uso</Label>
                        <Textarea 
                            id="termsOfUse" 
                            name="termsOfUse" 
                            value={formData.termsOfUse} 
                            onChange={handleInputChange} 
                            rows={15}
                            className="text-sm leading-relaxed"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-primary"/>
                        Política de Privacidade
                    </h2>
                    <div>
                        <Label htmlFor="privacyPolicy" className="sr-only">Política de Privacidade</Label>
                        <Textarea 
                            id="privacyPolicy" 
                            name="privacyPolicy" 
                            value={formData.privacyPolicy} 
                            onChange={handleInputChange} 
                            rows={15}
                            className="text-sm leading-relaxed"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" className="hero-gradient text-white">
                        Salvar Alterações
                    </Button>
                </div>
            </motion.form>
        </>
    );
};

export default ManageLegal;