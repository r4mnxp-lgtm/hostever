
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const BillingInvoicing = () => {
  const [invoices] = useState([
    { id: 'INV-2024-001', client: 'Tech Corp', amount: 500.00, date: '2024-02-01', status: 'paid' },
    { id: 'INV-2024-002', client: 'John Doe', amount: 29.90, date: '2024-02-03', status: 'pending' },
    { id: 'INV-2024-003', client: 'Creative Agency', amount: 150.00, date: '2024-01-25', status: 'overdue' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Billing & Invoicing</h1>
        <Button className="bg-[#FFA500]">Create Invoice</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
               <div className="text-sm font-bold text-blue-600 uppercase mb-1">Total Revenue (Month)</div>
               <div className="text-3xl font-bold text-[#FFB833]">R$ 14.500,00</div>
            </CardContent>
         </Card>
         <Card className="bg-yellow-50 border-yellow-100">
            <CardContent className="p-6">
               <div className="text-sm font-bold text-yellow-600 uppercase mb-1">Pending</div>
               <div className="text-3xl font-bold text-[#FFB833]">R$ 2.300,00</div>
            </CardContent>
         </Card>
         <Card className="bg-red-50 border-red-100">
            <CardContent className="p-6">
               <div className="text-sm font-bold text-red-600 uppercase mb-1">Overdue</div>
               <div className="text-3xl font-bold text-[#FFB833]">R$ 450,00</div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#FFB833]">Recent Invoices</h3>
            <div className="relative w-64">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
               <Input className="pl-9 h-9" placeholder="Search invoice..." />
            </div>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                  <th className="p-4 font-semibold text-gray-600">Invoice #</th>
                  <th className="p-4 font-semibold text-gray-600">Client</th>
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Amount</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                     <td className="p-4 font-mono font-medium text-[#FFB833]">{inv.id}</td>
                     <td className="p-4 font-medium">{inv.client}</td>
                     <td className="p-4 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                     <td className="p-4 font-bold text-[#FFB833]">R$ {inv.amount.toFixed(2)}</td>
                     <td className="p-4">
                        <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'pending' ? 'secondary' : 'destructive'}>
                           {inv.status.toUpperCase()}
                        </Badge>
                     </td>
                     <td className="p-4 text-right space-x-2">
                        <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Send className="w-4 h-4" /></Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default BillingInvoicing;
