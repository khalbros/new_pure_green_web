export interface ICooperative {
  _id?: string
  name?: string
  chairman?: string
  cac?: string
  phone?: string
  bvn?: string
  nin?: string
  village?: string
  team?: string
  supervisor?: string
  village_head?: string
  warehouse?: string
  certificate_number?: string
  certificate?: { url: string; public_id: string }
  collateral?: { url: string; public_id: string }
  isCertified?: boolean
  isApproved?: boolean
  createdAt?: string
  updatedAt?: string
  farmers?: number
}
