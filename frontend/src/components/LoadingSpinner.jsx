import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-background bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[9999]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-4 border-t-primary border-border rounded-full"
    />
  </div>
);

export default LoadingSpinner;