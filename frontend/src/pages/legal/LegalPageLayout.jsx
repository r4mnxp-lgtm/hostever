import React from 'react';
import { motion } from 'framer-motion';

const LegalPageLayout = ({ title, content, lastUpdated }) => {
    return (
        <div className="bg-background text-foreground">
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                            {title}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Última atualização: {lastUpdated}
                        </p>
                    </motion.div>
                </div>
            </section>
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground"
                    >
                        {content.split('\n').map((paragraph, index) => {
                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                return <h2 key={index}>{paragraph.replaceAll('**', '')}</h2>;
                            }
                            if (paragraph.trim() === '') {
                                return <br key={index} />;
                            }
                            return <p key={index}>{paragraph}</p>;
                        })}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LegalPageLayout;