
import React from 'react';
import { 
  LayoutDashboard, 
  Ruler, 
  Wrench, 
  FileText, 
  AlertTriangle, 
  Building2, 
  Settings,
  ShieldCheck,
  Database,
  CalendarCheck,
  ExternalLink
} from 'lucide-react';

export const APP_NAME = "WEG Metrology";

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { label: 'Instrumentos', icon: <Ruler size={20} />, path: '/instruments' },
  { label: 'Calibrações', icon: <CalendarCheck size={20} />, path: '/calibrations' },
  { label: 'Ordens de Serviço', icon: <Wrench size={20} />, path: '/os' },
  { label: 'Serviços Externos', icon: <ExternalLink size={20} />, path: '/external-services' },
  { label: 'Relatórios', icon: <FileText size={20} />, path: '/reports' },
  { label: 'Laboratórios', icon: <Building2 size={20} />, path: '/laboratories' },
  { label: 'Integração Autolab', icon: <Database size={20} />, path: '/integration' },
  { label: 'Configurações', icon: <Settings size={20} />, path: '/settings' },
];

export const STATUS_COLORS = {
  'Ativo': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Inativo': 'bg-slate-100 text-slate-700 border-slate-200',
  'Em Uso': 'bg-blue-100 text-blue-700 border-blue-200',
  'Calibração Externa': 'bg-purple-100 text-purple-700 border-purple-200',
  'Calibração Vencida': 'bg-amber-100 text-amber-700 border-amber-200',
  'Reprovado': 'bg-rose-100 text-rose-700 border-rose-200',
  'Sucateado': 'bg-slate-800 text-white border-slate-900',
};
