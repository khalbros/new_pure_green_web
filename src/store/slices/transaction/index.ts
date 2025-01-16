import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {ITransaction} from "../../../interfaces/transaction"

const initialState: IReduxState<ITransaction> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const transactionSlice = createSlice({
  name: "transaction",
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

export const {initialize, success, failed, reset} = transactionSlice.actions
export const transactionSelector = (state: RootState) => state.transaction
export default transactionSlice.reducer
