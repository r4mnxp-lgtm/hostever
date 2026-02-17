
import React, { useCallback, useState } from 'react';
import { useBlogData } from '@/hooks/useBlogData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2, Trash2, Plus, Search, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const AdminBlogManagement = () => {
    const { posts, savePost, deletePost } = useBlogData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: '', excerpt: '', content: '', status: 'draft', imageUrl: '' });

    const handleSave = () => {
        savePost({ ...formData, id: editingPost?.id });
        setIsDialogOpen(false);
        setEditingPost(null);
        setFormData({ title: '', category: '', excerpt: '', content: '', status: 'draft', imageUrl: '' });
        showToast({ title: 'Sucesso', description: 'Post salvo com sucesso.' });
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData(post);
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este post?')) {
            deletePost(id);
            showToast({ title: 'Excluído', description: 'Post removido.', variant: 'destructive' });
        }
    };

    const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Gerenciar Blog</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#FFA500]" onClick={() => { setEditingPost(null); setFormData({ title: '', category: '', excerpt: '', content: '', status: 'draft', imageUrl: '' }) }}>
                            <Plus className="w-4 h-4 mr-2" /> Novo Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>{editingPost ? 'Editar Post' : 'Novo Post'}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Título" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Categoria" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                <select className="border rounded-md px-3" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="draft">Rascunho</option>
                                    <option value="published">Publicado</option>
                                </select>
                            </div>
                            <Input placeholder="URL da Imagem" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            <Textarea placeholder="Resumo" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                            <Textarea placeholder="Conteúdo (HTML)" className="h-40 font-mono text-xs" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                            <Button className="w-full bg-[#FFA500]" onClick={handleSave}>Salvar Post</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input className="pl-10" placeholder="Buscar posts..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Título</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Categoria</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPosts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-[#FFB833]">{post.title}</td>
                                <td className="p-4 text-sm text-gray-600">{post.category}</td>
                                <td className="p-4"><Badge variant={post.status === 'published' ? 'success' : 'default'}>{post.status === 'published' ? 'Publicado' : 'Rascunho'}</Badge></td>
                                <td className="p-4 text-right space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}><Edit2 className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminBlogManagement;
