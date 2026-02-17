
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Briefcase, Phone, Calendar, ArrowUpRight } from 'lucide-react';

const AccountExecutiveDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-bold text-[#FFB833] font-sora">Executive Panel</h1>
         <p className="text-gray-500">Welcome back, Carlos. Here's your performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-l-4 border-l-[#FFA500]">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-[#FFA500]"><Users className="w-6 h-6" /></div>
                  <span className="text-green-600 text-xs font-bold flex items-center">+12% <ArrowUpRight className="w-3 h-3" /></span>
               </div>
               <div className="text-2xl font-bold text-[#FFB833]">42</div>
               <div className="text-sm text-gray-500">Active Clients</div>
            </CardContent>
         </Card>
         <Card className="border-l-4 border-l-[#FFA500]">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Briefcase className="w-6 h-6" /></div>
                  <span className="text-green-600 text-xs font-bold flex items-center">+5% <ArrowUpRight className="w-3 h-3" /></span>
               </div>
               <div className="text-2xl font-bold text-[#FFB833]">18</div>
               <div className="text-sm text-gray-500">Open Leads</div>
            </CardContent>
         </Card>
         <Card className="border-l-4 border-l-[#FFA500]">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-50 p-2 rounded-lg text-green-600"><Phone className="w-6 h-6" /></div>
               </div>
               <div className="text-2xl font-bold text-[#FFB833]">24</div>
               <div className="text-sm text-gray-500">Calls this week</div>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Lead Generation Tool */}
         <div className="lg:col-span-1">
            <Card className="h-full">
               <CardHeader className="bg-[#FFB833] text-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="w-5 h-5" /> Quick Lead Gen</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <Input placeholder="Client Name" />
                  <Input placeholder="Email Address" />
                  <Input placeholder="Phone Number" />
                  <Input placeholder="Product Interest" />
                  <Textarea placeholder="Initial Notes..." />
                  <Button className="w-full bg-[#FFA500] hover:bg-[#FFA500]">Create Lead</Button>
               </CardContent>
            </Card>
         </div>

         {/* My Clients List */}
         <div className="lg:col-span-2">
            <Card className="h-full">
               <CardHeader>
                  <CardTitle className="text-lg text-[#FFB833]">My Priority Clients</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 border-y border-gray-100">
                        <tr>
                           <th className="p-4 text-gray-600">Client</th>
                           <th className="p-4 text-gray-600">Company</th>
                           <th className="p-4 text-gray-600">Last Contact</th>
                           <th className="p-4 text-gray-600 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {[1,2,3,4].map(i => (
                           <tr key={i} className="hover:bg-gray-50">
                              <td className="p-4 font-bold text-[#FFB833]">Client Name {i}</td>
                              <td className="p-4 text-gray-600">Company {i} Ltd</td>
                              <td className="p-4 text-gray-500">2 days ago</td>
                              <td className="p-4 text-right">
                                 <Button variant="outline" size="sm" className="h-8">Contact</Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default AccountExecutiveDashboard;
