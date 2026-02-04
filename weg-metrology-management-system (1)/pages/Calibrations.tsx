
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/mockData';
import { CalibrationRecord, CalibrationResult, Instrument } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  MoreVertical, 
  ChevronRight,
  ExternalLink,
  Printer,
  FileDown
} from 'lucide-react';
import CalibrationFormModal from '../components/CalibrationFormModal';
import CalibrationDetailModal from '../components/CalibrationDetailModal';
import InstrumentDetailModal from '../components/InstrumentDetailModal';

const Calibrations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInstrumentDetailOpen, setIsInstrumentDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CalibrationRecord | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([]);

  useEffect(() => {
    setCalibrations(DataService.getCalibrations());
  }, []);

  const filtered = calibrations.filter(cal => 
    cal.instrumentCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cal.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cal.laboratoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (record: Partial<CalibrationRecord>) => {
    const newRecord = {
      ...record,
      id: `cal-${Date.now()}`
    } as CalibrationRecord;
    
    const updatedList = DataService.saveCalibration(newRecord);
    setCalibrations(updatedList);
    setIsModalOpen(false);
  };

  const handleViewDetails = (record: CalibrationRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleViewInstrument = (instrumentId: string) => {
    const instrument = DataService.getInstruments().find(i => i.id === instrumentId);
    if (instrument) {
      setSelectedInstrument(instrument);
      setIsDetailOpen(false);
      setIsInstrumentDetailOpen(true);
    }
  };

  const getResultBadge = (result: CalibrationResult) => {
    switch(result) {
      case CalibrationResult.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case CalibrationResult.REJECTED: return 'bg-rose-100 text-rose-700 border-rose-200';
      case CalibrationResult.RELEASED: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Registro de Calibrações</h1>
          <p className="text-slate-500 text-sm">Controle de certificados e análise técnica de precisão</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-bold text-sm"
          >
            <Plus size={18} className="mr-2" />
            Nova Calibração
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instrumento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificado</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Laboratório</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cal) => (
                <tr key={cal.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleViewDetails(cal)}>
                  <td className="px-6 py-4 text-sm font-black text-slate-800">{cal.instrumentCode}</td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{cal.certificateNumber}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{cal.laboratoryName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getResultBadge(cal.result)}`}>
                      {cal.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><ExternalLink size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CalibrationFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      <CalibrationDetailModal isOpen={isDetailOpen} record={selectedRecord} onClose={() => setIsDetailOpen(false)} onViewInstrument={handleViewInstrument} />
      <InstrumentDetailModal isOpen={isInstrumentDetailOpen} instrument={selectedInstrument} onClose={() => setIsInstrumentDetailOpen(false)} />
    </div>
  );
};

export default Calibrations;
