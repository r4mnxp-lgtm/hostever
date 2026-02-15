import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Página Não Encontrada - Avyra Data Centers</title>
                <meta name="description" content="A página que você está procurando não foi encontrada." />
            </Helmet>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 120,
                    }}
                >
                    <Frown className="w-24 h-24 mx-auto text-primary mb-6" />
                    <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800 mb-4">404</h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">
                        Página Não Encontrada
                    </h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
                        Oops! Parece que a página que você tentou acessar não existe ou está em construção.
                        Que tal voltar ao início?
                    </p>
                    <Button asChild size="lg" className="hero-gradient text-white">
                        <Link to="/">Voltar para a Página Inicial</Link>
                    </Button>
                </motion.div>
            </div>
        </>
    );
};

export default NotFound;