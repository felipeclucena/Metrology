
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Truck, 
  Settings,
  Wrench,
  ChevronRight,
  ChevronLeft,
  XCircle,
  AlertTriangle,
  LayoutGrid,
  ListFilter,
  ArrowUpDown
} from 'lucide-react';

const ExternalServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkCenter, setSelectedWorkCenter] = useState('');

  const workCenters = [
    { name: 'Laboratório mecânico - Jaraguá', id: 'LAB-MEC' },
    { name: 'Laboratório temperatura - Jaraguá', id: 'LAB-TEM' },
    { name: 'Laboratório de massa e pressão', id: 'LAB-MAS' },
    { name: 'Laboratório eletricidade - Jaraguá', id: 'LAB-ELE' },
    { name: 'Metrologia Geral - Jaraguá', id: 'MET-GER' }
  ];

  const returnStatusBars = [
    { label: 'Fora do prazo', count: 17, color: 'bg-[#e35a5a]' },
    { label: 'Atenção', count: 3, color: 'bg-[#f5c324]' },
    { label: '(Em branco)', count: 4, color: 'bg-[#b8d1f3]' }
  ];

  const externalOrders = [
    { cod: '22604', os: '68170/2025', start: '17/02/2025', daysOut: 352, equip: 'Teste de surto elétrico', returnDays: 16, section: 'Seção Bobinagem de Estatores', availability: 'Conserto externo', collaborator: 'Tiago Fra...', status: 'normal' },
    { cod: '52382', os: '94049/2025', start: '02/07/2025', daysOut: 217, equip: 'Dispositivo', returnDays: -180, section: 'Seção Maquinas de Pequeno P', availability: 'Conserto externo', collaborator: 'Alex', status: 'critical', codColor: 'text-[#e35a5a]' },
    { cod: '42318', os: '103162/2025', start: '26/08/2025', daysOut: 162, equip: 'Fonte de alta tensão', returnDays: 41, section: 'Seção Testes de Estações de R', availability: 'Conserto externo', collaborator: 'Tiago Fra...', status: 'normal' },
    { cod: '58517', os: '113459/2025', start: '22/10/2025', daysOut: 105, equip: 'Rugosímetro', returnDays: 2, section: 'Seção Usinagem de Eixos C II', availability: 'Conserto externo', collaborator: 'Alex', status: 'warning', codColor: 'text-[#f5c324]' },
    { cod: '86209', os: '117194/2025', start: '28/10/2025', daysOut: 72, equip: 'Calibrador tampão roscado', returnDays: -4, section: 'Seção Usinagem Tampas II D', availability: 'Conserto externo', collaborator: 'Alex', status: 'critical', codColor: 'text-[#e35a5a]' },
    { cod: '21171', os: '118593/2025', start: '03/11/2025', daysOut: 93, equip: 'Lavador de areia', returnDays: -4, section: 'Seção Moldagem A II', availability: 'Conserto externo', collaborator: 'Sergio', status: 'critical', codColor: 'text-[#e35a5a]' },
    { cod: '21584', os: '116318/2025', start: '05/11/2025', daysOut: 98, equip: 'Aquecedor indutivo', returnDays: 16, section: 'Seção Implantação de Soluções', availability: 'Conserto externo', collaborator: 'Geyse', status: 'normal' },
    { cod: '86332', os: '119116/2025', start: '12/11/2025', daysOut: 83, equip: 'Medidor de camada úmida', returnDays: -5, section: 'Seção Caldeiraria Cabines', availability: 'Conserto externo', collaborator: 'Alex', status: 'critical', codColor: 'text-[#e35a5a]' },
    { cod: '49810', os: '93958/2025', start: '12/11/2025', daysOut: 84, equip: 'Manômetro', returnDays: -47, section: 'Seção Ensaios (20MVA e EOL)', availability: 'Conserto externo', collaborator: 'Sergio', status: 'critical', codColor: 'text-[#e35a5a]' },
    { cod: '63245', os: '122953/2025', start: '19/11/2025', daysOut: 77, equip: 'Scanner óptico de digitalização', returnDays: -4, section: 'Seção Fabricação de Modelos', availability: 'Calibração externa', collaborator: 'Alex', status: 'critical', codColor: 'text-[#e35a5a]' },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-700 p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* Top 3-Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-full">
        {/* Card 1: Calibrações */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Truck size={28} strokeWidth={2} />
          </div>
          <div>
            <div className="text-4xl font-bold text-[#1e293b] leading-tight">27</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Calibrações externas</div>
          </div>
        </div>

        {/* Card 2: Consertos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-6">
          <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center shrink-0">
            <Wrench size={28} strokeWidth={2} />
          </div>
          <div>
            <div className="text-4xl font-bold text-[#1e293b] leading-tight">44</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consertos externos</div>
          </div>
        </div>

        {/* Card 3: Status de Retorno (Ex-Sidebar) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
             <ListFilter size={14} className="text-slate-400" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status de Retorno</span>
          </div>
          <div className="flex items-center gap-2 w-full h-8 bg-slate-100 rounded-lg overflow-hidden p-1">
             {returnStatusBars.map((status, idx) => (
                <div 
                  key={idx}
                  className={`${status.color} h-full first:rounded-l-md last:rounded-r-md flex items-center justify-center min-w-[30px]`}
                  style={{ flex: status.count }}
                  title={`${status.label}: ${status.count}`}
                >
                  <span className="text-[10px] font-black text-white">{status.count}</span>
                </div>
             ))}
          </div>
          <div className="flex justify-between mt-2">
             {returnStatusBars.map((status, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                   <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                   <span className="text-[9px] font-bold text-slate-500 uppercase">{status.label}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Main Table Container (Full Width) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Minimalist Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4 flex-1">
            {/* Minimalist Work Center Filter */}
            <div className="relative">
              <select 
                value={selectedWorkCenter}
                onChange={(e) => setSelectedWorkCenter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer min-w-[220px]"
              >
                <option value="">TODOS OS CENTROS</option>
                {workCenters.map((wc) => (
                  <option key={wc.id} value={wc.id}>{wc.name.toUpperCase()}</option>
                ))}
              </select>
              <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={12} />
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Pesquisar registros..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-blue-600 text-[10px] font-bold uppercase transition-colors">
                <Filter size={14} /> Filtros
             </button>
             <div className="h-4 w-px bg-slate-200 mx-1"></div>
             <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Download Excel"><Download size={18} /></button>
             <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Configurações da Grade"><Settings size={18} /></button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">CÓD <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50">Nº OS</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50">DATA INÍCIO</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50 text-center">DIAS FORA</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50">EQUIPAMENTO</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50 text-center">RETORNO</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50">SEÇÃO</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700/50">DISPONIBILIDADE</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">COLABORADOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {externalOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className={`px-6 py-3 text-[11px] font-bold ${order.codColor || 'text-slate-700'}`}>{order.cod}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 font-medium">{order.os}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">{order.start}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 text-center font-bold">{order.daysOut}</td>
                  <td className="px-6 py-3 text-[11px] text-slate-800 font-bold">{order.equip}</td>
                  <td className="px-4 py-3 text-[11px] text-center">
                    <div className="flex items-center justify-center gap-2">
                      {order.status === 'critical' && <XCircle size={14} fill="#e35a5a" className="text-white" />}
                      {order.status === 'warning' && <AlertTriangle size={14} fill="#f5c324" className="text-white" />}
                      <span className={`font-bold ${order.returnDays < 0 ? 'text-[#e35a5a]' : 'text-slate-600'}`}>
                        {order.returnDays}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{order.section}</td>
                  <td className="px-4 py-3 text-[11px]">
                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block w-full text-center ${
                       order.availability === 'Calibração externa' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                     }`}>
                       {order.availability}
                     </span>
                  </td>
                  <td className="px-6 py-3 text-[11px] text-slate-500 font-semibold">{order.collaborator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Mostrando 10 de 45 registros</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-8 h-8 text-[11px] font-bold rounded-lg border transition-all ${p === 1 ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalServices;
