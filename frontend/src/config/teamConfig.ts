import { v4 as uuidv4 } from 'uuid';

export const initialTeam = [
  { 
    id: uuidv4(), 
    name: 'Ramon Lucas', 
    role: 'Chief Executive Officer & Founder', 
    description: 'Lidera a visão estratégica e o crescimento da Avyra, com mais de 15 anos de experiência em infraestrutura de TI e data centers.', 
    imageUrl: '' 
  },
  { 
    id: uuidv4(), 
    name: 'Jediael Kaio', 
    role: 'Chief Financial Officer', 
    description: 'Comanda a estratégia financeira, garantindo a saúde fiscal e o crescimento sustentável da empresa.', 
    imageUrl: '' 
  },
  { 
    id: uuidv4(), 
    name: 'Jeferson Barbosa', 
    role: 'Chief Operating Officer', 
    description: 'Otimiza as operações diárias, assegurando eficiência e excelência na entrega de todos os serviços da Avyra.', 
    imageUrl: '' 
  },
  { 
    id: uuidv4(), 
    name: 'Wesley Ramos', 
    role: 'Solutions and Network Architect', 
    description: 'Projeta e gerencia a infraestrutura de rede, assegurando que a conectividade seja robusta e de alto desempenho.', 
    imageUrl: '' 
  },
  { 
    id: uuidv4(), 
    name: 'Lucas Silva', 
    role: 'Senior Account Manager', 
    description: 'Gerencia contas estratégicas e constrói relacionamentos de longo prazo com os principais clientes da Avyra.', 
    imageUrl: '' 
  }
];