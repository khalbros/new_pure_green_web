import {IDisbursement} from "./disbursement"
import {IUser} from "./user"

export interface IGrainLRP {
  _id?: string
  disbursement?: string
  ref_id?: string
  commodities?: {
    commodity?: string
    quantity?: number
    gross_weight?: number
    net_weight?: number
    pp?: number
    grade?: string
  }[]
  payable_amount?: number
  gross_weight?: number
  net_weight?: number
  num_bags?: number
  logistics_fee?: number
  processing_fee?: number
  status?: string
  repayedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface IGrainLRPPayload {
  _id?: string
  disbursement?: IDisbursement
  ref_id?: string
  commodities?: {
    commodity?: string
    quantity?: number
    gross_weight?: number
    net_weight?: number
    pp?: number
    grade?: string
  }[]
  payable_amount?: number
  gross_weight?: number
  net_weight?: number
  num_bags?: number
  logistics_fee?: number
  processing_fee?: number
  status?: string
  repayedBy?: IUser
  createdAt?: string
  updatedAt?: string
}

export interface IGrainFormData extends IGrainLRP {
  farmer?: string
  overage?: number
  outstandin_loan?: number
  repayment_type?: string
}
