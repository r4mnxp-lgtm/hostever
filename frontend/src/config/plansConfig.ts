// Configuração de planos com IDs fixos para o sistema de checkout

export const plansDatabase = {
  // VPS Cloud
  'vps-br-2gb': { id: 'vps-br-2gb', name: 'VPS Brasil 2GB', type: 'vps', location: 'br', specs: { vcpu: '2 vCPU @ 3.6GHz', ram: '2 GB RAM', ssd: '10 GB SSD SATA' }, price: '34.99', popular: false },
  'vps-br-4gb': { id: 'vps-br-4gb', name: 'VPS Brasil 4GB', type: 'vps', location: 'br', specs: { vcpu: '2 vCPU @ 3.6GHz', ram: '4 GB RAM', ssd: '30 GB SSD SATA' }, price: '59.99', popular: true },
  'vps-br-8gb': { id: 'vps-br-8gb', name: 'VPS Brasil 8GB', type: 'vps', location: 'br', specs: { vcpu: '3 vCPU @ 3.6GHz', ram: '8 GB RAM', ssd: '60 GB SSD SATA' }, price: '84.99', popular: false },
  'vps-br-12gb': { id: 'vps-br-12gb', name: 'VPS Brasil 12GB', type: 'vps', location: 'br', specs: { vcpu: '4 vCPU @ 3.6GHz', ram: '12 GB RAM', ssd: '60 GB SSD SATA' }, price: '114.99', popular: false },
  'vps-br-16gb': { id: 'vps-br-16gb', name: 'VPS Brasil 16GB', type: 'vps', location: 'br', specs: { vcpu: '5 vCPU @ 3.6GHz', ram: '16 GB RAM', ssd: '60 GB SSD SATA' }, price: '139.99', popular: false },
  'vps-br-24gb': { id: 'vps-br-24gb', name: 'VPS Brasil 24GB', type: 'vps', location: 'br', specs: { vcpu: '6 vCPU @ 3.6GHz', ram: '24 GB RAM', ssd: '80 GB SSD SATA' }, price: '164.99', popular: false },
  
  'vps-us-2gb': { id: 'vps-us-2gb', name: 'VPS USA 2GB', type: 'vps', location: 'us', specs: { vcpu: '2 vCPU @ 4.0GHz', ram: '2 GB RAM', ssd: '20 GB NVMe' }, price: '29.99', popular: false },
  'vps-us-4gb': { id: 'vps-us-4gb', name: 'VPS USA 4GB', type: 'vps', location: 'us', specs: { vcpu: '2 vCPU @ 4.0GHz', ram: '4 GB RAM', ssd: '40 GB NVMe' }, price: '49.99', popular: true },
  'vps-us-8gb': { id: 'vps-us-8gb', name: 'VPS USA 8GB', type: 'vps', location: 'us', specs: { vcpu: '4 vCPU @ 4.0GHz', ram: '8 GB RAM', ssd: '80 GB NVMe' }, price: '79.99', popular: false },

  // VPS Economy
  'eco-br-start': { id: 'eco-br-start', name: 'Eco Start BR', type: 'vps-economy', location: 'br', specs: { vcpu: '1 vCPU', ram: '1 GB RAM', ssd: '20 GB SSD' }, price: '14.99', popular: false },
  'eco-br-plus': { id: 'eco-br-plus', name: 'Eco Plus BR', type: 'vps-economy', location: 'br', specs: { vcpu: '2 vCPU', ram: '2 GB RAM', ssd: '40 GB SSD' }, price: '24.99', popular: true },
  'eco-br-turbo': { id: 'eco-br-turbo', name: 'Eco Turbo BR', type: 'vps-economy', location: 'br', specs: { vcpu: '2 vCPU', ram: '4 GB RAM', ssd: '60 GB SSD' }, price: '39.99', popular: false },
  
  'eco-us-start': { id: 'eco-us-start', name: 'Eco Start USA', type: 'vps-economy', location: 'us', specs: { vcpu: '1 vCPU', ram: '1 GB RAM', ssd: '25 GB SSD' }, price: '12.99', popular: false },
  'eco-us-plus': { id: 'eco-us-plus', name: 'Eco Plus USA', type: 'vps-economy', location: 'us', specs: { vcpu: '2 vCPU', ram: '2 GB RAM', ssd: '50 GB SSD' }, price: '22.99', popular: true },

  // VPS Games
  'game-br-starter': { id: 'game-br-starter', name: 'Plano Starter', type: 'vps-games', location: 'br', specs: { vcpu: '2', ram: '4', ssd: '80' }, price: '49.90', popular: false },
  'game-br-pro': { id: 'game-br-pro', name: 'Plano Pro Gamer', type: 'vps-games', location: 'br', specs: { vcpu: '4', ram: '8', ssd: '160' }, price: '99.90', popular: true },
  'game-br-elite': { id: 'game-br-elite', name: 'Plano Elite', type: 'vps-games', location: 'br', specs: { vcpu: '6', ram: '12', ssd: '240' }, price: '149.90', popular: false },
  'game-br-legend': { id: 'game-br-legend', name: 'Plano Lendário', type: 'vps-games', location: 'br', specs: { vcpu: '8', ram: '16', ssd: '320' }, price: '199.90', popular: false },
  
  'game-us-starter': { id: 'game-us-starter', name: 'Game US Starter', type: 'vps-games', location: 'us', specs: { vcpu: '2', ram: '6', ssd: '100' }, price: '39.90', popular: false },
  'game-us-pro': { id: 'game-us-pro', name: 'Game US Pro', type: 'vps-games', location: 'us', specs: { vcpu: '4', ram: '12', ssd: '200' }, price: '89.90', popular: true },
  'game-us-elite': { id: 'game-us-elite', name: 'Game US Elite', type: 'vps-games', location: 'us', specs: { vcpu: '8', ram: '24', ssd: '400' }, price: '169.90', popular: false },

  // Servidores Dedicados
  'ded-br-xeon-e5-2650': { id: 'ded-br-xeon-e5-2650', name: 'Dual Xeon E5-2650 v2', type: 'dedicated', location: 'br', specs: { cpu: '6c/12t @ 4.40GHz', ram: '128GB DDR3', ssd: '1TB SSD' }, bandwidth: '1 Gbps', price: '599', available: true },
  'ded-br-xeon-e5-2670': { id: 'ded-br-xeon-e5-2670', name: 'Dual Xeon E5-2670 v2', type: 'dedicated', location: 'br', specs: { cpu: '6c/12t @ 4.60GHz', ram: '128GB DDR3', ssd: '1TB SSD' }, bandwidth: '1 Gbps', price: '699', available: true },
  'ded-br-storage': { id: 'ded-br-storage', name: 'Storage Monster 40TB', type: 'dedicated', location: 'br', specs: { cpu: 'Xeon E5-2630L v3', ram: '64GB DDR4', ssd: '4x 10TB SAS' }, bandwidth: '1 Gbps', price: '799', popular: true, available: true },
  'ded-br-epyc': { id: 'ded-br-epyc', name: 'Dual AMD EPYC 7763', type: 'dedicated', location: 'br', specs: { cpu: '128c/256t @ 3.50GHz', ram: '1TB DDR4', ssd: '4x 3.84TB NVMe' }, bandwidth: '10 Gbps', price: '4500', popular: false, available: true },
  
  'ded-us-ryzen-9950x': { id: 'ded-us-ryzen-9950x', name: 'Ryzen 9 9950x3D', type: 'dedicated', location: 'us', specs: { cpu: '16c/32t @ 4.3GHz/5.7GHz', ram: '192 GB DDR4', ssd: '2TB SSD NVMe M.2' }, bandwidth: '10 Gbps', price: '2400', available: true },
  'ded-us-intel-i9': { id: 'ded-us-intel-i9', name: 'Intel i9-13900K', type: 'dedicated', location: 'us', specs: { cpu: '24c/32t @ 3.0GHz/5.8GHz', ram: '128 GB DDR5', ssd: '2x 2TB NVMe Gen4' }, bandwidth: '1 Gbps', price: '1800', available: true },
};

// Helper para pegar plano por ID
export const getPlanById = (id) => {
  return plansDatabase[id] || null;
};

// Helper para pegar planos por tipo e localização
export const getPlansByType = (type, location = null) => {
  return Object.values(plansDatabase).filter(plan => {
    if (location) {
      return plan.type === type && plan.location === location;
    }
    return plan.type === type;
  });
};

// Formato antigo para compatibilidade
export const initialPlans = {
  vps: {
    br: getPlansByType('vps', 'br'),
    us: getPlansByType('vps', 'us'),
  },
  vpsEconomy: {
    br: getPlansByType('vps-economy', 'br'),
    us: getPlansByType('vps-economy', 'us'),
  },
  dedicated: {
    br: getPlansByType('dedicated', 'br'),
    us: getPlansByType('dedicated', 'us'),
  },
  games: {
    br: getPlansByType('vps-games', 'br'),
    us: getPlansByType('vps-games', 'us'),
  }
};
