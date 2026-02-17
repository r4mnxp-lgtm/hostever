
import React from 'react';
import { Button } from '@/components/ui/button';

const ClientDomains = () => {
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Meus Domínios</h1>
            <Button className="bg-[#FFA500]">Registrar Domínio</Button>
        </div>
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500">Você ainda não possui domínios registrados conosco.</p>
        </div>
    </div>
  );
};
export default ClientDomains;
