
import React, { useState, useEffect } from 'react';
import { X, Save, Ruler, MapPin, Settings2, Calendar } from 'lucide-react';
import { 
  Instrument, 
  OperationalStatus, 
  Availability, 
  IndicationType, 
  CalibrationType, 
  InstrumentClassification 
} from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instrument: Partial<Instrument>) => void;
}

const InstrumentFormModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'localizacao' | 'metrologia'>('geral');
  
  const [formData, setFormData] = useState<Partial<Instrument>>({
    code: '',
    type: '',
    model: '',
    modelCode: '',
    manufacturer: '',
    indication: IndicationType.DIGITAL,
    patrimony: '',
    serialNumber: '',
    classification: InstrumentClassification.DIMENSIONAL,
    range: { start: 0, end: 100, unit: 'mm' },
    status: OperationalStatus.ACTIVE,
    availability: Availability.IN_USE,
    acquisitionDate: new Date().toISOString().split('T')[0],
    valueUsd: 0,
    workCenter: '',
    area: '',
    metrologyFilial: 'Jaraguá',
    location: {
      company: 'WEG Equipamentos Elétricos S/A',
      unit: 'WMO – I',
      directorate: 'BR–SC–JGS–WEL–11–D1 – DIR Engenharia',
      department: 'Sistema da Qualidade e Certificações',
      section: 'Metrologia',
      costCenter: '10168135',
      managers: ''
    },
    localOperator: '',
    isCalibrationStandard: false,
    calibrationType: CalibrationType.INTERNAL,
    periodicityMonths: 12,
    nextCalibrationDate: '',
    lastCalibrationDate: '',
    lastCalibrationCertificate: '',
    lastCalibrationResult: '',
  });

  // Regra: Disponibilidade vinculada ao Status Operacional
  useEffect(() => {
    const inactiveAvailabilities = [
      Availability.SCRAPPED, 
      Availability.OUT_OF_USE, 
      Availability.NOT_FOUND
    ];
    
    if (formData.availability && inactiveAvailabilities.includes(formData.availability)) {
      setFormData(prev => ({ ...prev, status: OperationalStatus.INACTIVE }));
    } else {
      setFormData(prev => ({ ...prev, status: OperationalStatus.ACTIVE }));
    }
  }, [formData.availability]);

  // Regra: Cálculo de próxima calibração (Último dia do mês)
  useEffect(() => {
    if (formData.periodicityMonths) {
      const date = new Date();
      date.setMonth(date.getMonth() + formData.periodicityMonths);
      // Ir para o primeiro dia do próximo mês e subtrair um dia para pegar o último dia do mês atualizado
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      setFormData(prev => ({ ...prev, nextCalibrationDate: lastDay.toISOString().split('T')[0] }));
    }
  }, [formData.periodicityMonths]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof Instrument] as any), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Novo Instrumento</h2>
            <p className="text-sm text-slate-500">Cadastre um novo ativo no inventário metrológico</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button 
            onClick={() => setActiveTab('geral')}
            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'geral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            <Ruler size={16} /> Dados Gerais
          </button>
          <button 
            onClick={() => setActiveTab('localizacao')}
            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'localizacao' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            <MapPin size={16} /> Localização/RH
          </button>
          <button 
            onClick={() => setActiveTab('metrologia')}
            className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'metrologia' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            <Settings2 size={16} /> Metrologia
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          {activeTab === 'geral' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Código do Equipamento *</span>
                  <input type="text" name="code" value={formData.code} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border" placeholder="Ex: EQP-5001" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Equipamento</span>
                  <input type="text" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" placeholder="Ex: Micrômetro" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modelo</span>
                    <input type="text" name="model" value={formData.model} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" placeholder="Ex: Externo de rosca" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Código Modelo</span>
                    <input type="text" name="modelCode" value={formData.modelCode} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" placeholder="XL1000" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fabricante</span>
                  <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" placeholder="Ex: Mitutoyo" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indicação</span>
                  <select name="indication" value={formData.indication} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2">
                    <option value={IndicationType.DIGITAL}>Digital</option>
                    <option value={IndicationType.ANALOG}>Analógico</option>
                    <option value={IndicationType.ATTRIBUTE}>Atributo</option>
                  </select>
                </label>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patrimônio</span>
                    <input type="text" name="patrimony" value={formData.patrimony} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nº de Série</span>
                    <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                  </label>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Range de Medição</span>
                   <div className="grid grid-cols-3 gap-2">
                      <input type="number" name="range.start" value={formData.range?.start} onChange={handleChange} className="rounded-lg border-slate-200 text-sm border px-2 py-1.5" placeholder="Início" />
                      <input type="number" name="range.end" value={formData.range?.end} onChange={handleChange} className="rounded-lg border-slate-200 text-sm border px-2 py-1.5" placeholder="Fim" />
                      <input type="text" name="range.unit" value={formData.range?.unit} onChange={handleChange} className="rounded-lg border-slate-200 text-sm border px-2 py-1.5" placeholder="Unid." />
                   </div>
                </div>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disponibilidade</span>
                  <select name="availability" value={formData.availability} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2 font-semibold">
                    {Object.values(Availability).map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </label>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Status Operacional</span>
                      <div className={`mt-1 text-sm font-bold px-3 py-2 rounded-lg border ${formData.status === OperationalStatus.ACTIVE ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                        {formData.status}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'localizacao' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</span>
                  <input type="text" name="location.company" value={formData.location?.company} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</span>
                  <input type="text" name="location.unit" value={formData.location?.unit} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diretoria</span>
                  <input type="text" name="location.directorate" value={formData.location?.directorate} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gestores</span>
                  <input type="text" name="location.managers" value={formData.location?.managers} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" placeholder="Separar por vírgula" />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Centro de Trabalho</span>
                  <input type="text" name="workCenter" value={formData.workCenter} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" placeholder="Ex: Laboratório Mecânico" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seção / Depto</span>
                  <input type="text" name="location.section" value={formData.location?.section} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Centro de Custo</span>
                  <input type="text" name="location.costCenter" value={formData.location?.costCenter} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-sm border px-3 py-2" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Local/Operador</span>
                  <input type="text" name="localOperator" value={formData.localOperator} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" placeholder="Ex: Máquina Fresadora CT200" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'metrologia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classificação do Instrumento</span>
                  <select name="classification" value={formData.classification} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2">
                    {Object.values(InstrumentClassification).map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Calibração</span>
                    <select name="calibrationType" value={formData.calibrationType} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2">
                      <option value={CalibrationType.INTERNAL}>Interna</option>
                      <option value={CalibrationType.EXTERNAL}>Externa</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Padrão de Calibração?</span>
                    <select 
                      name="isCalibrationStandard" 
                      value={formData.isCalibrationStandard ? 'true' : 'false'} 
                      onChange={(e) => setFormData(prev => ({...prev, isCalibrationStandard: e.target.value === 'true'}))}
                      className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Periodicidade (Meses)</span>
                    <input type="number" name="periodicityMonths" value={formData.periodicityMonths} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Próxima Calibração</span>
                    <input type="date" name="nextCalibrationDate" value={formData.nextCalibrationDate} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2 font-bold text-blue-600" />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <Calendar size={14} /> Dados da Última Calibração
                    </h4>
                    <div className="space-y-3">
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Certificado Nº</p>
                          <input type="text" name="lastCalibrationCertificate" value={formData.lastCalibrationCertificate} onChange={handleChange} className="w-full bg-slate-800 border-none rounded text-xs py-1" placeholder="Vazio" />
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Data</p>
                            <input type="date" name="lastCalibrationDate" value={formData.lastCalibrationDate} onChange={handleChange} className="w-full bg-slate-800 border-none rounded text-xs py-1" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Resultado</p>
                            <select name="lastCalibrationResult" value={formData.lastCalibrationResult} onChange={handleChange} className="w-full bg-slate-800 border-none rounded text-xs py-1">
                               <option value="">Nenhum</option>
                               <option value="Aprovado">Aprovado</option>
                               <option value="Reprovado">Reprovado</option>
                               <option value="Liberado">Liberado</option>
                            </select>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Save size={18} /> Salvar Instrumento
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstrumentFormModal;
