export type PersonStatus = 'active' | 'on-leave'

export interface Person {
  id: string
  name: string
  role: string
  status: PersonStatus
  joinedDate: string
}

export const people: Person[] = [
  { id: 'p1', name: 'Marta Alonso', role: 'Backend Engineer', status: 'active', joinedDate: '2021-06-01' },
  { id: 'p2', name: 'Diego Ruiz', role: 'Product Designer', status: 'on-leave', joinedDate: '2022-11-15' },
  { id: 'p3', name: 'Helena Costa', role: 'Frontend Engineer', status: 'active', joinedDate: '2023-01-10' },
  { id: 'p4', name: 'Omar Haddad', role: 'QA Engineer', status: 'active', joinedDate: '2020-09-20' },
  { id: 'p5', name: 'Lucía Fernández', role: 'Engineering Manager', status: 'active', joinedDate: '2019-02-05' },
  { id: 'p6', name: 'Sofia Larsson', role: 'Site Reliability Engineer', status: 'on-leave', joinedDate: '2022-04-18' },
  { id: 'p7', name: 'Kenji Watanabe', role: 'Data Engineer', status: 'active', joinedDate: '2023-07-03' },
  { id: 'p8', name: 'Priya Nair', role: 'Support Lead', status: 'active', joinedDate: '2021-12-01' },
]
