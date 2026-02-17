import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ClientArea = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Helmet>
        <title>Área do Cliente - HostEver</title>
        <meta name="description" content="Acesse o painel do cliente HostEver." />
      </Helmet>
      <div className="bg-card border shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExternalLink className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Área do Cliente</h1>
        <p className="text-muted-foreground mb-8">
          Para gerenciar seus serviços, faturas e suporte, acesse nosso painel exclusivo WHMCS.
        </p>
        <Button asChild className="w-full" size="lg">
          <a href="#" className="flex items-center justify-center gap-2">
            Acessar Painel WHMCS <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ClientArea;