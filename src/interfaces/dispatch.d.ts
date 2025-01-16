export interface IDispatch {
  _id?: string
  type?: string
  client?: string
  warehouse?: string
  item?: string
  input?: string
  commodity?: string
  item_type?: string
  grade?: string
  gross_weight?: string
  net_weight?: string
  num_bags?: string
  driver?: string
  truck_num?: string
  status?: string
  isApproved?: boolean
  isReceived?: boolean
  createdBy?: string
  receivedBy?: string
  approvedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface PopulatedChild {
  _id?: string
  name?: string
}

export interface IItem {
  _id?: string
  name?: string
  quantity?: number
}
