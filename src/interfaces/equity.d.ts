export interface IEquity {
  _id?: string
  farmer?: string
  warehouse?: string
  cooperative?: string
  amount_paid?: number
  amount_per_hectare?: number
  hectares?: number
  hectares_used?: number
  status?: string
  paid_by?: string
  createdAt?: string
  updatedAt?: string
}
