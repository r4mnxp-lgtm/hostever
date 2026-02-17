
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [data] = await db.query('SELECT * FROM invoices');
      setInvoices(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#FFB833] mb-6 font-sora">Faturas</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Descrição</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Vencimento</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Valor</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="p-4 font-mono text-sm">#{inv.id}</td>
                <td className="p-4 text-sm text-gray-700">{inv.description}</td>
                <td className="p-4 text-sm text-gray-600">{inv.date}</td>
                <td className="p-4 font-bold text-gray-800">R$ {inv.amount}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {inv.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                </td>
                <td className="p-4 text-right">
                   <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientInvoices;
