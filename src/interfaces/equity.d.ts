export interface IEquity {
  _id?: string
  farmer?: string
  cooperative?: string
  amount_paid?: number
  amount_per_hectare?: number
  hectares?: number
  status?: boolean
  paid_by?: string
  createdAt?: string
  updatedAt?: string
}
