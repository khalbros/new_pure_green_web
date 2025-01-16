export interface IWarehouse {
  _id?: string
  name?: string
  capacity?: string
  commodities?: { commodity: string; quantity: number }
  state?: string
  lga?: string
  address?: string
  warehouse_manager?: string[]
  warehouse_admin?: string[]
  isApproved?: boolean
  createdAt?: string
  updatedAt?: string
}
