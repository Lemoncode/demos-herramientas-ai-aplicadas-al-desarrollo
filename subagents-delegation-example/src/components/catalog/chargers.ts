export interface Charger {
  id: string
  model: string
  powerKw: number
  connectorType: string
  segment: 'residential' | 'commercial'
  productPath: string
}

export const chargers: Charger[] = [
  { id: 'jc-duo-premium', model: 'JC-DUO Premium', powerKw: 22, connectorType: 'Type 2', segment: 'residential', productPath: '/vehiculo/jc-duo-premium' },
  { id: 'jc-dc-ts-premium', model: 'JC-DC TS Premium', powerKw: 50, connectorType: 'CCS2 + CHAdeMO', segment: 'commercial', productPath: '/vehiculo/jc-dc-ts-premium' },
  { id: 'jc-ac-wall', model: 'JC-AC Wall', powerKw: 7.4, connectorType: 'Type 2', segment: 'residential', productPath: '/vehiculo/jc-ac-wall' },
  { id: 'jc-dc-fast-60', model: 'JC-DC Fast 60', powerKw: 60, connectorType: 'CCS2', segment: 'commercial', productPath: '/vehiculo/jc-dc-fast-60' },
  { id: 'jc-dc-fast-120', model: 'JC-DC Fast 120', powerKw: 120, connectorType: 'CCS2', segment: 'commercial', productPath: '/vehiculo/jc-dc-fast-120' },
  { id: 'jc-ac-pole', model: 'JC-AC Pole', powerKw: 22, connectorType: 'Type 2', segment: 'commercial', productPath: '/vehiculo/jc-ac-pole' },
  { id: 'jc-dc-modular', model: 'JC-DC Modular', powerKw: 180, connectorType: 'CCS2', segment: 'commercial', productPath: '/vehiculo/jc-dc-modular' },
  { id: 'jc-ac-smart', model: 'JC-AC Smart', powerKw: 11, connectorType: 'Type 2', segment: 'residential', productPath: '/vehiculo/jc-ac-smart' },
  { id: 'jc-portable', model: 'JC-Portable', powerKw: 3.7, connectorType: 'Schuko / Type 2', segment: 'residential', productPath: '/vehiculo/jc-portable' },
  { id: 'jc-fleet-hub', model: 'JC-Fleet Hub', powerKw: 360, connectorType: 'CCS2 × 4', segment: 'commercial', productPath: '/vehiculo/jc-fleet-hub' },
]
