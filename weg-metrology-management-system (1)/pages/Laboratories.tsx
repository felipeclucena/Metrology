
import React, { useState, useEffect } from 'react';
import { demoLaboratories, demoSuppliers } from '../services/mockData';
import { CalibrationLaboratory, Supplier } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Building2, 
  Star, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  Save,
  Upload
} from 'lucide-react';

/**
 * LaboratoryFormModal Component moved here to resolve missing file dependency.
 */
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lab: Partial<CalibrationLaboratory>) => void;
  initialData?: CalibrationLaboratory | null;
}

const LaboratoryFormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<CalibrationLaboratory>>({
    supplierId: '',
    supplierName: '',
    validUntil: '',
    rating: '',
    standardProcedure: '',
    observation: '',
    status: 'Ativo',
    attachments: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        supplierId: '',
        supplierName: '',
        validUntil: '',
        rating: '',
        standardProcedure: '',
        observation: '',
        status: 'Ativo',
        attachments: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplier = demoSuppliers.find(s => s.id === e.target.value);
    if (supplier) {
      setFormData(prev => ({ ...prev, supplierId: supplier.id, supplierName: supplier.name }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 size={24} className="text-blue-600" />
              {initialData ? 'Editar Laboratório' : 'Novo Laboratório de Calibração'}
            </h2>
            <p className="text-sm text-slate-500">Credenciamento de laboratórios externos ou internos</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block col-span-2 md:col-span-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fornecedor Base *</span>
              <select 
                name="supplierId" 
                value={formData.supplierId} 
                onChange={handleSupplierChange}
                className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um fornecedor...</option>
                {demoSuppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.document})</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Validade *</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  name="validUntil" 
                  value={formData.validUntil} 
                  onChange={handleChange} 
                  className="mt-1 block w-full pl-10 rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" 
                />
              </div>
            </label>

            <label className="block col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Norma / Procedimento de Referência</span>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  name="standardProcedure" 
                  value={formData.standardProcedure} 
                  onChange={handleChange} 
                  placeholder="Ex: ISO/IEC 17025:2017"
                  className="mt-1 block w-full pl-10 rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" 
                />
              </div>
            </label>

            <label className="block col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nota de Avaliação Técnica</span>
              <div className="relative">
                <Star className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea 
                  name="rating" 
                  value={formData.rating} 
                  onChange={handleChange} 
                  rows={2}
                  placeholder="Resumo da avaliação técnica do laboratório..."
                  className="mt-1 block w-full pl-10 rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" 
                />
              </div>
            </label>

            <label className="block col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Observações</span>
              <textarea 
                name="observation" 
                value={formData.observation} 
                onChange={handleChange} 
                rows={3}
                className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2" 
              />
            </label>

            <div className="col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Anexos (Acreditações/Escopos)</span>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors mb-2" size={24} />
                <span className="text-sm font-medium text-slate-600">Clique para fazer upload de PDF ou imagens</span>
                <p className="text-xs text-slate-400 mt-1">Tamanho máximo: 10MB</p>
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status do Laboratório</span>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-slate-200 bg-white text-sm border px-3 py-2 font-bold"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </label>
          </div>
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
            <Save size={18} /> {initialData ? 'Atualizar' : 'Salvar Laboratório'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Laboratories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [labs, setLabs] = useState<CalibrationLaboratory[]>(demoLaboratories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<CalibrationLaboratory | null>(null);

  const filtered = labs.filter(lab => 
    lab.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lab.standardProcedure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (labData: Partial<CalibrationLaboratory>) => {
    if (editingLab) {
      setLabs(prev => prev.map(l => l.id === editingLab.id ? { ...l, ...labData } as CalibrationLaboratory : l));
    } else {
      const newLab: CalibrationLaboratory = {
        ...labData,
        id: `LAB-${Date.now()}`,
        attachments: [],
        status: 'Ativo'
      } as CalibrationLaboratory;
      setLabs(prev => [newLab, ...prev]);
    }
    setIsModalOpen(false);
    setEditingLab(null);
  };

  const handleEdit = (lab: CalibrationLaboratory) => {
    setEditingLab(lab);
    setIsModalOpen(true);
  };

  const toggleStatus = (lab: CalibrationLaboratory) => {
    setLabs(prev => prev.map(l => 
      l.id === lab.id ? { ...l, status: l.status === 'Ativo' ? 'Inativo' : 'Ativo' } : l
    ));
  };

  const isExpired = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laboratórios de Calibração</h1>
          <p className="text-slate-500">Gestão de competência técnica e validade de acreditação</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm font-bold">
            <Download size={18} className="mr-2 text-slate-400" />
            Exportar Lista
          </button>
          <button 
            onClick={() => { setEditingLab(null); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md text-sm font-bold"
          >
            <Plus size={18} className="mr-2" />
            Novo Laboratório
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{labs.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativos</p>
            <h3 className="text-xl font-black text-emerald-600 tracking-tight">
              {labs.filter(l => l.status === 'Ativo').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expirados / Atenção</p>
            <h3 className="text-xl font-black text-rose-600 tracking-tight">
              {labs.filter(l => isExpired(l.validUntil)).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou norma..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
          <Filter size={16} className="mr-2" />
          Filtros Avançados
        </button>
      </div>

      {/* Grid de Laboratórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((lab) => (
          <div key={lab.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-blue-300 transition-all group flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xl mr-4 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
                    {lab.supplierName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{lab.supplierName}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {lab.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-widest ${
                    lab.status === 'Ativo' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {lab.status}
                  </span>
                  <div className="flex items-center text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black text-slate-700 ml-1">4.8</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-black border border-blue-100 uppercase tracking-tighter">
                    <ShieldCheck size={10} className="mr-1" />
                    {lab.standardProcedure}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Válido até</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className={isExpired(lab.validUntil) ? 'text-rose-500' : 'text-slate-400'} />
                      <p className={`text-xs font-black ${isExpired(lab.validUntil) ? 'text-rose-600 underline decoration-rose-300' : 'text-slate-700'}`}>
                        {lab.validUntil}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Escopo</p>
                    <p className="text-xs font-black text-slate-700 truncate">Dimensional, Pressão</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Avaliação Técnica</p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {lab.rating}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-1">
                {lab.attachments.length > 0 ? (
                  <button className="flex items-center text-blue-600 text-[10px] font-black uppercase hover:underline">
                    <Download size={12} className="mr-1" /> Certificado (1)
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sem Anexos</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(lab)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  Editar
                </button>
                <button 
                  onClick={() => toggleStatus(lab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    lab.status === 'Ativo' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white' 
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  {lab.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Building2 className="mx-auto text-slate-300 mb-4 opacity-30" size={64} />
            <h3 className="text-lg font-black text-slate-800">Nenhum laboratório cadastrado</h3>
            <p className="text-slate-500 text-sm font-medium">Clique no botão "Novo Laboratório" para começar.</p>
          </div>
        )}
      </div>

      <LaboratoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingLab}
      />
    </div>
  );
};

export default Laboratories;
