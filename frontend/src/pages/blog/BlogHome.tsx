import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogData } from '@/hooks/useBlogData';
import { Calendar, ArrowRight, Search, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PostCard = ({ post, index, featured = false }) => {
  const postDate = new Date(post.date).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-200",
        featured ? "md:col-span-2 md:flex-row md:items-stretch" : ""
      )}
    >
      <Link to={`/blog/${post.slug}`} className={cn("block overflow-hidden relative", featured ? "md:w-1/2" : "h-52")}>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity z-10" />
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
             <span className="text-4xl font-bold opacity-20">HOST</span>
          </div>
        )}
      </Link>
      
      <div className={cn("p-6 flex flex-col", featured ? "md:w-1/2 justify-center p-8" : "")}>
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
           {post.tags && post.tags[0] && (
             <span className="text-primary">{post.tags[0]}</span>
           )}
           <span className="w-1 h-1 rounded-full bg-gray-300" />
           <span>{postDate}</span>
        </div>
        
        <h2 className={cn("font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors", featured ? "text-2xl md:text-3xl" : "text-xl")}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
          {post.excerpt.length > (featured ? 150 : 100) 
            ? post.excerpt.substring(0, (featured ? 150 : 100)) + "..." 
            : post.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
           <span className="text-xs font-medium text-gray-500 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" /> 5 min de leitura
           </span>
           <span className="text-xs font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
              Ler artigo <ArrowRight className="ml-1 w-3.5 h-3.5" />
           </span>
        </div>
      </div>
    </motion.div>
  );
};

const BlogHome = () => {
  const { posts } = useBlogData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const allTags = ['Todos', ...new Set(posts.flatMap(p => p.tags))];

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'Todos' || post.tags.includes(selectedCategory);
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog Corporativo - HostEver</title>
        <meta name="description" content="Insights sobre infraestrutura, data centers, cloud computing e tecnologia corporativa." />
      </Helmet>
      
      <div className="max-w-6xl mx-auto pb-20">
        
        {/* Header Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-sora tracking-tight">
             Blog & Insights
           </h1>
           <p className="text-lg text-gray-600 leading-relaxed">
             Acompanhe nossas atualizações sobre infraestrutura de TI, segurança de dados e inovações em cloud computing.
           </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-8 border-b border-gray-100">
           <div className="flex flex-wrap justify-center gap-2">
              {allTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedCategory(tag)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all",
                      selectedCategory === tag 
                        ? "bg-gray-900 text-white shadow-md" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {tag}
                  </button>
              ))}
           </div>
           
           <div className="relative w-full md:w-72">
              <Input 
                  type="text"
                  placeholder="Buscar artigos..."
                  className="pl-10 h-10 bg-white border-gray-200 focus:border-gray-900 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           </div>
        </div>

        {/* Content Grid */}
        {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Featured Post takes full width on top if it exists and no search/filter is overly restrictive */}
                {selectedCategory === 'Todos' && !searchTerm && featuredPost && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
                        <PostCard post={featuredPost} index={0} featured={true} />
                    </div>
                )}
                
                {(selectedCategory === 'Todos' && !searchTerm ? remainingPosts : filteredPosts).map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Nenhum artigo encontrado para sua busca.</p>
                <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedCategory('Todos');}}>
                   Limpar filtros
                </Button>
            </div>
        )}

      </div>
    </>
  );
};

export default BlogHome;