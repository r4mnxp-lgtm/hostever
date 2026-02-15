
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, UserPlus, ArrowRight } from 'lucide-react';

const LeadManagement = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: 'Roberto Santos', email: 'roberto@startup.com', phone: '(11) 98877-6655', status: 'new', interest: 'Dedicated Server', assignedTo: 'Carlos (Exec)' },
    { id: 2, name: 'Julia Market', email: 'julia@shop.com', phone: '(11) 91122-3344', status: 'contacted', interest: 'VPS Cloud', assignedTo: 'Carlos (Exec)' },
    { id: 3, name: 'Enterprise SA', email: 'contact@enterprise.sa', phone: '(21) 3344-5566', status: 'qualified', interest: 'Colocation', assignedTo: 'Unassigned' },
  ]);

  const updateStatus = (id, newStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'qualified': return 'bg-purple-100 text-purple-700';
      case 'converted': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Lead Management</h1>
        <Button className="bg-[#FFA500]"><UserPlus className="w-4 h-4 mr-2" /> New Lead</Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
           <Input className="pl-9" placeholder="Search leads..." />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Status</SelectItem>
             <SelectItem value="new">New</SelectItem>
             <SelectItem value="contacted">Contacted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
             <tr>
                <th className="p-4 font-semibold text-gray-600">Lead Name</th>
                <th className="p-4 font-semibold text-gray-600">Interest</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Assigned To</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                   <td className="p-4">
                      <div className="font-bold text-[#FFB833]">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                   </td>
                   <td className="p-4 text-gray-600">{lead.interest}</td>
                   <td className="p-4">
                      <Badge className={getStatusColor(lead.status)}>{lead.status.toUpperCase()}</Badge>
                   </td>
                   <td className="p-4 text-gray-600">{lead.assignedTo}</td>
                   <td className="p-4 text-right">
                      <Select onValueChange={(v) => updateStatus(lead.id, v)}>
                         <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Update Status" /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                         </SelectContent>
                      </Select>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadManagement;
