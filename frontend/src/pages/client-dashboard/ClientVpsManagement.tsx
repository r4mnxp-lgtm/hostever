
import React, { useCallback, useState } from 'react';
import { Power, RotateCcw, Terminal, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { virtualizor } from '@/utils/VirtualizorAPI';
import { useToast } from '@/components/ui/use-toast';

const ClientVpsManagement = () => {
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      // Mock ID 101
      if (action === 'reboot') await virtualizor.rebootServer(101);
      if (action === 'shutdown') await virtualizor.shutdownServer(101);
      
      showToast({ title: 'Comando enviado com sucesso', description: `Ação ${action} iniciada.` });
    } catch (e) {
      showToast({ title: 'Erro', description: 'Falha ao comunicar com o servidor.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#FFB833] mb-6 font-sora">Painel de Controle VPS</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
           <div>
             <h2 className="text-xl font-bold text-gray-800">vps-01.hostever.com</h2>
             <p className="text-gray-500">192.168.1.10 • Ubuntu 22.04 LTS</p>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
             <span className="font-bold text-green-600">Online</span>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <Button 
             variant="outline" 
             className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
             onClick={() => handleAction('shutdown')}
             disabled={loading}
           >
             <Power className="w-6 h-6" />
             Desligar
           </Button>
           <Button 
             variant="outline" 
             className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
             onClick={() => handleAction('reboot')}
             disabled={loading}
           >
             <RotateCcw className="w-6 h-6" />
             Reiniciar
           </Button>
           <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
             <Terminal className="w-6 h-6" />
             Console VNC
           </Button>
           <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50">
             <Activity className="w-6 h-6" />
             Gráficos
           </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
           <h3 className="font-bold mb-4">Recursos</h3>
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>CPU</span><span>45%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#FFA500] w-[45%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>RAM</span><span>2.4GB / 4GB</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#FFA500] w-[60%]"></div></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClientVpsManagement;
