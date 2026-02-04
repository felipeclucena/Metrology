
import React, { useState } from 'react';
import { demoNC } from '../services/mockData';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  FileSearch,
  User
} from 'lucide-react';

const NonConformities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredNC = demoNC.filter(nc => {
    const matchesSearch = nc.instrumentCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          nc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || nc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Não Conformidades</h1>
          <p className="text-slate-500">Gestão de desvios, causas raízes e ações corretivas</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={18} className="mr-2" />
            Exportar Lista
          </button>
          <button className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm">
            <Plus size={18} className="mr-2" />
            Registrar NC
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">NCs Pendentes</p>
            <h3 className="text-2xl font-bold text-slate-800">03</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg mr-4">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Concluídas (Mês)</p>
            <h3 className="text-2xl font-bold text-slate-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Aguardando Análise</p>
            <h3 className="text-2xl font-bold text-slate-800">02</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por código de instrumento ou descrição..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
            <Filter size={14} className="mr-2" />
            <select 
              className="bg-transparent focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="Pendente">Pendentes</option>
              <option value="Concluída">Concluídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* NC List */}
      <div className="space-y-4">
        {filteredNC.map((nc) => (
          <div key={nc.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition-all group">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold border border-slate-200">
                      ID: {nc.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center">
                      Instrumento: <span className="text-blue-600 ml-1">{nc.instrumentCode}</span>
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                      nc.status === 'Concluída' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {nc.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{nc.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Causa Raiz</p>
                      <p className="text-xs text-slate-600">{nc.rootCause}</p>
                    </div>
                    <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100/50">
                      <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Ação Corretiva</p>
                      <p className="text-xs text-slate-600">{nc.correctiveAction}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col justify-between border-l border-slate-100 pl-6 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-500">
                      <User size={14} className="mr-2" />
                      Responsável: <span className="font-semibold text-slate-700 ml-1">{nc.responsible}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock size={14} className="mr-2" />
                      Prazo: <span className="font-semibold text-slate-700 ml-1">{nc.deadline}</span>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 rounded-lg text-xs font-bold transition-all border border-slate-200">
                    <FileSearch size={14} className="mr-2" />
                    Análise Detalhada
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNC.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <AlertTriangle className="mx-auto text-slate-300 mb-3" size={48} />
            <h3 className="text-lg font-bold text-slate-800">Nenhuma NC encontrada</h3>
            <p className="text-slate-500 text-sm">Tente ajustar seus filtros ou busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NonConformities;
