import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IEquity} from "../../../interfaces/equity"

const initialState: IReduxState<IEquity> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const equitySlice = createSlice({
  name: "equity",
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

export const {initialize, success, failed, reset} = equitySlice.actions
export const equitySelector = (state: RootState) => state.equity
export default equitySlice.reducer
