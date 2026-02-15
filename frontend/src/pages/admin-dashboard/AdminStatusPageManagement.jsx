
import React, { useCallback, useState } from 'react';
import { useStatusData } from '@/hooks/useStatusData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, AlertTriangle, XCircle, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminStatusPageManagement = () => {
    const { services, incidents, updateServiceStatus, addIncident, deleteIncident } = useStatusData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const [incidentForm, setIncidentForm] = useState({ title: '', description: '', severity: 'minor' });

    const handleAddIncident = () => {
        addIncident(incidentForm);
        setIncidentForm({ title: '', description: '', severity: 'minor' });
        showToast({ title: 'Incidente Registrado', description: 'O incidente foi publicado na página de status.' });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Gerenciar Status Page</h1>
            
            {/* Services Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 text-[#FFB833]">Status dos Serviços</h2>
                <div className="grid gap-4">
                    {services.map(svc => (
                        <div key={svc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="font-medium text-gray-700">{svc.name}</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant={svc.status === 'operational' ? 'default' : 'outline'} className={svc.status === 'operational' ? 'bg-green-500 hover:bg-green-600' : ''} onClick={() => updateServiceStatus(svc.id, 'operational')}>Operational</Button>
                                <Button size="sm" variant={svc.status === 'degraded' ? 'default' : 'outline'} className={svc.status === 'degraded' ? 'bg-yellow-500 hover:bg-yellow-600' : ''} onClick={() => updateServiceStatus(svc.id, 'degraded')}>Degraded</Button>
                                <Button size="sm" variant={svc.status === 'down' ? 'default' : 'outline'} className={svc.status === 'down' ? 'bg-red-500 hover:bg-red-600' : ''} onClick={() => updateServiceStatus(svc.id, 'down')}>Down</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Incidents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#FFB833]">Incidentes Recentes</h2>
                    <Dialog>
                        <DialogTrigger asChild><Button className="bg-[#FFA500]"><Plus className="w-4 h-4 mr-2" /> Novo Incidente</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Reportar Incidente</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <Input placeholder="Título do Incidente" value={incidentForm.title} onChange={e => setIncidentForm({...incidentForm, title: e.target.value})} />
                                <select className="w-full border rounded-md p-2" value={incidentForm.severity} onChange={e => setIncidentForm({...incidentForm, severity: e.target.value})}>
                                    <option value="minor">Menor (Monitorando)</option>
                                    <option value="major">Maior (Impacto Parcial)</option>
                                    <option value="critical">Crítico (Fora do Ar)</option>
                                </select>
                                <Textarea placeholder="Descrição e atualizações..." value={incidentForm.description} onChange={e => setIncidentForm({...incidentForm, description: e.target.value})} />
                                <Button className="w-full bg-[#FFA500]" onClick={handleAddIncident}>Publicar</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {incidents.map(inc => (
                        <div key={inc.id} className="p-4 border rounded-lg flex justify-between items-start hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    {inc.severity === 'critical' && <XCircle className="w-4 h-4 text-red-500" />}
                                    {inc.severity === 'major' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                                    {inc.severity === 'minor' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                                    {inc.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{inc.description}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(inc.date).toLocaleString()}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500" onClick={() => deleteIncident(inc.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                    {incidents.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum incidente reportado.</p>}
                </div>
            </div>
        </div>
    );
};
export default AdminStatusPageManagement;
