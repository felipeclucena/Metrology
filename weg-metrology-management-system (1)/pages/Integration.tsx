import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  ArrowRightLeft, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Search,
  History,
  Settings2,
  Play,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  FileDown,
  Terminal,
  Activity,
  Globe,
  Wifi
} from 'lucide-react';

const AUTOLAB_FIELDS = [
  'ID_EQUIP', 'DS_EQUIP', 'FABRICANTE', 'NR_SERIE', 'PATRIMONIO', 
  'DT_AQUISICAO', 'VAL_AQUIS', 'ULT_CALIB', 'PERIODICIDADE', 'SITUACAO',
  'LAB_ORIGEM', 'TEC_RESP', 'OBS_GERAL', 'MODELO_EQUIP', 'MARCA'
];

const WEG_FIELDS = [
  'code', 'type', 'manufacturer', 'serialNumber', 'patrimony', 
  'acquisitionDate', 'valueUsd', 'lastCalibrationDate', 'periodicityMonths', 'status',
  'metrologyFilial', 'localOperator', 'notes', 'model', 'modelCode'
];

const DEFAULT_MAPPINGS = [
  { autolab: 'ID_EQUIP', weg: 'code' },
  { autolab: 'DS_EQUIP', weg: 'type' },
  { autolab: 'FABRICANTE', weg: 'manufacturer' },
  { autolab: 'NR_SERIE', weg: 'serialNumber' },
  { autolab: 'PATRIMONIO', weg: 'patrimony' },
  { autolab: 'ULT_CALIB', weg: 'lastCalibrationDate' },
];

interface Mapping {
  id: string;
  autolab: string;
  weg: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}

