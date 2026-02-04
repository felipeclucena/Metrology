
import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, FileText, Upload, Calendar, Search, Building2, UserCheck } from 'lucide-react';
import { 
  CalibrationRecord, 
  CalibrationType, 
  CalibrationResult,
  Instrument,
  CalibrationLaboratory,
  WorkOrder
} from '../types';
import { demoInstruments, demoLaboratories, demoOS } from '../services/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<CalibrationRecord>) => void;
  initialData?: Partial<CalibrationRecord>;
}

const CalibrationFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<CalibrationRecord>>({
    instrumentId: '',
    instrumentCode: '',
    type: CalibrationType.INTERNAL,
    date: new Date().toISOString().split('T')[0],
    laboratoryId: '',
    laboratoryName: '',
    certificateNumber: '',
    result: CalibrationResult.APPROVED,
    technician: '',
    technicalAnalyst: '',
    osNumber: '',
    nextDate: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData, isOpen]);

  // Regra: Cálculo de próxima calibração baseado no instrumento selecionado
  useEffect(() => {
    if (formData.instrumentId && formData.date) {
      const instrument = demoInstruments.find(i => i.id === formData.instrumentId);
      if (instrument) {
        const calDate = new Date(formData.date);
        calDate.setMonth(calDate.getMonth() + instrument.periodicityMonths);
        // Último dia do mês
        const nextDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0);
        setFormData(prev => ({ ...prev, nextDate: nextDate.toISOString().split('T')[0] }));
      }
    }
  }, [formData.instrumentId, formData.date]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const instrument = demoInstruments.find(i => i.id === e.target.value);
    if (instrument) {
      setFormData(prev => ({ 
        ...prev, 
        instrumentId: instrument.id, 
        instrumentCode: instrument.code,
        type: instrument.calibrationType 
      }));
    }
  };

  const handleLabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lab = demoLaboratories.find(l => l.id === e.target.value);
    if (lab) {
      setFormData(prev => ({ ...prev, laboratoryId: lab.id, laboratoryName: lab.supplierName }));
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" />
              Registro de Calibração
            </h2>
            <p className="text-sm text-slate-500">Cadastre um novo certificado e atualize o ciclo de vida do instrumento</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instrumento *</span>
              <select 
                name="instrumentId" 
                value={formData.instrumentId} 
                onChange={handleInstrumentChange}
                className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2 font-bold"
              >
                <option value="">Selecione o instrumento...</option>
                {demoInstruments.map(i => <option key={i.id} value={i.id}>{i.code} - {i.type}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Calibração *</span>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2">
                <option value={CalibrationType.INTERNAL}>Interna</option>
                <option value={CalibrationType.EXTERNAL}>Externa</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laboratório *</span>
              <select name="laboratoryId" value={formData.laboratoryId} onChange={handleLabChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2">
                <option value="">Selecione o laboratório...</option>
                {demoLaboratories.map(l => <option key={l.id} value={l.id}>{l.supplierName}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Realização *</span>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificado Nº *</span>
                <input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2 font-mono" placeholder="Ex: CERT-2024-X" />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status / Resultado *</span>
              <select name="result" value={formData.result} onChange={handleChange} className={`mt-1 block w-full rounded-lg border text-sm font-black px-3 py-2 ${
                formData.result === CalibrationResult.APPROVED ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                formData.result === CalibrationResult.REJECTED ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                <option value={CalibrationResult.APPROVED}>Aprovado</option>
                <option value={CalibrationResult.REJECTED}>Reprovado</option>
                <option value={CalibrationResult.RELEASED}>Liberado</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">O.S. Associada</span>
              <select name="osNumber" value={formData.osNumber} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2">
                <option value="">Nenhuma</option>
                {demoOS.map(os => <option key={os.id} value={os.id}>{os.id} - {os.type}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responsável Calibração *</span>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" name="technician" value={formData.technician} onChange={handleChange} className="mt-1 block w-full pl-10 rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" placeholder="Nome do técnico" />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Análise Técnica por *</span>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" name="technicalAnalyst" value={formData.technicalAnalyst} onChange={handleChange} className="mt-1 block w-full pl-10 rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" placeholder="Nome do analista" />
              </div>
            </label>

            <label className="block col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Observações</span>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" placeholder="Detalhes técnicos ou desvios encontrados..."></textarea>
            </label>

            <div className="col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Upload do Certificado</span>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors mb-2" size={32} />
                <span className="text-sm font-bold text-slate-600">Arraste ou clique para anexar PDF</span>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Máximo 15MB • PDF, JPG, PNG</p>
              </div>
            </div>

            <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Previsão Próxima Calibração</p>
                <p className="text-lg font-black text-blue-700">{formData.nextDate || '---'}</p>
              </div>
              <Calendar className="text-blue-200" size={32} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Save size={18} /> Salvar Certificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationFormModal;
