
import { 
  Instrument, 
  OperationalStatus, 
  Availability, 
  IndicationType, 
  InstrumentClassification, 
  CalibrationType,
  WorkOrder,
  OSPriority,
  OSStatus,
  NonConformity,
  Supplier,
  CalibrationLaboratory,
  CalibrationResult,
  CalibrationRecord
} from '../types';

// Chaves para o LocalStorage
const STORAGE_KEYS = {
  INSTRUMENTS: 'weg_metrology_instruments',
  CALIBRATIONS: 'weg_metrology_calibrations',
  OS: 'weg_metrology_os',
  NC: 'weg_metrology_nc'
};

// Dados Iniciais (Seed)
const initialInstruments: Instrument[] = [
  {
    id: '1',
    code: 'EQP-1052',
    type: 'Micrômetro Externo',
    model: 'Digital',
    modelCode: '293-240-30',
    manufacturer: 'Mitutoyo',
    indication: IndicationType.DIGITAL,
    patrimony: '123456',
    serialNumber: 'SN889900',
    classification: InstrumentClassification.DIMENSIONAL,
    range: { start: 0, end: 25, unit: 'mm' },
    status: OperationalStatus.ACTIVE,
    availability: Availability.IN_USE,
    acquisitionDate: '2023-01-15',
    valueUsd: 450,
    workCenter: 'Usinagem A',
    area: 'Produção',
    metrologyFilial: 'Jaraguá do Sul',
    location: {
      company: 'WEG',
      unit: 'WMO',
      directorate: 'DIR Engenharia',
      department: 'Mecânica',
      section: 'Torneamento',
      costCenter: 'CC-101',
      managers: 'João Silva'
    },
    localOperator: 'Ricardo Oliveira',
    isCalibrationStandard: false,
    calibrationType: CalibrationType.EXTERNAL,
    periodicityMonths: 12,
    lastCalibrationDate: '2024-01-10',
    lastCalibrationCertificate: 'CERT-2024-001',
    lastCalibrationResult: CalibrationResult.APPROVED,
    nextCalibrationDate: '2025-01-10',
    nonConforming: false,
    movements: [
      { id: 'm1', date: '2024-01-10', type: 'Entrada', origin: 'LabMetros', destination: 'Almoxarifado', availabilityResult: Availability.IN_USE, responsible: 'Ana Paula', notes: 'Retorno de calibração' }
    ],
    calibrationHistory: []
  },
  {
    id: '2',
    code: 'EQP-2001',
    type: 'Multímetro Digital',
    model: 'True RMS',
    modelCode: 'Fluke 179',
    manufacturer: 'Fluke',
    indication: IndicationType.DIGITAL,
    patrimony: '654321',
    serialNumber: 'SN112233',
    classification: InstrumentClassification.ELECTRICITY,
    range: { start: 0, end: 1000, unit: 'V' },
    status: OperationalStatus.ACTIVE,
    availability: Availability.IN_USE,
    acquisitionDate: '2022-05-20',
    valueUsd: 600,
    workCenter: 'Manutenção Elétrica',
    area: 'Manutenção',
    metrologyFilial: 'Jaraguá do Sul',
    location: {
      company: 'WEG',
      unit: 'WMO',
      directorate: 'DIR Manutenção',
      department: 'Elétrica',
      section: 'Oficina',
      costCenter: 'CC-202',
      managers: 'Maria Santos'
    },
    localOperator: 'José Alencar',
    isCalibrationStandard: true,
    calibrationType: CalibrationType.INTERNAL,
    periodicityMonths: 6,
    lastCalibrationDate: '2024-03-05',
    lastCalibrationCertificate: 'CERT-INT-005',
    lastCalibrationResult: CalibrationResult.APPROVED,
    nextCalibrationDate: '2024-09-05',
    nonConforming: true,
    movements: [],
    calibrationHistory: []
  }
];

// Serviço de Dados
export const DataService = {
  getInstruments: (): Instrument[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INSTRUMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INSTRUMENTS, JSON.stringify(initialInstruments));
      return initialInstruments;
    }
    return JSON.parse(data);
  },

  saveInstrument: (instrument: Instrument) => {
    const instruments = DataService.getInstruments();
    const index = instruments.findIndex(i => i.id === instrument.id);
    if (index >= 0) {
      instruments[index] = instrument;
    } else {
      instruments.unshift(instrument);
    }
    localStorage.setItem(STORAGE_KEYS.INSTRUMENTS, JSON.stringify(instruments));
    return instruments;
  },

  getCalibrations: (): CalibrationRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CALIBRATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveCalibration: (record: CalibrationRecord) => {
    const calibrations = DataService.getCalibrations();
    calibrations.unshift(record);
    localStorage.setItem(STORAGE_KEYS.CALIBRATIONS, JSON.stringify(calibrations));
    
    // Atualiza o instrumento vinculado
    const instruments = DataService.getInstruments();
    const instIndex = instruments.findIndex(i => i.id === record.instrumentId);
    if (instIndex >= 0) {
      instruments[instIndex].lastCalibrationDate = record.date;
      instruments[instIndex].lastCalibrationCertificate = record.certificateNumber;
      instruments[instIndex].lastCalibrationResult = record.result;
      instruments[instIndex].nextCalibrationDate = record.nextDate;
      localStorage.setItem(STORAGE_KEYS.INSTRUMENTS, JSON.stringify(instruments));
    }
    return calibrations;
  },

  getOS: (): WorkOrder[] => {
    const data = localStorage.getItem(STORAGE_KEYS.OS);
    return data ? JSON.parse(data) : [];
  }
};

// Exportações legadas para compatibilidade (serão substituídas gradualmente)
export const demoSuppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'LabMetros Jaraguá',
    document: '12.345.678/0001-90',
    status: 'Vigente',
    rating: 5,
    standards: ['ISO/IEC 17025', 'ISO 9001'],
    validUntil: '2025-12-31',
    lastAuditDate: '2023-11-15',
    observation: 'Fornecedor estratégico com alta competência técnica.'
  }
];

export const demoLaboratories: CalibrationLaboratory[] = [
  {
    id: 'LAB-001',
    supplierId: 'sup1',
    supplierName: 'LabMetros Jaraguá',
    validUntil: '2025-12-31',
    rating: 'Laboratório com excelente tempo de resposta e corpo técnico qualificado.',
    standardProcedure: 'ISO/IEC 17025',
    observation: 'Acreditado pela CGCRE/Inmetro.',
    attachments: ['acreditacao_2024.pdf'],
    status: 'Ativo'
  }
];

export const demoInstruments = DataService.getInstruments();
export const demoCalibrations = DataService.getCalibrations();
export const demoOS = DataService.getOS();
export const demoNC: NonConformity[] = [];
