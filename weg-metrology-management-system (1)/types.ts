
export enum OperationalStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo'
}

export enum Availability {
  IN_USE = 'Em Uso',
  EXTERNAL_CALIBRATION = 'Calibração Externa',
  EXTERNAL_REPAIR = 'Conserto Externo',
  INTERNAL_REPAIR = 'Conserto Interno',
  EXPIRED_CALIBRATION = 'Calibração Vencida',
  NOT_FOUND = 'Não encontrado',
  REJECTED_CALIBRATION = 'Calibração Reprovada',
  SCRAPPED = 'Sucateado',
  OK_SEAL = 'Selo de OK',
  OUT_OF_USE = 'Fora de uso',
  AWAITING_PARTS = 'Aguardando peça'
}

export enum CalibrationType {
  INTERNAL = 'Interna',
  EXTERNAL = 'Externa'
}

export enum IndicationType {
  DIGITAL = 'Digital',
  ANALOG = 'Analógico',
  ATTRIBUTE = 'Atributo'
}

export enum InstrumentClassification {
  DIMENSIONAL = 'Dimensional',
  ELECTRICITY = 'Eletricidade',
  TEMPERATURE = 'Temperatura',
  TORQUE = 'Torque',
  PRESSURE = 'Pressão'
}

export enum OSStatus {
  OPEN = 'Aberta',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluída',
  CANCELLED = 'Cancelada'
}

export enum OSPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  URGENT = 'Urgente'
}

export enum CalibrationResult {
  APPROVED = 'Aprovado',
  REJECTED = 'Reprovado',
  RELEASED = 'Liberado'
}

export interface Movement {
  id: string;
  date: string;
  type: 'Entrada' | 'Saída' | 'Transferência';
  origin: string;
  destination: string;
  availabilityResult: Availability;
  responsible: string;
  notes: string;
}

export interface CalibrationRecord {
  id: string;
  instrumentId: string;
  instrumentCode: string;
  type: CalibrationType;
  date: string;
  laboratoryId: string;
  laboratoryName: string;
  certificateNumber: string;
  result: CalibrationResult;
  technician: string;
  technicalAnalyst: string;
  osNumber?: string;
  nextDate: string;
  notes?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface Instrument {
  id: string;
  code: string;
  type: string;
  model: string;
  modelCode: string;
  manufacturer: string;
  indication: IndicationType;
  patrimony: string;
  serialNumber: string;
  classification: InstrumentClassification;
  range: {
    start: number;
    end: number;
    unit: string;
  };
  uncertainty?: number;
  status: OperationalStatus;
  availability: Availability;
  acquisitionDate: string;
  valueUsd: number;
  workCenter: string;
  area: string;
  metrologyFilial: string;
  location: {
    company: string;
    unit: string;
    directorate: string;
    department: string;
    section: string;
    costCenter: string;
    managers: string;
  };
  localOperator: string;
  isCalibrationStandard: boolean;
  calibrationType: CalibrationType;
  periodicityMonths: number;
  lastCalibrationDate: string;
  lastCalibrationCertificate: string;
  lastCalibrationResult: CalibrationResult | '';
  nextCalibrationDate: string;
  nonConforming: boolean;
  movements?: Movement[];
  calibrationHistory?: CalibrationRecord[];
}

export interface WorkOrder {
  id: string;
  instrumentCode: string;
  instrumentName: string;
  type: 'Calibração' | 'Manutenção' | 'Ajuste';
  serviceType: 'Interno' | 'Externo';
  priority: OSPriority;
  status: OSStatus;
  openedDate: string;
  forecastDate: string;
  completionDate?: string;
  technician: string;
  estimatedCost: number;
  realCost: number;
  partsReplaced: string[];
  certificateUrl?: string;
  notes: string;
  laboratoryId?: string;
}

export interface NonConformity {
  id: string;
  instrumentCode: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  deadline: string;
  responsible: string;
  status: 'Pendente' | 'Concluída';
}

export interface Supplier {
  id: string;
  name: string;
  document: string;
  status: string;
  rating: number;
  standards: string[];
  validUntil: string;
  lastAuditDate: string;
  observation: string;
}

export interface CalibrationLaboratory {
  id: string;
  supplierId: string;
  supplierName: string;
  validUntil: string;
  rating: string;
  standardProcedure: string;
  observation: string;
  attachments: string[];
  status: 'Ativo' | 'Inativo';
}
