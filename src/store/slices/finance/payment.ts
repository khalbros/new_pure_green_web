import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IPayment} from "../../../interfaces/payment"

const initialState: IReduxState<IPayment> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    initialize: (state) => ({...state, isLoading: true}),
    success: (state, action) => ({
      ...state,
      isLoading: false,
      data: action.payload,
      error: undefined,
    }),
    failed: (state, action) => ({
      ...state,
      isLoading: false,
      error: true,
      message: action.payload,
    }),
    reset: () => initialState,
  },
})

export const {initialize, success, failed, reset} = paymentSlice.actions
export const paymentSelector = (state: RootState) => state.payment
export default paymentSlice.reducer
