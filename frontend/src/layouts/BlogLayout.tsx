import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Rss, Mail, Phone } from 'lucide-react';

// Use main header/footer if possible, or a simplified version that matches the design system
// For a "completely restructured blog as internal page only", we should likely reuse the main Header 
// to keep it consistent with the "corporate appearance". 
// However, if the layout wraps Routes, we might want a specific sub-layout wrapper.
// Given the instruction "Clean up header/top section for corporate appearance", 
// reusing the main site header is the most consistent approach.

const BlogLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 
         Since the main App.jsx likely renders the Header outside of this Layout if the route is nested,
         we don't need to re-render Header here if this is used inside a Route that already has a Header.
         Checking App.jsx structure...
         App.jsx: <Route path="/blog/*" element={<BlogLayout>...</BlogLayout>} />
         And App.jsx wraps everything with <Header /> except Auth pages.
         So we DO NOT need a separate header here.
      */}
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      
      {/* Optional: Specific Blog Sidebar or Bottom CTA could go here */}
    </div>
  );
};

export default BlogLayout;