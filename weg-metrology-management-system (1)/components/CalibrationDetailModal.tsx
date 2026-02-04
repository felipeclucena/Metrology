
import React from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building2, 
  UserCheck, 
  Download, 
  ExternalLink, 
  Wrench, 
  ClipboardCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { CalibrationRecord, CalibrationResult, CalibrationType } from '../types';

interface Props {
  record: CalibrationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onViewInstrument?: (instrumentId: string) => void;
}

const CalibrationDetailModal: React.FC<Props> = ({ record, isOpen, onClose, onViewInstrument }) => {
  if (!isOpen || !record) return null;

  const getResultBadge = (result: CalibrationResult) => {
    switch(result) {
      case CalibrationResult.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case CalibrationResult.REJECTED: return 'bg-rose-100 text-rose-700 border-rose-200';
      case CalibrationResult.RELEASED: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${
              record.result === CalibrationResult.APPROVED ? 'bg-emerald-600' : 
              record.result === CalibrationResult.REJECTED ? 'bg-rose-600' : 'bg-amber-600'
            }`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Certificado {record.certificateNumber}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-wider ${getResultBadge(record.result)}`}>
                  {record.result}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Calibração {record.type} realizada em {record.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instrument Info Card */}
            <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Instrumento Vinculado
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{record.instrumentCode}</p>
                  <p className="text-sm font-bold text-slate-500">ID do Sistema: {record.instrumentId}</p>
                </div>
                {onViewInstrument && (
                  <button 
                    onClick={() => onViewInstrument(record.instrumentId)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-black border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    Ver Equipamento <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Dates Card */}
            <div className="bg-blue-600 p-6 rounded-2xl shadow-xl shadow-blue-500/20 text-white flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Próxima Calibração</p>
                <h4 className="text-xl font-black tracking-tight">{record.nextDate}</h4>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-100">
                <Calendar size={12} /> Periodicidade Atualizada
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Technical Details */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Building2 size={14} /> Dados do Laboratório
                </h3>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Laboratório</span>
                    <span className="text-sm font-black text-slate-800">{record.laboratoryName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">ID Laboratório</span>
                    <span className="text-xs font-mono font-bold text-slate-600">{record.laboratoryId}</span>
                  </div>
                  {record.osNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">O.S. Associada</span>
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-black">
                        <Wrench size={12} /> {record.osNumber}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <UserCheck size={14} /> Responsáveis
                </h3>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Executado por</p>
                      <p className="text-sm font-black text-slate-800">{record.technician}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                      <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Análise Técnica por</p>
                      <p className="text-sm font-black text-slate-800">{record.technicalAnalyst}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Notes & Files */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText size={14} /> Observações Técnicas
                </h3>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 min-h-[120px]">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                    {record.notes || "Nenhuma observação adicional registrada para esta calibração."}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Download size={14} /> Documentos Anexos
                </h3>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between cursor-pointer border-l-4 border-l-rose-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">Certificado_{record.certificateNumber}.pdf</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Documento PDF • 1.2 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Visualizar">
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Baixar">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Rastreabilidade Completa (CFR Part 11 Compliance)
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-sm"
            >
              Fechar Visualização
            </button>
            <button className="px-8 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all text-sm shadow-lg shadow-slate-900/10 flex items-center gap-2">
              <FileText size={18} /> Imprimir Certificado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalibrationDetailModal;
