
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientServersView = () => {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const fetchServers = async () => {
      const [data] = await db.query('SELECT * FROM servers');
      setServers(data);
    };
    fetchServers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Meus Servidores</h1>
        <Button className="bg-[#FFA500]">Novo Serviço</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600 text-sm">Hostname / IP</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Plano</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-sm text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {servers.map((server) => (
              <tr key={server.id} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="font-bold text-[#FFB833]">{server.hostname}</div>
                  <div className="text-xs text-gray-500">{server.ip}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{server.plan}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${server.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {server.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/client-dashboard/vps">
                      <Settings className="w-4 h-4 mr-2" /> Gerenciar
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientServersView;
