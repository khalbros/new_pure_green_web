import { IWarehouse } from "./warehouse"

export interface IUser {
  _id?: string
  name?: string
  email?: string
  phone?: string
  gender?: string
  warehouse?: string | IWarehouse
  area_warehouse?: string[] | IWarehouse[]
  supervisor?: string | IUser
  field_officers?: string[] | IUser[]
  address?: string
  profile_img?: { url: string; public_id: string }
  password?: string
  role?: string
  isEnable?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IVerifedToken {
  userId: string
  name: string
  email: string
  phone: string
  role: string
  isEnable: boolean
}
