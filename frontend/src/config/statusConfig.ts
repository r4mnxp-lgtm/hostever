import { CheckCircle, Clock, AlertCircle, XCircle, Wrench } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const initialServices = [
  {
    id: 'dedicated_servers',
    name: {
      en: 'Dedicated Servers',
      pt: 'Servidores Dedicados'
    },
    status: 'operational',
  },
  {
    id: 'vps_cloud',
    name: {
      en: 'VPS Cloud',
      pt: 'VPS Cloud'
    },
    status: 'operational',
  },
  {
    id: 'colocation',
    name: {
      en: 'Colocation',
      pt: 'Colocation'
    },
    status: 'operational',
  },
  {
    id: 'ip_transit',
    name: {
      en: 'IP Transit',
      pt: 'Trânsito IP'
    },
    status: 'operational',
  },
  {
    id: 'control_panel',
    name: {
      en: 'Control Panel',
      pt: 'Painel de Controle'
    },
    status: 'operational',
  },
  {
    id: 'management_api',
    name: {
      en: 'Management API',
      pt: 'API de Gerenciamento'
    },
    status: 'operational',
  }
];

export const initialIncidents = [];

export const initialMaintenances = [];

export const statusConfig = {
  operational: {
    text: { en: 'Operational', pt: 'Operacional' },
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500'
  },
  maintenance: {
    text: { en: 'Maintenance', pt: 'Manutenção' },
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500'
  },
  degraded: {
    text: { en: 'Degraded Performance', pt: 'Performance Degradada' },
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500'
  },
  outage: {
    text: { en: 'Outage', pt: 'Indisponível' },
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500'
  }
};

export const incidentStatusConfig = {
  investigating: {
    text: { en: 'Investigating', pt: 'Investigando' },
    color: 'bg-yellow-500',
  },
  identified: {
    text: { en: 'Identified', pt: 'Identificado' },
    color: 'bg-blue-500',
  },
  monitoring: {
    text: { en: 'Monitoring', pt: 'Monitorando' },
    color: 'bg-purple-500',
  },
  resolved: {
    text: { en: 'Resolved', pt: 'Resolvido' },
    color: 'bg-green-500',
  },
  completed: {
    text: { en: 'Completed', pt: 'Concluído' },
    color: 'bg-green-500',
  }
};

export const maintenanceStatusConfig = {
  scheduled: { text: { en: 'Scheduled', pt: 'Agendada' }, icon: Clock, color: 'text-blue-500' },
  in_progress: { text: { en: 'In Progress', pt: 'Em Progresso' }, icon: Wrench, color: 'text-orange-500' },
  completed: { text: { en: 'Completed', pt: 'Concluída' }, icon: CheckCircle, color: 'text-green-500' },
};