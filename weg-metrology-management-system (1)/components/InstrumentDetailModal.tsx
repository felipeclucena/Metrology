
import React, { useState } from 'react';
import { 
  X, 
  Ruler, 
  History, 
  MapPin, 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  ShieldCheck, 
  ArrowRightLeft,
  Package,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  Briefcase,
  Settings2,
  Filter,
  FileDown
} from 'lucide-react';
import { Instrument, CalibrationResult, CalibrationRecord, WorkOrder } from '../types';
import { demoOS, demoCalibrations } from '../services/mockData';

interface Props {
  instrument: Instrument | null;
  isOpen: boolean;
  onClose: () => void;
}

const InstrumentDetailModal: React.FC<Props> = ({ instrument, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'movements' | 'files'>('info');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'calibration' | 'maintenance'>('all');

  if (!isOpen || !instrument) return null;

  // Filtrar histórico consolidado do instrumento
  const calibrations = demoCalibrations.filter(cal => cal.instrumentId === instrument.id);
  const workOrders = demoOS.filter(os => os.instrumentCode === instrument.code);

  const consolidatedHistory = [
    ...calibrations.map(c => ({ ...c, historyType: 'calibration' as const })),
    ...workOrders.map(o => ({ ...o, historyType: 'maintenance' as const, date: o.openedDate }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredHistory = consolidatedHistory.filter(item => {
    if (historyFilter === 'all') return true;
    return item.historyType === historyFilter;
  });

  const handleExportHistory = (format: 'PDF' | 'CSV' | 'XLS') => {
    alert(`Exportando histórico consolidado de ${instrument.code} em formato ${format}...`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Ruler size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{instrument.code}</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${instrument.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {instrument.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200`}>
                  {instrument.availability}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{instrument.type} • {instrument.manufacturer} • {instrument.model}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => handleExportHistory('CSV')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-slate-200">
              <Download size={18} /> CSV
            </button>
            <button onClick={() => handleExportHistory('PDF')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-all shadow-md">
              <Printer size={18} /> Imprimir PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 ml-4">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex px-6 bg-white border-b border-slate-100">
          {[
            { id: 'info', label: 'Informações Gerais', icon: <FileText size={18} /> },
            { id: 'history', label: 'Histórico Consolidado', icon: <Activity size={18} /> },
            { id: 'movements', label: 'Movimentações', icon: <ArrowRightLeft size={18} /> },
            { id: 'files', label: 'Documentos e Anexos', icon: <Package size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 relative ${
                activeTab === tab.id 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Settings2 size={14} /> Características Técnicas
                  </h3>
                  <div className="space-y-4">
                    <DetailItem label="Nº de Série" value={instrument.serialNumber} />
                    <DetailItem label="Patrimônio" value={instrument.patrimony} />
                    <DetailItem label="Indicação" value={instrument.indication} />
                    <DetailItem label="Classificação" value={instrument.classification} />
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Faixa de Medição</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-100 rounded text-sm font-bold text-slate-700">
                          {instrument.range.start} - {instrument.range.end} {instrument.range.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin size={14} /> Localização Organizacional
                  </h3>
                  <div className="space-y-4 text-sm">
                    <DetailItem label="Unidade" value={instrument.location.unit} />
                    <DetailItem label="Departamento" value={instrument.location.department} />
                    <DetailItem label="Centro de Custo" value={instrument.location.costCenter} />
                    <DetailItem label="Metrologia" value={instrument.metrologyFilial} />
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-blue-400" /> Plano Metrológico
                  </h3>
                  <div className="space-y-5">
                    <DetailItem label="Periodicidade" value={`${instrument.periodicityMonths} meses`} dark />
                    <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-xl">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Próxima Calibração</p>
                      <p className="text-xl font-black text-blue-100 tracking-tight">{instrument.nextCalibrationDate}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Resultado Última Cal.</p>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black uppercase ${
                        instrument.lastCalibrationResult === CalibrationResult.APPROVED ? 'bg-emerald-500 text-white' : 
                        instrument.lastCalibrationResult === CalibrationResult.REJECTED ? 'bg-rose-500 text-white' : 'bg-slate-600 text-slate-200'
                      }`}>
                        {instrument.lastCalibrationResult || 'Não Realizada'}
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                      value={historyFilter} 
                      onChange={(e) => setHistoryFilter(e.target.value as any)}
                      className="text-xs font-bold text-slate-600 border-none bg-transparent focus:ring-0"
                    >
                      <option value="all">Todo o Histórico</option>
                      <option value="calibration">Calibrações</option>
                      <option value="maintenance">Manutenções/OS</option>
                    </select>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleExportHistory('XLS')} className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 flex items-center gap-1">
                      <FileDown size={14} /> XLS
                    </button>
                    <button onClick={() => handleExportHistory('PDF')} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-600 flex items-center gap-1">
                      <Printer size={14} /> PDF
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Evento / Tipo</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Referência</th>
                      <th className="px-6 py-4">Responsável</th>
                      <th className="px-6 py-4">Status / Resultado</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredHistory.map((item: any) => (
                      <tr key={item.id} className="text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              {item.historyType === 'calibration' ? 
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded"><ShieldCheck size={14} /></div> :
                                <div className="p-1.5 bg-amber-50 text-amber-600 rounded"><Briefcase size={14} /></div>
                              }
                              <span className="font-bold text-slate-800">{item.historyType === 'calibration' ? 'Calibração' : 'Manutenção'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold">{item.date}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-xs font-mono font-bold text-slate-500">{item.certificateNumber || item.id}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase">{item.laboratoryName || item.type}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-xs">{item.technician}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                            item.result === CalibrationResult.APPROVED || item.status === 'Concluída' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            item.result === CalibrationResult.REJECTED || item.status === 'Cancelada' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {item.result || item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredHistory.length === 0 && (
                  <div className="p-12 text-center text-slate-400 italic">Nenhum evento registrado com os filtros selecionados.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-4">
              {instrument.movements?.map((mov) => (
                <div key={mov.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <ArrowRightLeft size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-black text-slate-800">{mov.date}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase">{mov.type}</span>
                      </div>
                      <p className="text-xs text-slate-500">Origem: <span className="font-bold">{mov.origin}</span> → Destino: <span className="font-bold">{mov.destination}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-end gap-2">
                      <User size={12} /> {mov.responsible}
                    </p>
                    <p className="text-[10px] italic text-slate-400">{mov.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FileCard name="Manual do Fabricante" size="2.4 MB" date="10/01/2023" />
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 cursor-pointer transition-all">
                <Package size={32} className="mb-2" />
                <span className="text-xs font-black uppercase tracking-wider">Novo Anexo</span>
              </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
            <ShieldCheck size={14} className="text-emerald-500" />
            Rastreabilidade Auditoria OK • Sistema Integrado
          </div>
          <button onClick={onClose} className="px-8 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm">
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; dark?: boolean }> = ({ label, value, dark }) => (
  <div>
    <p className={`text-[10px] font-bold uppercase mb-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
    <p className={`text-sm font-bold ${dark ? 'text-slate-100' : 'text-slate-700'}`}>{value}</p>
  </div>
);

const FileCard: React.FC<{ name: string; size: string; date: string }> = ({ name, size, date }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer">
    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
      <FileText size={20} />
    </div>
    <div className="flex-1">
      <h4 className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{name}</h4>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-slate-400 font-bold">{size}</span>
        <span className="text-[10px] text-slate-400 font-bold">{date}</span>
      </div>
    </div>
    <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500" />
  </div>
);

export default InstrumentDetailModal;
