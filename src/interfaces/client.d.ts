export interface IClient {
  _id?: string
  name?: string
  client_id?: string
  email?: string
  address?: string
  phone?: string
  account_number?: string
  profile_img?: { url: string; public_id: string }
  bank_name?: string
  isApproved?: boolean
  createdAt?: string
  updatedAt?: string
}
