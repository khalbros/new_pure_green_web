import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "../slices/auth.slice"
import createUserSlice from "../slices/users/create.slice"
import updateUserSlice from "../slices/users/update.slice"
import createWarehouseSlice from "../slices/warehouse"
import cooperativeSlice from "../slices/cooperative"
import inputSlice from "../slices/input"
import gradeSlice from "../slices/grade"
import bundleSlice from "../slices/bundle"
import commoditySlice from "../slices/commodity"
import clientSlice from "../slices/client/index"
import dispatchSlice from "../slices/dispatch/index"
import transactionSlice from "../slices/transaction/index"
import farmerSlice from "../slices/farmer/index"
import disbursementSlice from "../slices/disbursement/index"
import projectSlice from "../slices/project/index"
import teamSlice from "../slices/team/index"
import visitationSlice from "../slices/visitation/index"
import overageSlice from "../slices/finance/overage"
import paymentSlice from "../slices/finance/payment"
import equitySlice from "../slices/finance/equity"
import certificateSlice from "../slices/finance/certificate"
import registrationSlice from "../slices/finance/registration"
import farmer_authSlice from "../slices/farmer_auth.slice"

export const rootReducer = combineReducers({
  auth: authSlice,
  auth_farmer: farmer_authSlice,
  project: projectSlice,
  create_user: createUserSlice,
  update_user: updateUserSlice,
  warehouse: createWarehouseSlice,
  team: teamSlice,
  cooperative: cooperativeSlice,
  input: inputSlice,
  grade: gradeSlice,
  bundle: bundleSlice,
  visitation: visitationSlice,
  commodity: commoditySlice,
  client: clientSlice,
  dispatch: dispatchSlice,
  transaction: transactionSlice,
  farmer: farmerSlice,
  disbursement: disbursementSlice,
  overage: overageSlice,
  payment: paymentSlice,
  equity: equitySlice,
  certificate: certificateSlice,
  registration: registrationSlice,
})

export type RootState = ReturnType<typeof rootReducer>
