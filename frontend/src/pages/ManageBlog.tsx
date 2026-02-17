import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useBlogData } from '@/hooks/useBlogData';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ManageBlog = () => {
    const { posts, savePost, deletePost } = useBlogData();
    const toastHook = useToast();
  
  const showToast = useCallback((options) => {
    if (toastHook && typeof toastHook.toast === 'function') {
      toastHook.toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  }, [toastHook]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenModal = (post = null) => {
        if (post) {
            setCurrentPost({
                ...post,
                tags: post.tags.join(', ')
            });
            setIsEditing(true);
        } else {
            setCurrentPost({ id: uuidv4(), title: '', author: 'Equipe Avyra', tags: '', imageUrl: '', excerpt: '', content: '' });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const handleSavePost = () => {
        if (!currentPost.title || !currentPost.content || !currentPost.excerpt) {
            showToast({
                title: "Campos obrigatórios",
                description: "Título, resumo e conteúdo são obrigatórios.",
                variant: "destructive",
            });
            return;
        }
        
        const postToSave = {
            ...currentPost,
            tags: currentPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        savePost(postToSave);
        setModalOpen(false);
        showToast({
            title: isEditing ? "Post Atualizado!" : "Post Criado!",
            description: "A publicação do blog foi salva com sucesso.",
        });
    };

    const handleDeletePost = (postId) => {
        deletePost(postId);
        showToast({
            title: "Post Excluído!",
            description: "A publicação foi removida com sucesso.",
            variant: "destructive",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Blog - Avyra Data Centers</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Gerenciar Blog</h1>
                <p className="text-gray-600">Crie, edite ou remova publicações do blog.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Publicações</h2>
                    <Button onClick={() => handleOpenModal()} className="hero-gradient text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Publicação
                    </Button>
                </div>
                 <div className="space-y-4">
                    {posts.length > 0 ? posts.sort((a, b) => new Date(b.date) - new Date(a.date)).map((post) => (
                        <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border gap-4">
                            <div className="flex items-center gap-4">
                                <FileText className="w-8 h-8 text-orange-500 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Por {post.author} em {new Date(post.date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(post)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-6">Nenhuma publicação cadastrada.</p>
                    )}
                </div>
            </motion.div>
            
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Publicação' : 'Nova Publicação'}</DialogTitle>
                        <DialogDescription>
                           Preencha as informações da publicação. O conteúdo aceita HTML.
                        </DialogDescription>
                    </DialogHeader>
                    {currentPost && (
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" name="title" value={currentPost.title} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="author">Autor</Label>
                                <Input id="author" name="author" value={currentPost.author} onChange={handleInputChange} />
                            </div>
                             <div>
                                <Label htmlFor="excerpt">Resumo (visível na listagem)</Label>
                                <Textarea id="excerpt" name="excerpt" value={currentPost.excerpt} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="content">Conteúdo (HTML)</Label>
                                <Textarea id="content" name="content" value={currentPost.content} onChange={handleInputChange} rows={10} />
                            </div>
                            <div>
                                <Label htmlFor="imageUrl">URL da Imagem de Destaque</Label>
                                <Input id="imageUrl" name="imageUrl" value={currentPost.imageUrl} onChange={handleInputChange} placeholder="https://exemplo.com/imagem.png" />
                            </div>
                            <div>
                                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                                <Input id="tags" name="tags" value={currentPost.tags} onChange={handleInputChange} placeholder="notícia, tecnologia, cloud" />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSavePost} className="hero-gradient text-white">
                            {isEditing ? 'Salvar Alterações' : 'Publicar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ManageBlog;