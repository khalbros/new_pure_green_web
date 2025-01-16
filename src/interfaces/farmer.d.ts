export interface IFarmer {
  _id?: string
  farmer_id?: string
  first_name?: string
  last_name?: string
  other_name?: string
  gender?: string
  date_of_birth?: string
  phone?: string
  state?: string
  lga?: string
  village?: string
  address?: string
  farm_location?: string
  id_type?: string
  id_number?: string
  account_name?: string
  account_number?: string
  bvn?: string
  bank_name?: string
  id_card?: { url: string; public_id: string }
  cooperative?: string
  role?: string
  warehouse?: string
  guarantor_name?: string
  guarantor_number?: string
  guarantor_village?: string
  guarantor_id_type?: string
  guarantor_id_number?: string
  guarantor_id?: { url: string; public_id: string }
  guarantor_address?: string
  field_officer?: string
  supervisor?: string
  profile_img?: { url: string; public_id: string }
  reg_amount?: string
  equity_amount?: string
  isApproved?: string
  isValidId?: string
  isValidName?: string
  isValidDateOfBirth?: string
  isValidAccount?: string
  isValidGuarantorId?: string
  hasLoan?: string
  createdAt?: string
  updatedAt?: string
}
