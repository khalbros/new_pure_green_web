export interface IInput {
  _id?: string
  name?: string
  code?: string
  quantity?: number
  isApproved?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IWInput {
  _id?: string
  input?: IInput
  quantity?: number
  quantity_out?: number
  isApproved?: boolean
  warehouse?: unknown
  createdAt?: string
  updatedAt?: string
}
