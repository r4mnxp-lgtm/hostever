
export const productsConfig = [
  {
    id: 'vps-cloud',
    name: {
      pt: 'VPS Cloud',
      en: 'VPS Cloud'
    },
    description: {
      pt: 'Performance balanceada para aplicações web e bancos de dados.',
      en: 'Balanced performance for web apps and databases.'
    },
    price: 'R$ 29,90',
    link: '/servidor-vps',
    specs: ['2 vCPU', '4GB RAM', '80GB NVMe', 'Traffic Ilimitado'],
    category: 'vps',
    color: '#FFB833'
  },
  {
    id: 'vps-economy',
    name: {
      pt: 'VPS Economy',
      en: 'VPS Economy'
    },
    description: {
      pt: 'Melhor custo-benefício para projetos iniciais e testes.',
      en: 'Best value for starter projects and testing.'
    },
    price: 'R$ 19,90',
    link: '/servidor-vps',
    specs: ['1 vCPU', '2GB RAM', '40GB SSD', 'Traffic Ilimitado'],
    category: 'vps',
    color: '#FFA500'
  },
  {
    id: 'vps-games',
    name: {
      pt: 'VPS Games',
      en: 'VPS Games'
    },
    description: {
      pt: 'Alta frequência e proteção Anti-DDoS Game inclusa.',
      en: 'High frequency and Anti-DDoS Game protection included.'
    },
    price: 'R$ 49,90',
    link: '/servidor-vps',
    specs: ['Ryzen 9 5950X', '8GB RAM', '120GB NVMe', 'Anti-DDoS Game'],
    category: 'vps',
    color: '#FFD700'
  },
  {
    id: 'dedicated-server',
    name: {
      pt: 'Servidores Dedicados',
      en: 'Dedicated Servers'
    },
    description: {
      pt: 'Poder computacional bruto e exclusivo para sua empresa.',
      en: 'Raw and exclusive computing power for your business.'
    },
    price: 'R$ 399,00',
    link: '/servidores-dedicados',
    specs: ['Intel Xeon E5', '64GB RAM', '2x 960GB NVMe', '1Gbps Uplink'],
    category: 'dedicated',
    color: '#FFCC00'
  }
];

export const productColorPalette = {
  primary: '#FFB833',
  secondary: '#FFA500',
  accent: '#FFD700',
  complement: '#FFCC00',
  light: '#FFF4CC',
  dark: '#CC9300'
};
