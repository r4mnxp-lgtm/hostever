
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialPosts = [
    {
        id: uuidv4(),
        title: 'Bem-vindo ao nosso novo Blog!',
        slug: 'bem-vindo-ao-nosso-novo-blog',
        author: 'Equipe HostEver',
        date: new Date().toISOString(),
        category: 'Novidades',
        status: 'published',
        imageUrl: 'https://images.unsplash.com/photo-1499750310159-52f0f837ce4c',
        excerpt: 'Estamos muito felizes em anunciar o lançamento do nosso blog! Aqui você encontrará as últimas notícias, insights do setor e atualizações sobre nossos serviços.',
        content: `<p>É com grande entusiasmo que inauguramos este espaço para compartilhar conhecimento...</p>`
    }
];

export const useBlogData = () => {
    const [posts, setPosts] = useState(() => {
        try {
            const saved = localStorage.getItem('hostever-blog-posts');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) { console.error(e) }
        return initialPosts;
    });

    useEffect(() => {
        localStorage.setItem('hostever-blog-posts', JSON.stringify(posts));
    }, [posts]);

    const savePost = (post) => {
        if (post.id) {
            setPosts(current => current.map(p => p.id === post.id ? { ...p, ...post } : p));
        } else {
            setPosts(current => [...current, { ...post, id: uuidv4(), date: new Date().toISOString() }]);
        }
    };

    const deletePost = (id) => {
        setPosts(current => current.filter(p => p.id !== id));
    };

    const getPublishedPosts = () => posts.filter(p => p.status === 'published');

    return { posts, savePost, deletePost, getPublishedPosts };
};
