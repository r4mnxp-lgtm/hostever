
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye, Edit2, Trash2, Mail, Phone, Building } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ClientManagement = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', phone: '+55 11 99999-9999', status: 'active', joined: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@agency.com', company: 'Creative Agency', phone: '+55 11 88888-8888', status: 'inactive', joined: '2023-03-22' },
  ]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

  const handleDelete = (id) => {
    if(window.confirm('Delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
      showToast({ title: 'Client Deleted' });
    }
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setIsViewOpen(true);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Client Management</h1>
        <Button className="bg-[#FFA500]">Add New Client</Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Client</th>
              <th className="p-4 font-semibold text-gray-600">Contact</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[#FFB833]">{client.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Building className="w-3 h-3" /> {client.company}</div>
                </td>
                <td className="p-4">
                  <div className="text-gray-600 flex items-center gap-2"><Mail className="w-3 h-3" /> {client.email}</div>
                  <div className="text-gray-600 flex items-center gap-2 text-xs mt-1"><Phone className="w-3 h-3" /> {client.phone}</div>
                </td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {client.status.toUpperCase()}
                   </span>
                </td>
                <td className="p-4 text-gray-600">{new Date(client.joined).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(client)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(client.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
             <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid grid-cols-2 gap-8 py-4">
               <div>
                  <h3 className="font-bold text-gray-500 text-xs uppercase mb-2">Personal Info</h3>
                  <p className="font-bold text-lg text-[#FFB833]">{selectedClient.name}</p>
                  <p className="text-gray-600">{selectedClient.company}</p>
                  <p className="text-gray-600 mt-2">{selectedClient.email}</p>
                  <p className="text-gray-600">{selectedClient.phone}</p>
               </div>
               <div>
                  <h3 className="font-bold text-gray-500 text-xs uppercase mb-2">Active Services</h3>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                     <div className="font-bold text-[#FFB833]">VPS Cloud Pro</div>
                     <div className="text-gray-500 text-xs">Expires: 20/12/2024</div>
                  </div>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
