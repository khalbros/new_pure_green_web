import {IDisbursement} from "./disbursement"
import {IUser} from "./user"

export interface ICashLRP {
  _id?: string
  disbursement?: string
  ref_id?: string
  cash_paid?: number
  logistics_fee?: number
  processing_fee?: number
  outstanding_loan?: number
  overage?: number
  status?: string
  repayedBy?: string
  createdAt?: string
  updatedAt?: string
}
export interface ICashLRPPayload {
  _id?: string
  disbursement?: IDisbursement
  ref_id?: string
  cash_paid?: number
  logistics_fee?: number
  processing_fee?: number
  outstanding_loan?: number
  overage?: number
  status?: string
  repayedBy?: IUser
  createdAt?: string
  updatedAt?: string
}

export interface ICashFormdata extends ICashLRP {
  farmer?: string
  outstanding_loan?: number
  overage?: number
  payable_amount?: number
}
