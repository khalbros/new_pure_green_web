import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IOverage} from "../../../interfaces/overage"

const initialState: IReduxState<IOverage> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const overageSlice = createSlice({
  name: "overage",
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

export const {initialize, success, failed, reset} = overageSlice.actions
export const overageSelector = (state: RootState) => state.overage
export default overageSlice.reducer
