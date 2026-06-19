export interface Charger {
  id: string
  model: string
  powerKw: number
  connector: string
  segment: 'residential' | 'commercial'
  href: string
}

export const chargers: Charger[] = [
  { id: 'jc-duo-premium', model: 'JC-DUO Premium', powerKw: 22, connector: 'Type 2', segment: 'residential', href: '/productos/jc-duo-premium' },
  { id: 'jc-dc-ts-premium', model: 'JC-DC TS Premium', powerKw: 50, connector: 'CCS2 + CHAdeMO', segment: 'commercial', href: '/productos/jc-dc-ts-premium' },
  { id: 'jc-ac-wall', model: 'JC-AC Wall', powerKw: 7.4, connector: 'Type 2', segment: 'residential', href: '/productos/jc-ac-wall' },
  { id: 'jc-dc-fast-60', model: 'JC-DC Fast 60', powerKw: 60, connector: 'CCS2', segment: 'commercial', href: '/productos/jc-dc-fast-60' },
  { id: 'jc-dc-fast-120', model: 'JC-DC Fast 120', powerKw: 120, connector: 'CCS2', segment: 'commercial', href: '/productos/jc-dc-fast-120' },
  { id: 'jc-ac-pole', model: 'JC-AC Pole', powerKw: 22, connector: 'Type 2', segment: 'commercial', href: '/productos/jc-ac-pole' },
  { id: 'jc-dc-modular', model: 'JC-DC Modular', powerKw: 180, connector: 'CCS2', segment: 'commercial', href: '/productos/jc-dc-modular' },
  { id: 'jc-ac-smart', model: 'JC-AC Smart', powerKw: 11, connector: 'Type 2', segment: 'residential', href: '/productos/jc-ac-smart' },
  { id: 'jc-portable', model: 'JC-Portable', powerKw: 3.7, connector: 'Schuko / Type 2', segment: 'residential', href: '/productos/jc-portable' },
  { id: 'jc-fleet-hub', model: 'JC-Fleet Hub', powerKw: 400, connector: 'CCS2 x8', segment: 'commercial', href: '/productos/jc-fleet-hub' },
]
