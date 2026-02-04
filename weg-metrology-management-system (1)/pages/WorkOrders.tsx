
import React, { useState } from 'react';
import { demoOS } from '../services/mockData';
import { OSStatus, OSPriority, WorkOrder } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench,
  ChevronRight,
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  ArrowUpRight,
  // Added missing ShieldCheck icon import
  ShieldCheck
} from 'lucide-react';

const WorkOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<WorkOrder[]>(demoOS);

  const filtered = orders.filter(os => {
    const matchesSearch = os.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          os.instrumentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          os.instrumentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || os.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (p: OSPriority) => {
    switch(p) {
      case OSPriority.URGENT: return 'text-rose-600 bg-rose-50 border-rose-100';
      case OSPriority.HIGH: return 'text-amber-600 bg-amber-50 border-amber-100';
      case OSPriority.MEDIUM: return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (s: OSStatus) => {
    switch(s) {
      case OSStatus.COMPLETED: return <CheckCircle2 size={14} className="text-emerald-500" />;
      case OSStatus.IN_PROGRESS: return <Clock size={14} className="text-blue-500" />;
      case OSStatus.CANCELLED: return <AlertCircle size={14} className="text-slate-400" />;
      default: return <Clock size={14} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ordens de Serviço</h1>
          <p className="text-slate-500 text-sm">Controle de calibração, manutenção e ajustes técnicos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs shadow-sm">
            <Download size={16} className="mr-2 text-slate-400" />
            Exportar CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-bold text-xs">
            <Plus size={16} className="mr-2" />
            Nova O.S.
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Wrench size={20} />} label="Total em Aberto" value="12" color="bg-blue-500" />
        <StatCard icon={<AlertCircle size={20} />} label="Vencendo hoje" value="03" color="bg-rose-500" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Concluídas (Mês)" value="28" color="bg-emerald-500" />
        <StatCard icon={<DollarSign size={20} />} label="Custo Acumulado" value="U$ 4.2k" color="bg-slate-800" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por OS, Instrumento ou Técnico..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-bold">
            <Filter size={14} className="mr-2 text-slate-400" />
            <select 
              className="bg-transparent focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* OS Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço / Prioridade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Técnico / Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prazos</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((os) => (
                <tr key={os.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${os.type === 'Calibração' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                        {os.type === 'Calibração' ? <ShieldCheck size={20} /> : <Wrench size={20} />}
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800">{os.id}</span>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">{os.instrumentCode} • {os.instrumentName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{os.type}</span>
                        <span className="text-[10px] font-bold text-slate-400">• {os.serviceType}</span>
                      </div>
                      <span className={`inline-flex self-start items-center px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getPriorityColor(os.priority)}`}>
                        {os.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                        <User size={12} className="text-slate-400" />
                        {os.technician}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
                        {getStatusIcon(os.status)}
                        {os.status}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase">
                        <Calendar size={10} className="mr-1" /> Aberta: {os.openedDate}
                      </div>
                      <div className="flex items-center text-[10px] font-black text-blue-600 uppercase">
                        <ArrowUpRight size={10} className="mr-1" /> Prev: {os.forecastDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalhes">
                        <ChevronRight size={20} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold">
            <Wrench className="mx-auto mb-4 opacity-10" size={64} />
            Nenhuma Ordem de Serviço encontrada.
          </div>
        )}

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500 font-bold tracking-tight">
            Exibindo <span className="text-slate-800">{filtered.length}</span> ordens processadas
          </p>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-400 uppercase mr-2">Página 1 de 1</span>
             <button className="p-1 rounded bg-white border border-slate-200 text-slate-400 cursor-not-allowed"><ChevronRight size={16} className="rotate-180" /></button>
             <button className="p-1 rounded bg-white border border-slate-200 text-slate-600"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

export default WorkOrders;
