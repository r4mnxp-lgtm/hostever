
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="HostEver" 
                className="h-9 w-auto object-contain" 
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Infraestrutura de alta performance com Data Centers no Brasil. Potência, estabilidade e suporte especializado para o seu negócio.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#FFB833] hover:bg-[#FFA500] hover:text-white hover:border-[#FFA500] transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#FFB833] hover:bg-[#FFA500] hover:text-white hover:border-[#FFA500] transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#FFB833] hover:bg-[#FFA500] hover:text-white hover:border-[#FFA500] transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#FFB833] hover:bg-[#FFA500] hover:text-white hover:border-[#FFA500] transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-bold text-[#FFB833] tracking-widest uppercase mb-6">Navegação</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">Início</Link></li>
              <li><Link to="/products" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">Produtos</Link></li>
              <li><Link to="/nossa-historia" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">Sobre Nós</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">Blog</Link></li>
              <li><Link to="/status" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">Status dos Serviços</Link></li>
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-sm font-bold text-[#FFB833] tracking-widest uppercase mb-6">Soluções</h3>
            <ul className="space-y-4">
              <li><Link to="/servidor-vps" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">VPS Cloud</Link></li>
              <li><Link to="/servidor-vps" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">VPS Games</Link></li>
              <li><Link to="/servidores-dedicados" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">Servidores Dedicados</Link></li>
              <li><Link to="/servidor-vps" className="text-gray-500 hover:text-[#FFA500] transition-colors text-sm font-medium">VPS Economy</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-[#FFB833] tracking-widest uppercase mb-6">Contato</h3>
            <ul className="space-y-5 text-sm font-medium text-gray-500">
                <li className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#FFA500]/10 flex items-center justify-center text-[#FFA500] flex-shrink-0 mt-[-4px]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="group-hover:text-[#FFB833] transition-colors">contato@hostever.com.br</span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#FFA500]/10 flex items-center justify-center text-[#FFA500] flex-shrink-0 mt-[-4px]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="group-hover:text-[#FFB833] transition-colors">+55 (11) 4002-8922</span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#FFA500]/10 flex items-center justify-center text-[#FFA500] flex-shrink-0 mt-[-4px]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="group-hover:text-[#FFB833] transition-colors leading-relaxed">
                    Av. Paulista, 1106 - Bela Vista<br/>São Paulo - SP, 01310-100
                  </span>
                </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFA500]" />
            <p>© {currentYear} HostEver Tecnologia. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/legal/politica-de-privacidade" className="hover:text-[#FFA500] transition-colors">Política de Privacidade</Link>
            <Link to="/legal/termos-de-uso" className="hover:text-[#FFA500] transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
