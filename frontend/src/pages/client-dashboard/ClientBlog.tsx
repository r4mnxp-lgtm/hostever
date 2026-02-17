
import React, { useState } from 'react';
import { useBlogData } from '@/hooks/useBlogData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientBlog = () => {
    const { getPublishedPosts } = useBlogData();
    const [search, setSearch] = useState('');
    const posts = getPublishedPosts().filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-[#FFB833] font-sora">Blog & Novidades</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input className="pl-9 bg-white" placeholder="Buscar artigos..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full group">
                        {post.imageUrl && (
                            <div className="h-48 overflow-hidden">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                            <span className="text-xs font-bold text-[#FFA500] uppercase tracking-wider mb-2">{post.category}</span>
                            <h3 className="text-xl font-bold text-[#FFB833] mb-3 leading-tight">{post.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-4">
                                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</div>
                                <Button variant="link" className="text-[#FFA500] p-0 h-auto font-bold" asChild>
                                    <Link to={`/blog/${post.slug}`}>Ler Mais</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Nenhum artigo encontrado.
                </div>
            )}
        </div>
    );
};
export default ClientBlog;
