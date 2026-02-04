
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/mockData';
import { Instrument, OperationalStatus, Availability } from '../types';
import { STATUS_COLORS } from '../constants';
import InstrumentFormModal from '../components/InstrumentFormModal';
import InstrumentDetailModal from '../components/InstrumentDetailModal';
import { 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  Search,
  Clock,
  ExternalLink
} from 'lucide-react';

const Instruments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  // Carrega instrumentos do DataService ao montar
  useEffect(() => {
    setInstruments(DataService.getInstruments());
  }, []);

  const filtered = instruments.filter(inst => {
    const matchesSearch = inst.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inst.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSave = (newInstrument: Partial<Instrument>) => {
    const completeInstrument = {
      ...newInstrument,
      id: `inst-${Date.now()}`,
      nonConforming: false,
      movements: [],
      calibrationHistory: []
    } as Instrument;
    
    // Salva no DataService (LocalStorage)
    const updatedList = DataService.saveInstrument(completeInstrument);
    setInstruments(updatedList);
    setIsModalOpen(false);
  };

  const handleOpenDetail = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsDetailOpen(true);
  };

  const handleGlobalExport = () => {
    if (filtered.length === 0) {
      alert('Não há dados para exportar com os filtros atuais.');
      return;
    }

    const headers = ['Código', 'Tipo', 'Fabricante', 'Modelo', 'Nº Série', 'Patrimônio', 'Status', 'Disponibilidade', 'Próxima Calibração', 'Depto'];
    const rows = filtered.map(inst => [
      inst.code, inst.type, inst.manufacturer, inst.model, inst.serialNumber, 
      inst.patrimony, inst.status, inst.availability, inst.nextCalibrationDate, inst.location.department
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventario_weg_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Instrumentos</h1>
          <p className="text-slate-500">Gerenciamento completo do inventário metrológico</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleGlobalExport}
            className="flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm active:scale-95"
          >
            <Download size={18} className="mr-2 text-blue-600" />
            Exportar Geral (CSV)
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-bold text-sm active:scale-95"
          >
            <Plus size={18} className="mr-2" />
            Novo Instrumento
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por código, tipo, fabricante..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-bold">
            <Filter size={14} className="mr-2 text-slate-400" />
            <select 
              className="bg-transparent focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value={OperationalStatus.ACTIVE}>Ativos</option>
              <option value={OperationalStatus.INACTIVE}>Inativos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipamento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibilidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Depto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inst) => (
                <tr 
                  key={inst.id} 
                  className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDetail(inst)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{inst.code}</span>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{inst.type} • {inst.manufacturer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase border ${STATUS_COLORS[inst.availability as keyof typeof STATUS_COLORS] || 'bg-slate-100 text-slate-600'}`}>
                        {inst.availability}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">
                    {inst.nextCalibrationDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">
                    {inst.location.department}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 text-slate-300 hover:text-blue-600"><ExternalLink size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InstrumentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      <InstrumentDetailModal isOpen={isDetailOpen} instrument={selectedInstrument} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
};

export default Instruments;
