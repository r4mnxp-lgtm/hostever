import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogData } from '@/hooks/useBlogData';
import NotFound from '@/pages/NotFound';
import { Calendar, User, Tag, ArrowLeft, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BlogPost = () => {
  const { slug } = useParams();
  const { posts } = useBlogData();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  const postDate = new Date(post.date).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>{post.title} - HostEver Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <article className="max-w-4xl mx-auto pb-20">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wide"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
          
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <Share2 className="w-4 h-4 text-gray-600" />
             </Button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 text-center max-w-3xl mx-auto">
           <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6 font-medium">
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full uppercase text-xs font-bold tracking-wider">
                {post.tags[0] || 'Artigo'}
              </span>
              <span className="flex items-center">
                 <Calendar className="w-4 h-4 mr-2 opacity-70" /> {postDate}
              </span>
              <span className="flex items-center">
                 <Clock className="w-4 h-4 mr-2 opacity-70" /> 5 min leitura
              </span>
           </div>
           
           <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight font-sora">
             {post.title}
           </h1>
           
           <p className="text-xl text-gray-600 leading-relaxed">
             {post.excerpt}
           </p>
        </header>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
               "prose prose-lg max-w-none prose-headings:font-sora prose-headings:font-bold prose-headings:text-gray-900",
               "prose-p:text-gray-600 prose-p:leading-8",
               "prose-a:text-primary prose-a:font-semibold hover:prose-a:text-green-600 prose-a:no-underline",
               "prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic",
               "prose-img:rounded-xl prose-img:shadow-md"
            )}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Footer / Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100">
             <div className="flex flex-wrap gap-2">
               {post.tags.map(tag => (
                 <span key={tag} className="inline-flex items-center text-sm font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                   <Tag className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                   {tag}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;