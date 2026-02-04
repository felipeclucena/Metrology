
import React, { useState } from 'react';
import { demoSuppliers } from '../services/mockData';
import { 
  Truck, 
  Search, 
  Plus, 
  Download, 
  Star, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  ExternalLink,
  MoreVertical,
  Filter
} from 'lucide-react';

const Suppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = demoSuppliers.filter(sup => 
    sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sup.document.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
          <p className="text-slate-500">Gestão de laboratórios e parceiros credenciados</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
            <Download size={18} className="mr-2 text-slate-400" />
            Exportar CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm font-medium">
            <Plus size={18} className="mr-2" />
            Novo Fornecedor
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total de Parceiros</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">{demoSuppliers.length}</h3>
            <Truck className="text-blue-500 opacity-20" size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status Vigente</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-emerald-600">07</h3>
            <ShieldCheck className="text-emerald-500 opacity-20" size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Vencimento (30d)</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-amber-600">01</h3>
            <Calendar className="text-amber-500 opacity-20" size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Bloqueados</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-300">00</h3>
            <AlertCircle className="text-slate-300 opacity-20" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CNPJ..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors">
          <Filter size={16} className="mr-2" />
          Filtros Avançados
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((sup) => (
          <div key={sup.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-blue-300 transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
                    {sup.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{sup.name}</h3>
                    <p className="text-xs text-slate-400">{sup.document}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    sup.status === 'Vigente' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {sup.status.toUpperCase()}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < sup.rating ? "currentColor" : "none"} className={i < sup.rating ? "" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {sup.standards.map(std => (
                    <span key={std} className="flex items-center px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] font-bold border border-slate-100">
                      <ShieldCheck size={10} className="mr-1 text-blue-500" />
                      {std}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Validade Cadastro</p>
                    <p className={`text-xs font-semibold ${sup.status === 'Expirado' ? 'text-rose-600' : 'text-slate-700'}`}>
                      {sup.validUntil}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Última Auditoria</p>
                    <p className="text-xs font-semibold text-slate-700">{sup.lastAuditDate}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 italic bg-slate-50 p-2 rounded border-l-2 border-slate-200">
                  "{sup.observation}"
                </p>

                <div className="flex items-center justify-between pt-4">
                  <button className="flex items-center text-blue-600 text-xs font-bold hover:underline">
                    <ExternalLink size={14} className="mr-1" />
                    Visualizar Acreditação
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suppliers;
