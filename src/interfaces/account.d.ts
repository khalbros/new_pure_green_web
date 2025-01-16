export interface IAccount {
  first_name?: string
  last_name?: string
  other_name?: string
  bvn?: string
  nin?: string
  account_number?: string
  bank?: string
  bank_code?: string
  balance?: number
  passport?: { url: string; public_id: string }
  status?: string
  createdBy?: string
  createdAt?: string
  updateedAt?: string
}
