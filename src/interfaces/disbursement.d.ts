export interface IDisbursement {
  _id?: string
  farmer?: string
  cooperative?: string
  ref_id?: string
  hectares?: number
  bundle?: string
  repayment_type?: string
  equity?: number
  loan_amount?: number
  repayment_amount?: number
  outstanding_loan?: number
  payable_amount?: number
  overage?: number
  status?: string
  isApproved?: boolean
  isEquityPaid?: boolean
  warehouse?: string
  repayedBy?: string
  project?: string
  disbursedBy?: string
  createdAt?: string
  updatedAt?: string
}
