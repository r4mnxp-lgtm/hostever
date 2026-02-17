import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

const osLogos = [
  { name: 'Ubuntu', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/682025132d786e245a420b9e84764d0d.png' },
  { name: 'CentOS', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/a2f2ae979c0952f559b1593c6f0592f8.png' },
  { name: 'Debian', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/87413009d17d0793c1f13b631e672051.png' },
  { name: 'AlmaLinux', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/716503c80ff554c2759e92594cc23f21.png' },
  { name: 'Rocky Linux', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/d9e2898f090d981792694b05a697621c.png' },
  { name: 'Windows Server', logo: 'https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/b4fb1a7f6a73c0598687b14088421876.png' },
];

const OperatingSystems = () => {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        <Trans i18nKey="vpsCloud.os.title">
                            Sistemas Operacionais <span className="gradient-text">Disponíveis</span>
                        </Trans>
                    </h2>
                    <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">{t('vpsCloud.os.subtitle')}</p>
                </div>
                <motion.div
                    className="flex justify-center items-center flex-wrap gap-x-12 gap-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {osLogos.map((os) => (
                        <motion.div
                            key={os.name}
                            className="flex flex-col items-center group"
                            variants={itemVariants}
                        >
                            <img src={os.logo} alt={os.name} className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110" />
                            <span className="mt-3 font-semibold text-muted-foreground">{os.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default OperatingSystems;