
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Save, Code, Trash2, Plus, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const INITIAL_TEMPLATES = [
  { id: 1, name: 'Welcome Email', subject: 'Welcome to HostEver!', content: '<h1>Welcome, {{name}}!</h1><p>Thank you for joining HostEver.</p>' },
  { id: 2, name: 'Payment Confirmation', subject: 'Payment Received', content: '<h1>Payment Confirmed</h1><p>We received your payment of {{amount}}.</p>' },
  { id: 3, name: 'Invoice', subject: 'New Invoice Available', content: '<h1>Invoice #{{invoice_id}}</h1><p>Please pay by {{due_date}}.</p>' },
];

const EmailTemplateEditor = () => {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(INITIAL_TEMPLATES[0]);
  const [editMode, setEditMode] = useState('visual'); // visual or code
  const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

  const handleSave = () => {
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
    showToast({ title: "Template Saved", description: "Your email template has been updated." });
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplate.id === id) setSelectedTemplate(templates[0] || null);
    showToast({ title: "Template Deleted", variant: "destructive" });
  };

  const handleCreate = () => {
    const newTemplate = { id: Date.now(), name: 'New Template', subject: 'Subject Line', content: '<p>New content here...</p>' };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Email Templates</h1>
        <Button onClick={handleCreate} className="bg-[#FFA500]"><Plus className="w-4 h-4 mr-2" /> Create Template</Button>
      </div>

      <div className="flex gap-6 flex-1 h-full min-h-0">
        {/* Sidebar List */}
        <div className="w-64 bg-white rounded-xl border border-gray-200 overflow-y-auto shrink-0 shadow-sm">
          {templates.map(template => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTemplate?.id === template.id ? 'bg-blue-50 border-l-4 border-l-[#FFA500]' : ''}`}
            >
              <div className="font-semibold text-sm text-[#FFB833]">{template.name}</div>
              <div className="text-xs text-gray-500 truncate">{template.subject}</div>
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {selectedTemplate ? (
            <Card className="flex-1 flex flex-col shadow-lg border-0">
              <CardHeader className="py-4 border-b flex flex-row justify-between items-center bg-gray-50 rounded-t-xl">
                <div className="w-full max-w-lg space-y-2">
                  <Input 
                    value={selectedTemplate.name} 
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                    className="font-bold text-lg bg-transparent border-transparent hover:border-gray-200 focus:bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Subject:</span>
                    <Input 
                      value={selectedTemplate.subject} 
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                      className="h-8 text-sm bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(selectedTemplate.id)}><Trash2 className="w-4 h-4" /></Button>
                  <Button onClick={handleSave} className="bg-[#FFB833]"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                </div>
              </CardHeader>
              
              <div className="flex-1 flex flex-col min-h-0">
                <Tabs defaultValue="visual" className="flex-1 flex flex-col" onValueChange={setEditMode}>
                  <div className="px-6 pt-4 border-b">
                    <TabsList>
                      <TabsTrigger value="visual"><Eye className="w-4 h-4 mr-2" /> Visual Editor</TabsTrigger>
                      <TabsTrigger value="code"><Code className="w-4 h-4 mr-2" /> HTML Source</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="visual" className="flex-1 p-6 bg-gray-50/50 mt-0 overflow-auto">
                    <div 
                      className="bg-white shadow-sm p-8 min-h-full rounded-lg border border-gray-200 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                    />
                  </TabsContent>

                  <TabsContent value="code" className="flex-1 p-0 mt-0">
                    <Textarea 
                      value={selectedTemplate.content}
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                      className="w-full h-full font-mono text-sm p-6 border-0 focus-visible:ring-0 resize-none bg-[#1e1e1e] text-gray-300"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a template to edit</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
