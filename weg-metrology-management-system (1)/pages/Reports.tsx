
import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ShieldCheck, 
  BarChart2, 
  ChevronRight,
  TrendingDown,
  Clock,
  Briefcase,
  // Fix: Added Plus to the imported icons from lucide-react
  Plus
} from 'lucide-react';

const ReportCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  color: string;
}> = ({ title, description, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex items-center space-x-1">
        <button title="Exportar PDF" className="p-1.5 text-slate-400 hover:text-rose-500"><FileText size={16} /></button>
        <button title="Exportar Excel" className="p-1.5 text-slate-400 hover:text-emerald-500"><Download size={16} /></button>
      </div>
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
    <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
      Gerar Agora <ChevronRight size={14} className="ml-1" />
    </div>
  </div>
);

const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Relatórios & Auditoria</h1>
        <p className="text-slate-500">Documentação técnica e análise de indicadores metrológicos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Inventário Geral"
          description="Lista completa de todos os instrumentos ativos e inativos com detalhes de patrimônio e valor."
          icon={<ShieldCheck className="text-blue-600" />}
          color="bg-blue-50"
        />
        <ReportCard 
          title="Calibrações Mensais"
          description="Cronograma detalhado de instrumentos a vencer no próximo mês por centro de trabalho."
          icon={<Calendar className="text-emerald-600" />}
          color="bg-emerald-50"
        />
        <ReportCard 
          title="Não Conformidades"
          description="Histórico de instrumentos reprovados e análise de causa raiz por família de equipamentos."
          icon={<TrendingDown className="text-rose-600" />}
          color="bg-rose-50"
        />
        <ReportCard 
          title="OS por Técnico"
          description="Produtividade laboratorial e tempo médio de atendimento (Lead Time) por especialista."
          icon={<Briefcase className="text-amber-600" />}
          color="bg-amber-50"
        />
        <ReportCard 
          title="Evolução Patrimonial"
          description="Análise financeira do parque de instrumentos e depreciação acumulada por filial."
          icon={<BarChart2 className="text-purple-600" />}
          color="bg-purple-50"
        />
        <ReportCard 
          title="Log de Auditoria"
          description="Rastreabilidade completa de edições de cadastro e movimentações críticas no sistema."
          icon={<Clock className="text-slate-600" />}
          color="bg-slate-100"
        />
      </div>

      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
            <Plus className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Criar Relatório Customizado</h3>
          <p className="text-slate-500 text-sm mb-6">Selecione filtros múltiplos, colunas personalizadas e agende o envio automático por e-mail para os proprietários.</p>
          <button className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium">
            Configurar Construtor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
