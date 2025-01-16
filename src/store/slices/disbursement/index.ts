import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IDisbursement} from "../../../interfaces/disbursement"

const initialState: IReduxState<IDisbursement> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const disbursementSlice = createSlice({
  name: "disbursement",
  initialState,
  reducers: {
    initialize: (state) => ({...state, isLoading: true}),
    success: (state, action) => ({
      ...state,
      isLoading: false,
      data: action.payload,
      error: undefined,
      message: undefined,
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

export const {initialize, success, failed, reset} = disbursementSlice.actions
export const disbursementSelector = (state: RootState) => state.disbursement
export default disbursementSlice.reducer