const Integration: React.FC = () => {
  const [mappings, setMappings] = useState<Mapping[]>(
    DEFAULT_MAPPINGS.map((m, i) => ({ ...m, id: `map-${i}` }))
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [connStatus, setConnStatus] = useState<'online' | 'testing' | 'offline'>('online');
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, level: LogEntry['level'] = 'INFO') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, newLog]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const testConnection = () => {
    setConnStatus('testing');
    addLog('Iniciando teste de handshake com API Autolab...', 'INFO');
    setTimeout(() => {
      setConnStatus('online');
      addLog('Conexão estabelecida com sucesso. Latência: 45ms', 'SUCCESS');
    }, 1500);
  };

  const startSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setLogs([]);
    addLog('Iniciando ciclo de sincronização forçada...', 'INFO');
    addLog('Obtendo tokens de autenticação...', 'INFO');
    
    const steps = [
      { p: 10, msg: 'Autenticação bem-sucedida.', lvl: 'SUCCESS' as const },
      { p: 25, msg: 'Lendo esquema de campos externos do Autolab...', lvl: 'INFO' as const },
      { p: 40, msg: 'Mapeamento de 520 registros encontrado.', lvl: 'INFO' as const },
      { p: 60, msg: 'Transformando dados para formato WEG Metrology...', lvl: 'INFO' as const },
      { p: 85, msg: 'Persistindo 12 novos instrumentos e atualizando 45 registros.', lvl: 'WARNING' as const },
      { p: 100, msg: 'Sincronização finalizada com sucesso.', lvl: 'SUCCESS' as const }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSyncing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }, 500);
          return 100;
        }
        
        if (prev >= steps[currentStep].p) {
          addLog(steps[currentStep].msg, steps[currentStep].lvl);
          currentStep++;
        }
        
        return prev + 2;
      });
    }, 150);
  };

  const addMappingRow = () => {
    const newMapping: Mapping = {
      id: `map-${Date.now()}`,
      autolab: AUTOLAB_FIELDS[0],
      weg: WEG_FIELDS[0]
    };
    setMappings([...mappings, newMapping]);
    addLog(`Novo mapeamento adicionado: ${newMapping.id}`, 'INFO');
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const updateMapping = (id: string, field: 'autolab' | 'weg', value: string) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const saveMappingConfig = () => {
    setIsSaving(true);
    addLog('Salvando novas regras de mapeamento no banco de dados...', 'INFO');
    setTimeout(() => {
      setIsSaving(false);
      addLog('Configuração de mapeamento persistida.', 'SUCCESS');
    }, 800);
  };

  const resetMappings = () => {
    if (confirm('Deseja restaurar o mapeamento padrão?')) {
      setMappings(DEFAULT_MAPPINGS.map((m, i) => ({ ...m, id: `map-reset-${i}` })));
      addLog('Mapeamento restaurado para os padrões de fábrica.', 'WARNING');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Integração Autolab</h1>
          <p className="text-slate-500 text-sm">Gerencie o fluxo de dados entre Autolab e WEG Metrology</p>
        </div>
        <div className="flex items-center space-x-3">
          {showSuccess && (
            <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-in slide-in-from-top-2">
              <CheckCircle size={18} className="mr-2" />
              <span className="text-sm font-bold">Base de dados atualizada!</span>
            </div>
          )}
          <button 
            onClick={startSync}
            disabled={isSyncing}
            className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isSyncing 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isSyncing ? (
              <RefreshCw size={18} className="mr-2 animate-spin" />
            ) : (
              <Play size={18} className="mr-2 fill-current" />
            )}
            {isSyncing ? `Sincronizando ${syncProgress}%` : 'Sincronizar Agora'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Mapping & Status */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Bar (Visible only when syncing) */}
          {isSyncing && (
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Sincronização em curso</span>
                <span className="text-sm font-black text-blue-600">{syncProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Mapping Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <ArrowRightLeft size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Mapeamento de Atributos</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Autolab API <span className="mx-2">→</span> WEG Metrology</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={resetMappings}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                  title="Restaurar Padrão"
                >
                  <RotateCcw size={18} />
                </button>
                <button 
                  onClick={addMappingRow}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
                >
                  <Plus size={16} /> Adicionar Campo
                </button>
              </div>
            </div>

            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campo Autolab</th>
                    <th className="px-6 py-3 text-center w-10 text-slate-300"></th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino WEG</th>
                    <th className="px-6 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mappings.map((mapping) => (
                    <tr key={mapping.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <select 
                          value={mapping.autolab}
                          onChange={(e) => updateMapping(mapping.id, 'autolab', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                          {AUTOLAB_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <ArrowRightLeft size={16} className="text-slate-300 mx-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={mapping.weg}
                          onChange={(e) => updateMapping(mapping.id, 'weg', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-black text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                          {WEG_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => removeMapping(mapping.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={saveMappingConfig}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50"
              >
                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                Salvar Configuração
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Connection & Logs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Connection Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Globe size={18} className="mr-2 text-blue-500" />
              API Autolab Endpoint
            </h3>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                connStatus === 'online' ? 'bg-emerald-50 border-emerald-200' : 
                connStatus === 'testing' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    connStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 
                    connStatus === 'testing' ? 'bg-amber-500 animate-bounce' : 'bg-rose-500'
                  }`}></div>
                  <span className={`text-sm font-black uppercase ${
                    connStatus === 'online' ? 'text-emerald-700' : 
                    connStatus === 'testing' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {connStatus === 'online' ? 'Serviço Online' : connStatus === 'testing' ? 'Verificando...' : 'Serviço Offline'}
                  </span>
                </div>
                <Wifi size={18} className={connStatus === 'online' ? 'text-emerald-400' : 'text-slate-300'} />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Última Sincronização</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Há 4 horas</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">12:45 PM</span>
                </div>
              </div>

              <button 
                onClick={testConnection}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
              >
                <Settings2 size={16} /> Testar Conexão
              </button>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2 text-blue-400">
                <Terminal size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Console de Integração</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] font-black text-slate-500 hover:text-white uppercase"
              >
                Limpar
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px]">
              {logs.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-700 italic">
                  Aguardando atividade do sistema...
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 leading-relaxed border-l border-slate-800 pl-2">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`font-black shrink-0 ${
                    log.level === 'SUCCESS' ? 'text-emerald-500' : 
                    log.level === 'ERROR' ? 'text-rose-500' : 
                    log.level === 'WARNING' ? 'text-amber-500' : 'text-blue-400'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Sistema em Tempo Real</span>
              </div>
              <button className="flex items-center gap-1 text-[9px] font-bold text-blue-400 hover:underline">
                <FileDown size={14} /> Baixar Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;