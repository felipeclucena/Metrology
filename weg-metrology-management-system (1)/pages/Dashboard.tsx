
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Clock,
  TrendingUp,
  Ruler,
  Wrench,
  CheckCircle2,
  ArrowUpRight,
  Target,
  ClipboardList,
  Filter,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  History
} from 'lucide-react';
import { DataService } from '../services/mockData';
import { Instrument, WorkOrder, OSStatus, OSPriority } from '../types';

const Dashboard: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [workCenterFilter, setWorkCenterFilter] = useState('all');
  const [evolutionView, setEvolutionView] = useState<'annual' | 'monthly'>('annual');

  useEffect(() => {
    const data = DataService.getInstruments();
    setInstruments(data);
    setLoading(false);
  }, []);

  // Dados Mockados para os novos requisitos
  const monthlyTrendData = [
    { month: 'Jan', realizadas: 45, previstas: 48 },
    { month: 'Fev', realizadas: 52, previstas: 50 },
    { month: 'Mar', realizadas: 48, previstas: 55 },
    { month: 'Abr', realizadas: 61, previstas: 60 },
    { month: 'Mai', realizadas: 35, previstas: 42 },
  ];

  const dailyPlannedData = [
    { day: 1, qtd: 2 }, { day: 3, qtd: 5 }, { day: 5, qtd: 3 }, { day: 8, qtd: 8 },
    { day: 10, qtd: 4 }, { day: 15, qtd: 12 }, { day: 20, qtd: 6 }, { day: 25, qtd: 3 },
    { day: 30, qtd: 2 }
  ];

  const equipmentEvolutionAnnual = [
    { period: '2020', total: 850 },
    { period: '2021', total: 920 },
    { period: '2022', total: 980 },
    { period: '2023', total: 1020 },
    { period: '2024', total: 1052 },
  ];

  const equipmentEvolutionMonthly = [
    { period: 'Jan', total: 1020 },
    { period: 'Fev', total: 1035 },
    { period: 'Mar', total: 1042 },
    { period: 'Abr', total: 1050 },
    { period: 'Mai', total: 1052 },
  ];

  const openWorkOrders: (WorkOrder & { technician: string })[] = [
    { id: 'OS-8891', instrumentCode: 'EQP-1052', instrumentName: 'Micrômetro Externo', type: 'Calibração', serviceType: 'Externo', priority: OSPriority.HIGH, status: OSStatus.IN_PROGRESS, openedDate: '2024-05-15', forecastDate: '2024-05-22', technician: 'Ricardo Oliveira', estimatedCost: 150, realCost: 0, partsReplaced: [], notes: '' },
    { id: 'OS-8892', instrumentCode: 'EQP-2001', instrumentName: 'Multímetro Digital', type: 'Manutenção', serviceType: 'Interno', priority: OSPriority.URGENT, status: OSStatus.OPEN, openedDate: '2024-05-18', forecastDate: '2024-05-20', technician: 'Ana Paula', estimatedCost: 80, realCost: 0, partsReplaced: [], notes: '' },
    { id: 'OS-8895', instrumentCode: 'EQP-3040', instrumentName: 'Relógio Comparador', type: 'Calibração', serviceType: 'Externo', priority: OSPriority.MEDIUM, status: OSStatus.OPEN, openedDate: '2024-05-19', forecastDate: '2024-05-25', technician: 'João Silva', estimatedCost: 120, realCost: 0, partsReplaced: [], notes: '' },
  ];

  // Cálculos de Indicadores
  const totalInstruments = instruments.length;
  const nonConformingCount = instruments.filter(i => i.nonConforming).length;
  const ncPercentage = totalInstruments > 0 ? ((nonConformingCount / totalInstruments) * 100).toFixed(1) : "0";
  
  // Acompanhamento do cronograma (Mês atual: Maio)
  const currentMonthData = monthlyTrendData[4];
  const schedulePercentage = ((currentMonthData.realizadas / currentMonthData.previstas) * 100).toFixed(1);
  const missingCalibrations = currentMonthData.previstas - currentMonthData.realizadas;

  if (loading) return <div className="p-8 text-slate-500 font-bold">Carregando indicadores...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header com Filtro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Metrológico</h1>
          <p className="text-slate-500 text-sm">Visão consolidada da planta Jaraguá do Sul • Unidade WMO</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
              <Filter size={16} className="text-blue-500" />
              <select 
                className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none"
                value={workCenterFilter}
                onChange={(e) => setWorkCenterFilter(e.target.value)}
              >
                <option value="all">Todos Centros de Trabalho</option>
                <option value="usinagem">Laboratorio Mecänico</option>
                <option value="manutencao">Laboratório Eletricidade</option>
                <option value="qualidade">Laboratório Temperatura</option>
              </select>
           </div>
           <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
              <Calendar size={20} />
           </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          icon={<Ruler size={20} />} 
          label="Instrumentos" 
          value={totalInstruments.toString()} 
          subtext="Total em inventário"
          color="bg-blue-600"
        />
        
        <StatCard 
          icon={<AlertTriangle size={20} />} 
          label="Taxa Não Conformidade" 
          value={`${ncPercentage}%`} 
          subtext={`${nonConformingCount} instrumentos NC`}
          color="bg-rose-500"
          isCritical={Number(ncPercentage) > 5}
        />

        <StatCard 
          icon={<Briefcase size={20} />} 
          label="Ordens em Aberto" 
          value="12" 
          subtext="Total geral pendente"
          color="bg-blue-800"
        />

        {/* Atendimento de Serviços Externos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-slate-900">
              <ExternalLink size={20} />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              Serviços Externos
            </span>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Atendimento</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 py-1">
              <div className="flex items-center justify-between border-b border-slate-50"><span className="text-[9px] text-slate-500 font-bold">No prazo</span><span className="text-xs font-black text-emerald-600">08</span></div>
              <div className="flex items-center justify-between border-b border-slate-50"><span className="text-[9px] text-slate-500 font-bold">Atrasado</span><span className="text-xs font-black text-rose-600">02</span></div>
              <div className="flex items-center justify-between border-b border-slate-50"><span className="text-[9px] text-slate-500 font-bold">Análise</span><span className="text-xs font-black text-amber-600">01</span></div>
              <div className="flex items-center justify-between border-b border-slate-50"><span className="text-[9px] text-slate-500 font-bold">Concluído</span><span className="text-xs font-black text-blue-600">01</span></div>
            </div>
            <div className="pt-2 space-y-1">
               <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-slate-400 uppercase">Lead Time:</span><span className="text-[11px] font-black text-slate-700">6,0 d</span></div>
      
            </div>
          </div>
        </div>

        {/* Cronograma Detalhado */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all bg-emerald-50/10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-emerald-600">
              <Target size={20} />
            </div>
            <span className="text-[20px] font-black text-emerald-600 tracking-tighter">
              {schedulePercentage}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cronograma do Mês</p>
            <div className="pt-2 space-y-1.5">
               <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-slate-500 uppercase">Realizado:</span><span className="text-xs font-black text-emerald-700">{currentMonthData.realizadas}</span></div>
               <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-slate-500 uppercase">Planejado:</span><span className="text-xs font-black text-slate-700">{currentMonthData.previstas}</span></div>
               <div className="flex justify-between items-center pt-1 border-t border-emerald-100"><span className="text-[9px] font-bold text-rose-500 uppercase">Faltante:</span><span className="text-xs font-black text-rose-600">{missingCalibrations}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Execução Mensal */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Execução Mensal vs Previsto
            </h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Bar dataKey="previstas" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="realizadas" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Previsto por Dia */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-8">
            <Calendar size={18} className="text-amber-500" />
            Previsto por Dia (Maio)
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyPlannedData}>
                <defs>
                  <linearGradient id="colorQtd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="qtd" stroke="#f59e0b" fillOpacity={1} fill="url(#colorQtd)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Evolução de Equipamentos (Toggle Anual/Mensal) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" />
            Evolução do Parque de Instrumentos
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setEvolutionView('annual')}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${evolutionView === 'annual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Anual
            </button>
            <button 
              onClick={() => setEvolutionView('monthly')}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${evolutionView === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Mensal
            </button>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionView === 'annual' ? equipmentEvolutionAnnual : equipmentEvolutionMonthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Line type="monotone" name="Total de Equipamentos" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Ordens em Aberto */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList size={16} className="text-blue-500" />
            Lista Detalhada de Ordens em Aberto
          </h3>
          <button className="text-[10px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1">
            Visualizar Todas <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço / Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prazos</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {openWorkOrders.map((os) => (
                <tr key={os.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${os.type === 'Calibração' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                        {os.type === 'Calibração' ? <ShieldCheck size={20} /> : <Wrench size={20} />}
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800">{os.id}</span>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">{os.instrumentCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{os.type}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{os.serviceType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                      <User size={12} className="text-slate-400" />
                      {os.technician}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{os.forecastDate}</span>
                      <span className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1">
                        <Clock size={8} /> Expira breve
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-widest ${
                      os.status === OSStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  subtext: string, 
  color: string,
  trend?: string,
  isCritical?: boolean
}> = ({ icon, label, value, subtext, color, trend, isCritical }) => (
  <div className={`bg-white p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${isCritical ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
        {icon}
      </div>
      {trend && (
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-0.5">
      <h3 className={`text-2xl font-black tracking-tight ${isCritical ? 'text-rose-700' : 'text-slate-800'}`}>{value}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-[10px] font-bold text-slate-500 uppercase">{subtext}</p>
    </div>
  </div>
);

export default Dashboard;
