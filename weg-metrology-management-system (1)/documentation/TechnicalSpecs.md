
# Especificação Técnica - WEG Metrology

## 1. Resumo Técnico
Aplicação web para gestão de ciclos de vida de instrumentos industriais.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend (Recomendado)**: Node.js (NestJS) ou .NET 8 com PostgreSQL.
- **Justificativa**: React+Tailwind permite prototipagem rápida e alta fidelidade visual exigida pelo dashboard. PostgreSQL suporta JSONB para campos flexíveis de importação Autolab.

## 2. API OpenAPI (Exemplo Payloads)

### Importar Instrumento (Autolab Sync)
`POST /api/v1/integration/autolab/sync`
```json
{
  "external_id": "AUTOLAB-9988",
  "fields_mapping": {
    "TAG": "code",
    "DESC": "type",
    "SN": "serialNumber"
  },
  "data": {
    "TAG": "EQP-4500",
    "DESC": "Paquímetro Digital",
    "SN": "MIT-4455-Z",
    "STATUS": "A"
  }
}
```

## 3. Esquema de Banco de Dados (PostgreSQL)

### Tabela: `instruments`
- `id`: UUID (PK)
- `code`: VARCHAR(50) (UNIQUE)
- `type`: VARCHAR(100)
- `model`: VARCHAR(100)
- `indication`: ENUM('DIGITAL', 'ANALOG', 'ATTRIBUTE')
- `range_start`: DECIMAL, `range_end`: DECIMAL
- `next_calibration`: DATE
- `availability`: ENUM(...) - Vinculado a triggers em `movements`
- `non_conformity`: BOOLEAN DEFAULT FALSE

### Tabela: `movements`
- `id`: UUID
- `instrument_id`: FK
- `type`: ENUM('ENTRADA', 'SAIDA_EXTERNA', 'SAIDA_INTERNA')
- `destination_status`: Availability
- `responsible_id`: FK
- `created_at`: TIMESTAMP

## 4. Critérios de Aceite (Checklist MVP)
1. [ ] **Cálculo de Calibração**: Ao salvar, `nextCalibrationDate` deve ser o último dia do mês `current + periodicity`.
2. [ ] **Movimentações**: Alterar `availability` apenas via registro de movimentação, bloqueando edição direta no cadastro.
3. [ ] **Filtros de Auditoria**: Tabela deve suportar filtros combinados (Unidade + Status + Vencimento).
4. [ ] **Notificações**: Enviar e-mail automático 30 dias antes do vencimento (`Cron Job`).
5. [ ] **OS & Certificados**: Encerramento de OS exige upload de arquivo (PDF).

## 5. Mapeamento de Campos Autolab -> WEG Metrology
| Autolab Field | WEG Metrology Field | Transformação |
|---|---|---|
| ID_EQUIP | code | String trim |
| DS_EQUIP | type | UpperCase |
| VAL_AQUIS | valueUsd | Currency conversion if BRL |
| DT_ULT_CAL | lastCalibrationDate | ISO Date String |
