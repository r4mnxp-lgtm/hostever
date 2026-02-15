import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useProductsData } from '@/hooks/useProductsData';
import { useTranslation } from 'react-i18next';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LeadCaptureForm = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
  const { products } = useProductsData();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productError, setProductError] = useState(false);

  const phoneNumber = "551151949086";

  const handleSubmit = () => {
    if (!selectedProduct) {
      setProductError(true);
      showToast({
        title: "Produto não selecionado",
        description: "Por favor, selecione um produto de interesse para continuar.",
        variant: "destructive",
      });
      return;
    }

    const productDetails = products.find(p => p.id === selectedProduct);
    const productName = productDetails ? (productDetails.name[currentLang] || productDetails.name.pt) : 'um de seus produtos';
    
    const message = `Olá! Gostaria de saber mais sobre ${productName}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Fale com um especialista</h2>
      <p className="text-gray-600 mb-6">Selecione um produto de interesse para iniciar uma conversa no WhatsApp.</p>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="product">Produto de Interesse</Label>
          <Select onValueChange={(value) => {
            setSelectedProduct(value);
            setProductError(false);
          }} value={selectedProduct}>
            <SelectTrigger id="product" className={productError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione um produto..." />
            </SelectTrigger>
            <SelectContent>
              {products.filter(p => p.available).map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name[currentLang] || p.name.pt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {productError && <p className="text-red-500 text-sm mt-1">Por favor, selecione um produto.</p>}
        </div>

        <Button onClick={handleSubmit} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
          <WhatsAppIcon />
          Iniciar Conversa no WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};

export default LeadCaptureForm;